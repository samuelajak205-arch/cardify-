import React from 'react';
import { BookOpen, Award, BarChart2, MessageSquare, AlertCircle, TrendingUp, Calendar, CreditCard, Zap, AlertTriangle, User } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockSubjects, mockComments, mockStats } from '../../lib/mockData';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { checkAttendanceNotifications } from '../../lib/notificationService';

const trendData = [
  { name: 'Term 1', score: 70 },
  { name: 'Term 2', score: 75 },
  { name: 'Term 3', score: 78.75 }
];

export default function StudentDashboard() {
  const { role } = useAuth();
  const notification = checkAttendanceNotifications(1);

  return (
    <div className="space-y-8 pb-32">
      {notification && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-100 text-red-800 p-5 rounded-[1.5rem] flex gap-4 items-center shadow-sm"
          >
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                  <p className="font-bold text-sm tracking-tight">{notification.title}</p>
                  <p className="text-xs text-red-700/80 mt-0.5">{notification.message}</p>
              </div>
          </motion.div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic <span className="text-primary italic">Overview</span></h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Welcome back, Student</p>
        </div>
        <Link to="/revision-assistant">
          <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-slate-200"
          >
              <Zap size={18} className="text-yellow-400 fill-yellow-400 group-hover:animate-pulse" /> 
              <span>AI Revision Assistant</span>
          </motion.button>
        </Link>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            {label: 'Mean Grade', value: `${mockStats.average}%`, icon: Award, color: 'text-amber-500', bg: 'bg-amber-50'},
            {label: 'Class Rank', value: mockStats.rank, icon: BarChart2, color: 'text-blue-500', bg: 'bg-blue-50'},
            {label: 'Course Attendance', value: `${mockStats.attendance}%`, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50'},
            {label: 'Outstanding Dues', value: `UGX ${mockStats.feeBalance.toLocaleString()}`, icon: CreditCard, color: 'text-rose-500', bg: 'bg-rose-50'}
        ].map((card, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
            >
                <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={card.color} size={24} />
                </div>
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</h3>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</p>
                </div>
            </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp size={22} className="text-primary"/> Progress Analytics
              </h3>
              <select className="bg-slate-50 border-none rounded-xl text-xs font-bold p-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                <option>Annual View</option>
                <option>By Term</option>
              </select>
            </div>
            <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                        />
                        <Tooltip 
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                          itemStyle={{fontWeight: 800, color: 'var(--primary)'}}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="var(--primary)" 
                          strokeWidth={4} 
                          dot={{r: 6, fill: 'var(--primary)', strokeWidth: 3, stroke: '#fff'}}
                          activeDot={{r: 8, strokeWidth: 0}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Subjects list */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Course Mastery</h3>
            <div className="space-y-6">
                {mockSubjects.map((s, i) => (
                    <motion.div 
                      key={s.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex justify-between items-end text-sm mb-2">
                          <span className="font-bold text-slate-700">{s.name}</span>
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest px-2 py-1 bg-primary/5 rounded-lg">{s.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-50 rounded-full h-3 p-0.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${s.progress}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="bg-primary h-2 rounded-full shadow-sm shadow-primary/20" 
                          />
                      </div>
                    </motion.div>
                ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50">
              <button className="w-full py-3 text-xs font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">Explore Full Syllabus</button>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-primary via-primary to-indigo-600 p-10 rounded-[3rem] shadow-2xl shadow-primary/30 text-white relative overflow-hidden group"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-3 tracking-tight">Revision <span className="opacity-70 italic">Engine</span></h3>
            <p className="text-white/80 text-sm font-medium leading-relaxed max-w-xs mb-8">
              Instantly summarize heavy notes, generate flashcards from photos, or get AI-powered answers.
            </p>
            <Link to="/revision-assistant" className="bg-white text-primary px-8 py-4 rounded-2xl text-sm font-black hover:shadow-xl hover:scale-105 active:scale-95 transition-all inline-block shadow-lg">
              Launch Intelligence
            </Link>
          </div>
        </motion.div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Flashcards</h3>
            <Link to="/flashcards" className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/5 rounded-full hover:bg-primary/10 transition-colors italic">Smart Study</Link>
          </div>
          <div className="space-y-4">
             {[
               {tag: 'Math', title: 'Calculus Fundamentals', color: 'bg-blue-50 text-blue-700'},
               {tag: 'Physics', title: 'Quantum Mechanics Intro', color: 'bg-indigo-50 text-indigo-700'},
               {tag: 'Bio', title: 'Cellular Respiration', color: 'bg-emerald-50 text-emerald-700'}
             ].map((card, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-50 hover:bg-white hover:border-slate-100 hover:shadow-lg hover:shadow-slate-100 transition-all cursor-pointer group">
                  <div className={`px-2 py-1 rounded text-[10px] font-black uppercase ${card.color}`}>
                    {card.tag}
                  </div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{card.title}</p>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Teacher Remarks section - stylized */}
      <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]"></div>
        <h3 className="text-xl font-black text-white tracking-tight mb-8 relative z-10">Faculty <span className="text-primary italic">Feedback</span></h3>
        <div className="grid md:grid-cols-2 gap-6 relative z-10">
          {mockComments.map((c, i) => (
            <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl hover:bg-white/10 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary font-bold">
                   <User size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-tight">{c.teacher}</h4>
                  <p className="text-slate-400 text-xs font-medium italic mt-1 leading-relaxed">"{c.comment}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
