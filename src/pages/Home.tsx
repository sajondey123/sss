import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, CreditCard, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="bg-indigo-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://i.ibb.co.com/PzhQk3qP/Beauty-Plus-IMAGE-ENHANCER-1772627025020.png" 
              alt="Logo" 
              className="h-32 mx-auto mb-8 drop-shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              শ্রী শ্রী গনেশ পূজা উদযাপন পরিষদ ২০২৬
            </h1>
            <p className="text-xl md:text-2xl text-orange-400 font-medium mb-8">
              গণরাজ একতা সংঘ
            </p>
            <p className="text-lg opacity-80 mb-12 max-w-2xl mx-auto">
              বি.জি.বি ক্যাম্প বনরুপ পাড়া কক্সবাজার। ২৬শে প্রথম প্রয়াসে আমরা একটি সুন্দর ও তথ্যবহুল ডিজিটাল সদস্য ব্যবস্থাপনা সিস্টেম চালু করছি।
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/apply"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold text-lg transition-all shadow-lg hover:scale-105"
              >
                সদস্য পদের জন্য আবেদন করুন
              </Link>
              <Link
                to="/admin"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-full font-bold text-lg transition-all backdrop-blur-sm"
              >
                অ্যাডমিন ড্যাশবোর্ড
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto py-20 px-4 grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Users className="h-10 w-10 text-indigo-600" />}
          title="সহজ আবেদন"
          description="অনলাইনের মাধ্যমে খুব সহজেই সদস্য পদের জন্য আবেদন করা যাবে।"
        />
        <FeatureCard 
          icon={<CreditCard className="h-10 w-10 text-indigo-600" />}
          title="ডিজিটাল আইডি কার্ড"
          description="অনুমোদনের পর কিউআর কোড সম্বলিত ডিজিটাল আইডি কার্ড ডাউনলোড করা যাবে।"
        />
        <FeatureCard 
          icon={<CheckCircle className="h-10 w-10 text-indigo-600" />}
          title="দ্রুত যাচাইকরণ"
          description="কিউআর কোড স্ক্যান করে তাৎক্ষণিকভাবে সদস্যপদ যাচাই করা সম্ভব।"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center"
    >
      <div className="flex justify-center mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
