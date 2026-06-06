import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, ShieldCheck, ShieldAlert, 
  Search, Filter, ChevronDown, Save, X, User as UserIcon, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, getDocs, doc, updateDoc, 
  deleteDoc, query, orderBy 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth, Role } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function UserManagementPage() {
  const { role: currentUserRole, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editingRole, setEditingRole] = useState<Role | ''>('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');

  useEffect(() => {
    if (currentUserRole === 'admin') {
      fetchUsers();
    }
  }, [currentUserRole]);

  if (authLoading) {
    return <div className="p-20 text-center flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Authenticating...</p>
    </div>;
  }

  if (currentUserRole !== 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Security Restriction</h2>
        <p className="text-slate-500 max-w-xs mt-2 font-medium">Your current credentials do not grant access to the identity management protocol.</p>
        <Link to="/" className="mt-8 text-primary font-black uppercase tracking-widest text-[10px] hover:underline">Return to Safe Zone</Link>
      </div>
    );
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateRole(userId: string) {
    if (!editingRole) return;
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: editingRole
      });
      // Refresh local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: editingRole } : u));
      setSelectedUser(null);
      setEditingRole('');
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role. Check permissions.");
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!window.confirm("Are you sure you want to remove this user profile? (This only deletes the profile record, not the auth account)")) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: Role) => {
    switch(role) {
      case 'admin': return <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg flex items-center gap-1"><ShieldCheck size={12}/> Admin</span>;
      case 'teacher': return <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg flex items-center gap-1"><UserIcon size={12}/> Teacher</span>;
      case 'bursar': return <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg flex items-center gap-1"><Shield size={12}/> Bursar</span>;
      default: return <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg">Learner</span>;
    }
  };

  return (
    <div className="space-y-10 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Authority <span className="text-primary italic">Manager</span></h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Managing {users.length} unique identities</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-48 group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <select 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm appearance-none text-xs font-bold text-slate-600 uppercase tracking-widest"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
            >
              <option value="all">All Roles</option>
              <option value="student">Learner</option>
              <option value="teacher">Teacher</option>
              <option value="bursar">Bursar</option>
              <option value="admin">Admin</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metadata</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Fetching Registry...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">No matching identities found.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <motion.tr 
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center text-white font-black italic">
                          {u.photoURL ? (
                            <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (u.displayName?.[0] || u.email?.[0] || '?').toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-none">{u.displayName || 'Unnamed'}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        {getRoleBadge(u.role)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Class: <span className="text-slate-700">{u.class || 'N/A'}</span></p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: <span className="text-slate-700 truncate w-20 inline-block">{u.id}</span></p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setSelectedUser(u);
                            setEditingRole(u.role);
                          }}
                          className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100"
                          title="Edit Permissions"
                        >
                          <ChevronDown size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                          title="Revoke Profile"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="bg-slate-900 p-8 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Modify <span className="text-primary italic">Access</span></h3>
                    <p className="text-slate-400 text-xs mt-1 font-medium">{selectedUser.email}</p>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Security Clearance</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['student', 'teacher', 'bursar', 'admin'] as Role[]).map(r => (
                      <button 
                        key={r}
                        onClick={() => setEditingRole(r)}
                        className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                          editingRole === r 
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                            : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-white hover:text-slate-900'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => handleUpdateRole(selectedUser.id)}
                    className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Update Clearances
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
