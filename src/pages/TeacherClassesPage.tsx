import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Users, Send, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

export default function TeacherClassesPage() {
  const { role } = useAuth();

  if (role !== 'teacher' && role !== 'admin') return <div className="p-8 text-center font-bold text-slate-400">Access Denied</div>;

  const classes = [
    { id: 1, name: 'Senior 4 Math', learnersCount: 32, iconColor: 'bg-blue-100 text-blue-600', code: 'S4-MTH' },
    { id: 2, name: 'Senior 3 Physics', learnersCount: 28, iconColor: 'bg-indigo-100 text-indigo-600', code: 'S3-PHY' },
    { id: 3, name: 'Senior 1 Science', learnersCount: 45, iconColor: 'bg-emerald-100 text-emerald-600', code: 'S1-SCI' },
  ];

  return (
    <div className="space-y-10 pb-32">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assigned <span className="text-primary italic">Classes</span></h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Managing {classes.length} active cohorts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {classes.map(cls => (
          <motion.div 
            key={cls.id} 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-slate-200/50"
          >
            <div className={`w-14 h-14 ${cls.iconColor} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
              <BookOpen size={28} />
            </div>
            
            <div className="mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">{cls.code}</span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">{cls.name}</h2>
              <div className="flex items-center gap-2 mt-3">
                <Users size={14} className="text-slate-300" />
                <span className="text-xs font-bold text-slate-500">{cls.learnersCount} Registered Learners</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-slate-900 text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                <Send size={14} className="text-primary" /> Send Note
              </button>
              <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100">
                <BarChart3 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-black text-white tracking-tight mb-2 italic">Broadcast Notification</h2>
          <p className="text-slate-400 text-sm font-medium mb-6">Send an instant announcement to all learners across all your assigned classes.</p>
          
          <div className="relative group">
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white placeholder-slate-500 focus:bg-white focus:text-slate-900 focus:ring-8 focus:ring-primary/20 transition-all outline-none font-medium mb-4" 
              rows={4} 
              placeholder="Type your announcement here..."
            ></textarea>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2 ml-auto"
            >
              <Send size={18} /> Transmit to All
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
