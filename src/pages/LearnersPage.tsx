import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, School, Calendar, Award, Target, BookMarked, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LearnersPage() {
  const { user, profile } = useAuth();

  return (
    <div className="space-y-10 pb-32">
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-primary/20 via-indigo-500/20 to-purple-500/20 rounded-[3rem] border border-primary/10 overflow-hidden">
           <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.4))] -z-10"></div>
        </div>
        
        <div className="px-10 -mt-20 flex flex-col md:flex-row items-end gap-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl shadow-slate-200"
          >
            <div className="w-full h-full rounded-[2rem] bg-slate-900 overflow-hidden flex items-center justify-center text-white relative">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={64} className="text-primary" />
              )}
              <div className="absolute bottom-0 right-0 p-2">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center ring-4 ring-white shadow-lg">
                   <ShieldCheck size={16} className="text-white" />
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mb-4 flex-1">
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user?.displayName || 'Cardify User'}</h1>
             <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">{profile?.role || 'Learner'}</span>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <Mail size={14} /> {user?.email}
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
             <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8 flex items-center gap-2">
               <Award size={22} className="text-amber-500" /> Academic Credentials
             </h3>
             <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled Class</p>
                  <p className="text-lg font-black text-slate-800">{profile?.class || 'Not Assigned'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <p className="text-lg font-black text-slate-800">Active</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration Date</p>
                  <p className="text-lg font-black text-slate-800">January 2024</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Authority</p>
                  <p className="text-lg font-black text-slate-800 capitalize">{profile?.role || 'Learner'}</p>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-white">
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
             <h3 className="text-lg font-black text-white tracking-tight mb-8 italic">Learning Milestones</h3>
             <div className="space-y-6">
                {[
                  {label: 'Flashcards Mastered', value: '128', sub: 'Top 5% of class', icon: BookMarked},
                  {label: 'Total Study Time', value: '14h 22m', sub: 'Calculated this week', icon: Calendar},
                  {label: 'Accuracy Rate', value: '92%', sub: 'Revision Assistant tests', icon: Target}
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-3xl group hover:bg-white/10 transition-colors">
                    <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                       <stat.icon size={28} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h4>
                      <div className="flex items-baseline gap-3">
                         <span className="text-2xl font-black text-white">{stat.value}</span>
                         <span className="text-[10px] font-bold text-primary italic uppercase">{stat.sub}</span>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 mx-auto mb-6">
                 <ShieldCheck size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-3">Identity Verified</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                Your profile is securely synchronized with your Google Workspace education account.
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center gap-2">
                 <School size={16} className="text-slate-400" />
                 <span className="text-xs font-black text-slate-600 uppercase tracking-widest italic">Academic Division</span>
              </div>
           </div>

           <motion.div 
             whileHover={{ scale: 1.02 }}
             className="bg-primary p-8 rounded-[3rem] shadow-xl shadow-primary/30 text-white relative overflow-hidden group cursor-pointer"
           >
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.1))]"></div>
              <h3 className="text-lg font-black tracking-tight mb-2">Sync Profile</h3>
              <p className="text-white/70 text-xs leading-relaxed mb-6">Force manual refresh of your academic metadata from the central server.</p>
              <button className="w-full bg-white text-primary py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg group-hover:bg-slate-900 group-hover:text-white transition-all">Execute Sync</button>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
