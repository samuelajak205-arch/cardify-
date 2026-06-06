import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, BookOpen, BarChart3, AlertTriangle, Users, FileText, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const coverageData = [
  { name: 'Math', coverage: 85 },
  { name: 'Physics', coverage: 70 },
  { name: 'Chem', coverage: 90 },
];

export default function TeacherDashboard() {
  const { role, user } = useAuth();
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    async function checkTodayStatus() {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      const docRef = doc(db, 'attendance', `${today}_${user.uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCheckedIn(true);
      }
    }
    checkTodayStatus();
  }, [user]);

  const handleCheckIn = async () => {
    if (!user) return;
    setCheckingIn(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await setDoc(doc(db, 'attendance', `${today}_${user.uid}`), {
        userId: user.uid,
        status: 'present',
        date: today,
        type: 'teacher',
        markedBy: user.uid,
        updatedAt: serverTimestamp()
      });
      setCheckedIn(true);
      alert("Clock-in successful!");
    } catch (e) {
      console.error(e);
      alert("Clock-in failed.");
    } finally {
      setCheckingIn(false);
    }
  };

  if (role !== 'teacher' && role !== 'admin') return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Restricted</h2>
      <p className="text-slate-500 mt-2 max-w-xs">You don't have the necessary permissions to view the teacher control panel.</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Faculty <span className="text-primary italic">Console</span></h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Managing Academic Excellence</p>
        </div>
        <div className="flex items-center gap-2">
           {!checkedIn ? (
             <motion.button 
               whileHover={{ y: -2 }}
               whileTap={{ scale: 0.95 }}
               onClick={handleCheckIn}
               disabled={checkingIn}
               className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2"
             >
               <Users size={16} /> {checkingIn ? 'Clocking In...' : 'Clock In for Today'}
             </motion.button>
           ) : (
             <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-widest">Active Shift: Checked In</span>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 size={22} className="text-primary"/> Curriculum Coverage
            </h3>
            <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest">Term 2 Analytics</span>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coverageData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                />
                <Tooltip 
                   cursor={{fill: '#f8fafc', radius: 10}}
                   contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="coverage" fill="var(--primary)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-xl shadow-black/20">
              <BookOpen size={32} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-2">Class Actions</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">Execute administrative tasks and manage learner performance data efficiently.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            <Link to="/teacher/class-reports" className="flex items-center justify-center bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95">
              Reports
            </Link>
            <Link to="/teacher/attendance" className="flex items-center justify-center bg-white/10 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all active:scale-95">
              Attendance
            </Link>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {label: 'Students Subscribed', value: '142', sub: '+12 this week', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50'},
          {label: 'Resources Uploaded', value: '48', sub: 'Last 24h', icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50'},
          {label: 'Pending Reviews', value: '18', sub: 'Action required', icon: MessageSquare, color: 'text-rose-500', bg: 'bg-rose-50'},
          {label: 'Avg. Performance', value: '72%', sub: 'Across 4 classes', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50'}
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
             <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
               <card.icon className={card.color} size={24} />
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
               <p className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</p>
               <p className="text-[10px] font-bold text-slate-400 mt-1 italic">{card.sub}</p>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
