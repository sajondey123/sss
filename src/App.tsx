import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Apply from './pages/Apply';
import MemberProfile from './pages/MemberProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/member/:keyword" element={<MemberProfile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
            </Routes>
          </main>
          <footer className="bg-indigo-950 text-white py-8 text-center">
            <div className="max-w-7xl mx-auto px-4">
              <p className="text-sm opacity-70">
                © 2026 শ্রী শ্রী গনেশ পূজা উদযাপন পরিষদ। গণরাজ একতা সংঘ।
              </p>
              <p className="text-xs mt-2 opacity-50">
                বি.জি.বি ক্যাম্প বনরুপ পাড়া কক্সবাজার
              </p>
            </div>
          </footer>
        </div>
      </ErrorBoundary>
    </Router>
  );
}
