import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  LayoutDashboard, Users, UserCheck, UserX, Clock, 
  Search, Filter, LogOut, ExternalLink, Check, X, Trash2, 
  Download, Shield, MoreVertical, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    if (isAdmin !== 'true') {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    if (isAdmin !== 'true') return;

    const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memberData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(memberData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'members');
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'members', id), { 
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `members/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteDoc(doc(db, 'members', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `members/${id}`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || m.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: members.length,
    approved: members.filter(m => m.status === 'approved').length,
    pending: members.filter(m => m.status === 'pending').length,
    rejected: members.filter(m => m.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-indigo-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1A1C2E] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-orange-400" />
            <div>
              <h2 className="font-bold text-sm tracking-widest uppercase">Admin Panel</h2>
              <p className="text-[10px] opacity-50">BNCC STYLE v1.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 transition-colors">
            <Users className="h-5 w-5" /> Members
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Admin</p>
              <p className="text-[10px] opacity-50">Administrator</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-x-hidden">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500 text-sm">Welcome back, Commander.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name or ID..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Users className="text-blue-600" />} label="Total Applicants" value={stats.total} color="bg-blue-50" />
          <StatCard icon={<UserCheck className="text-green-600" />} label="Approved" value={stats.approved} color="bg-green-50" />
          <StatCard icon={<Clock className="text-orange-600" />} label="Pending" value={stats.pending} color="bg-orange-50" />
          <StatCard icon={<UserX className="text-red-600" />} label="Rejected" value={stats.rejected} color="bg-red-50" />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                filterStatus === status 
                ? 'bg-indigo-900 text-white shadow-md' 
                : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Keyword ID</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence mode="popLayout">
                  {filteredMembers.map(member => (
                    <motion.tr 
                      key={member.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={member.photoURL} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{member.fullName}</p>
                            <p className="text-[10px] text-gray-500">{member.bloodGroup} | {member.dob}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-[10px] bg-gray-100 px-2 py-1 rounded font-mono font-bold text-indigo-600">
                          {member.keyword}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{member.designation}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                          member.status === 'approved' ? 'bg-green-100 text-green-700' :
                          member.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/member/${member.keyword}`)}
                            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                            title="View Profile"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          
                          {member.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleStatusUpdate(member.id, 'approved')}
                                className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(member.id, 'rejected')}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          {member.status !== 'pending' && (
                             <button 
                               onClick={() => handleStatusUpdate(member.id, 'pending')}
                               className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                               title="Reset to Pending"
                             >
                               <Clock className="h-4 w-4" />
                             </button>
                          )}

                          <button 
                            onClick={() => handleDelete(member.id)}
                            className="p-2 text-gray-300 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredMembers.length === 0 && (
              <div className="py-20 text-center">
                <Users className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">No applicants found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
