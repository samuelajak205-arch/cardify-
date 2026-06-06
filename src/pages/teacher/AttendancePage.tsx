import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, ClipboardCheck, Save, Users, Calendar, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  collection, getDocs, query, where, doc, 
  setDoc, serverTimestamp, getDoc 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AttendancePage() {
  const { role, user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [today] = useState(new Date().toISOString().split('T')[0]);

  if (role !== 'teacher' && role !== 'admin') {
    return <div className="p-8 text-center text-slate-400 font-bold">Unauthorized Access</div>;
  }

  useEffect(() => {
    fetchStudentsAndTodayAttendance();
  }, [today]);

  async function fetchStudentsAndTodayAttendance() {
    setLoading(true);
    try {
      // Fetch all students (simplified for this turn)
      const q = query(collection(db, 'users'), where('role', '==', 'student'));
      const studentSnapshot = await getDocs(q);
      const studentList = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentList);

      // Fetch today's attendance records to pre-fill
      const attQ = query(collection(db, 'attendance'), where('date', '==', today));
      const attSnapshot = await getDocs(attQ);
      const attMap: {[key: string]: string} = {};
      attSnapshot.forEach(doc => {
        const data = doc.data();
        attMap[data.userId] = data.status;
      });
      setAttendance(attMap);

      // Default all to present if not marked
      const initialAtt = { ...attMap };
      studentList.forEach(s => {
        if (!initialAtt[s.id]) initialAtt[s.id] = 'present';
      });
      setAttendance(initialAtt);

    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveAttendance() {
    setSaving(true);
    try {
      const promises = Object.entries(attendance).map(([userId, status]) => {
        const attendanceId = `${today}_${userId}`;
        return setDoc(doc(db, 'attendance', attendanceId), {
          userId,
          status,
          date: today,
          type: 'student',
          markedBy: user?.uid,
          updatedAt: serverTimestamp()
        }, { merge: true });
      });
      await Promise.all(promises);
      alert("Attendance saved successfully!");
    } catch (error) {
       console.error("Error saving attendance:", error);
       alert("Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  }

  const toggleStatus = (id: string) => {
    setAttendance(prev => {
      const current = prev[id];
      let next = 'present';
      if (current === 'present') next = 'late';
      else if (current === 'late') next = 'absent';
      else next = 'present';
      return { ...prev, [id]: next };
    });
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'present': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'late': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'absent': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="space-y-10 pb-32">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daily <span className="text-primary italic">Attendance</span></h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <button 
          onClick={saveAttendance}
          disabled={saving || loading}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-primary transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? 'Transmitting...' : <><Save size={18} /> Commit Registry</>}
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Users size={20} className="text-primary" />
              <span className="text-sm font-black text-slate-900">Learner Registry (S4 Math)</span>
           </div>
           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Managed: {students.length} Learners
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Learner</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={3} className="p-20 text-center text-slate-400 font-bold">Synchronizing...</td></tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black italic">
                             {s.displayName?.[0] || s.email?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 leading-none">{s.displayName || 'Unnamed student'}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1">{s.class || 'No Class'}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusStyle(attendance[s.id])}`}>
                          {attendance[s.id]}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button 
                         onClick={() => toggleStatus(s.id)}
                         className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-slate-100"
                       >
                         <Check size={18} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
