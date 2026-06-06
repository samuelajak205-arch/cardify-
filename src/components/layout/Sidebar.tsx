import React from 'react';
import { 
  Home, Users, BookOpen, BarChart3, TrendingUp, AlertTriangle, 
  FileText, CreditCard, MessageSquare, Settings, Phone, Shield
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth, Role } from '../../context/AuthContext';

const menuItems: { icon: any; label: string; path: string; id: string; roles: Role[] }[] = [
  { icon: Home, label: "Dashboard", path: "/", id: "dashboard", roles: ['student', 'parent', 'teacher', 'bursar', 'admin'] },
  { icon: Users, label: "Learners", path: "/learners", id: "learners", roles: ['teacher', 'admin'] },
  { icon: BookOpen, label: "Classes", path: "/classes", id: "classes", roles: ['teacher', 'admin'] },
  { icon: BookOpen, label: "Subjects", path: "/subjects", id: "subjects", roles: ['student', 'parent', 'teacher', 'admin'] },
  { icon: BarChart3, label: "Performance", path: "/performance", id: "performance", roles: ['student', 'parent', 'teacher', 'admin'] },
  { icon: TrendingUp, label: "Analysis", path: "/analysis", id: "analysis", roles: ['teacher', 'admin'] },
  { icon: AlertTriangle, label: "Insights & Alerts", path: "/insights", id: "insights", roles: ['admin', 'teacher'] },
  { icon: FileText, label: "Reports", path: "/reports", id: "reports", roles: ['student', 'parent', 'teacher', 'bursar', 'admin'] },
  { icon: CreditCard, label: "Flash Cards", path: "/flashcards", id: "flashcards", roles: ['student', 'parent'] },
  { icon: MessageSquare, label: "Messages", path: "/messages", id: "messages", roles: ['student', 'parent', 'teacher', 'bursar', 'admin'] },
  { icon: Settings, label: "Settings", path: "/settings", id: "settings", roles: ['admin'] },
  { icon: Shield, label: "User Management", path: "/admin/users", id: "user-management", roles: ['admin'] },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activePage }) => {
  const location = useLocation();
  const { role } = useAuth();
  
  const filteredMenuItems = menuItems.filter(item => role && item.roles.includes(role));

  const isItemActive = (item: typeof menuItems[0]) => {
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  };

  return (
    <>
      {/* Sidebar */}
        <div className={`fixed top-0 left-0 h-full bg-white shadow-xl transform transition-transform duration-300 z-40 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:w-72 w-64 border-r border-slate-100`}>
        
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 5 }}
              className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20"
            >
              C
            </motion.div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">Cardify <span className="text-primary">Pro</span></h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Education Suite</p>
            </div>
          </div>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-180px)] custom-scrollbar">
          <nav className="space-y-1">
            {filteredMenuItems.map((item) => {
              const active = isItemActive(item);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${active 
                      ? 'bg-primary/10 text-primary font-bold shadow-sm' 
                      : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'}`}
                >
                  <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-primary' : 'text-slate-400'}`} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Contact Support at Bottom */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <Link 
            to="/support"
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
          >
            <Phone className="w-5 h-5" />
            <span className="text-sm font-medium">Contact Support</span>
          </Link>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
