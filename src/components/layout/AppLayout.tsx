import { ChevronDown, LogOut, Settings, User, LayoutGrid, MessageSquare, Menu, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

type Theme = 'blue' | 'emerald' | 'indigo' | 'rose' | 'midnight';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'blue');
  const location = useLocation();
  const { logout, user, profile } = useAuth();
  const activePage = location.pathname.split('/')[1] || 'dashboard';

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const themes: { id: Theme; name: string; color: string }[] = [
    { id: 'blue', name: 'Ocean Blue', color: 'bg-blue-600' },
    { id: 'emerald', name: 'Emerald Forest', color: 'bg-emerald-600' },
    { id: 'indigo', name: 'Royal Indigo', color: 'bg-indigo-600' },
    { id: 'rose', name: 'Sunset Rose', color: 'bg-rose-600' },
    { id: 'midnight', name: 'Midnight Slate', color: 'bg-slate-900' },
  ];

  return (
    <div className={`min-h-screen bg-slate-50 flex ${theme === 'blue' ? '' : `theme-${theme}`} transition-colors duration-300`}>
      <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          activePage={activePage}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-4 sticky top-0 z-30 lg:pl-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
               <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
                 <Menu size={20} />
               </button>
            </div>
            <span className="font-bold text-gray-800 capitalize tracking-tight">{activePage.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Theme Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Change Theme"
              >
                <Palette size={20} className="text-primary" />
              </button>
              
              <AnimatePresence>
                {isThemeOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded-2xl shadow-xl p-3 z-40"
                  >
                    <p className="text-xs font-semibold text-gray-400 mb-2 uppercase px-1">Choose Theme</p>
                    <div className="grid grid-cols-1 gap-1">
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id);
                            setIsThemeOpen(false);
                          }}
                          className={`flex items-center justify-between w-full p-2 rounded-xl text-sm transition-all
                            ${theme === t.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${t.color}`} />
                            {t.name}
                          </div>
                          {theme === t.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-xl transition-all border border-transparent hover:border-gray-200"
              >
                <img src={user?.photoURL || localStorage.getItem('profileImage') || "https://ui-avatars.com/api/?name=User&background=random"} alt="Profile" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white border rounded-2xl shadow-xl py-2 z-40 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-black mt-0.5 tracking-widest">{profile?.role || 'Learner'} Account</p>
                    </div>
                    <div className="p-1">
                      <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-slate-50 rounded-xl transition-colors"><User size={18} className="text-gray-400"/> My Profile</Link>
                      <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-slate-50 rounded-xl transition-colors"><Settings size={18} className="text-gray-400"/> Settings</Link>
                    </div>
                    <div className="border-t p-1 mt-1">
                      <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors w-full font-medium"><LogOut size={18}/> Logout</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 pb-32">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Bottom Nav (Mobile) */}
        <nav className="lg:hidden fixed bottom-6 left-4 right-4 h-16 bg-white/90 backdrop-blur-lg border border-gray-100 flex justify-around items-center z-50 shadow-2xl rounded-2xl px-2">
          <Link to="/" className="flex flex-col items-center gap-1 text-xs text-primary font-bold"><LayoutGrid size={20} />Home</Link>
          <Link to="/messages" className="flex flex-col items-center gap-1 text-xs text-gray-400"><MessageSquare size={20} />Messages</Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 text-xs text-gray-400"><User size={20} />Profile</Link>
          <button onClick={() => setIsSidebarOpen(true)} className="flex flex-col items-center gap-1 text-xs text-gray-400 lg:hidden"><Menu size={20} />Menu</button>
        </nav>
      </div>
    </div>
  );
}
