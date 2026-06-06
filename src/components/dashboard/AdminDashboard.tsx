import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, UserPlus, TrendingUp, BarChart3, 
  ArrowRight, BookOpen, CreditCard, Shield, Clock, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, getCountFromServer, query, where, getDocs, 
  limit, orderBy, Timestamp, doc, getDoc 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [presentToday, setPresentToday] = useState<number>(0);
  const [teacherAttendance, setTeacherAttendance] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Total Users
        const usersColl = collection(db, 'users');
        const usersSnapshot = await getCountFromServer(usersColl);
        setTotalUsers(usersSnapshot.data().count);

        const today = new Date().toISOString().split('T')[0];
        
        // Students Present Today
        const attendanceQuery = query(
          collection(db, 'attendance'),
          where('date', '==', today),
          where('status', '==', 'present'),
          where('type', '==', 'student')
        );
        const attendanceSnapshot = await getCountFromServer(attendanceQuery);
        setPresentToday(attendanceSnapshot.data().count);

        // Fetch Staff (Teachers) Attendance
        const teacherAttQuery = query(
          collection(db, 'attendance'),
          where('date', '==', today),
          where('type', '==', 'teacher')
        );
        const teacherAttSnapshot = await getDocs(teacherAttQuery);
        
        // Match with User names
        const attDocs = teacherAttSnapshot.docs.map(d => d.data());
        const userPromises = attDocs.map(att => getDoc(doc(db, 'users', att.userId)));
        const userSnaps = await Promise.all(userPromises);
        
        const teacherLogs = attDocs.map((att, i) => {
          const userData = userSnaps[i].data();
          return {
            name: userData?.displayName || userData?.email || 'Unknown',
            status: att.status,
            time: att.updatedAt?.toDate() ? new Date(att.updatedAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'
          };
        });
        setTeacherAttendance(teacherLogs);
        
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Enrolled', value: totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Present Today', value: presentToday, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Expected Total', value: 156, icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Revenue (UGX)', value: '8.4M', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System <span className="text-primary italic">Administration</span></h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">School-wide Oversight & Controls</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/users">
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200 flex items-center gap-2"
            >
              <Shield size={16} className="text-primary" /> Manage User Roles
            </motion.button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
             <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
               <stat.icon className={stat.color} size={24} />
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <div className="flex items-baseline gap-2">
                 <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                 {stat.label === 'Present Today' && (
                   <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-[10px] font-bold text-primary hover:underline"
                   >
                     {showDetails ? 'Hide' : 'Details'}
                   </button>
                 )}
               </div>
             </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900 rounded-[3rem] p-10 text-white overflow-hidden"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h4 className="text-primary font-black uppercase tracking-widest text-[10px]">Enrollment Health</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Target Attendance</span>
                    <span className="font-bold">95%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[94%]"></div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">Expected: 156 students per registry</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-primary font-black uppercase tracking-widest text-[10px]">Financial Status</h4>
                <div className="space-y-2">
                   <p className="text-2xl font-black text-white">UGX 4.2M</p>
                   <p className="text-[10px] text-slate-400">Outstanding fee balance across all classes.</p>
                   <Link to="/admin/fees" className="text-xs text-primary font-bold hover:underline">View Fee Reports →</Link>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-primary font-black uppercase tracking-widest text-[10px]">Academic Yield</h4>
                <div className="space-y-2">
                   <p className="text-2xl font-black text-white">B+ Avg</p>
                   <p className="text-[10px] text-slate-400">Mean grade across all subjects this term.</p>
                   <Link to="/admin/results" className="text-xs text-primary font-bold hover:underline">Class Rankings →</Link>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-primary font-black uppercase tracking-widest text-[10px]">Staff Efficiency</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Teachers</span>
                    <span className="font-bold">12 / 12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coverage</span>
                    <span className="font-bold">88%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Clock size={22} className="text-primary"/> Teacher Attendance Monitoring
            </h3>
            <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest">Live Monitoring</span>
          </div>
          
          <div className="space-y-4">
            {teacherAttendance.length === 0 ? (
              <p className="text-center py-10 text-slate-400 italic">No teacher check-ins recorded today.</p>
            ) : (
              teacherAttendance.map((teacher, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-50 hover:bg-white hover:border-slate-100 hover:shadow-lg hover:shadow-slate-100 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 font-black italic">
                      {teacher.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-none">{teacher.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Signed In Today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sign In</p>
                      <p className="text-xs font-bold text-slate-700">{teacher.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      teacher.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {teacher.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-50 flex justify-center">
            <button className="text-xs font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">View Detailed Personnel Logs</button>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
           <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                 <Shield size={32} />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">Internal <span className="italic text-primary">Audit</span></h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                Verify system integrity. Ensure all {totalUsers} users have correct permissions and valid credentials.
              </p>
           </div>
           
           <div className="space-y-3 relative z-10">
              <Link to="/admin/users" className="block w-full bg-white text-slate-900 py-4 rounded-2xl text-center font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg">
                Assign User Roles
              </Link>
              <button className="w-full bg-white/10 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">
                Export Attendance Data
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
