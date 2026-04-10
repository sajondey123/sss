import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, Loader2, ArrowLeft, MapPin, Calendar, Droplets } from 'lucide-react';
import IDCard from '../components/IDCard';

export default function MemberProfile() {
  const { keyword } = useParams();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const q = query(collection(db, 'members'), where('keyword', '==', keyword));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setMember(querySnapshot.docs[0].data());
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `members/${keyword}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [keyword]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">সদস্য পাওয়া যায়নি</h2>
        <p className="text-gray-600 mb-8">দুঃখিত, এই কিউআর কোড বা আইডির সাথে কোনো সদস্যের তথ্য মেলেনি।</p>
        <Link to="/" className="text-indigo-600 font-bold hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="h-4 w-4" /> ফিরে যান
        </Link>
      </div>
    );
  }

  const isApproved = member.status === 'approved';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Verification Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-100">
                <img src={member.photoURL} alt={member.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{member.fullName}</h1>
                <p className="text-indigo-600 font-medium">{member.designation}</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-4 rounded-xl mb-8 ${isApproved ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
              {isApproved ? (
                <>
                  <ShieldCheck className="h-6 w-6" />
                  <span className="font-bold">Verified Member (Approved)</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-6 w-6" />
                  <span className="font-bold">Not Verified (Pending/Rejected)</span>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="h-5 w-5 opacity-50" />
                <span>Date of Birth: <strong>{member.dob}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Droplets className="h-5 w-5 opacity-50" />
                <span>Blood Group: <strong className="text-red-600">{member.bloodGroup}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-5 w-5 opacity-50" />
                <span>Location: <strong>Cox's Bazar</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-2">সংগঠনের তথ্য:</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              শ্রী শ্রী গনেশ পূজা উদযাপন পরিষদ ২০২৬ ইং গণরাজ একতা সংঘ। বি.জি.বি ক্যাম্প বনরুপ পাড়া কক্সবাজার।
            </p>
          </div>
        </motion.div>

        {/* ID Card Display */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-center"
        >
          {isApproved ? (
            <IDCard member={member} />
          ) : (
            <div className="bg-gray-100 w-[350px] h-[550px] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8 text-center">
              <ShieldAlert className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-gray-500">আইডি কার্ড এখনো তৈরি হয়নি</h3>
              <p className="text-sm text-gray-400 mt-2">আবেদনটি অনুমোদিত হওয়ার পর এখানে আইডি কার্ড দেখা যাবে।</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
