import React from 'react';
import { motion } from 'motion/react';
import { Layers, Search, PlusCircle, Bookmark } from 'lucide-react';

const formulas = [
    { title: 'Quadratic Formula', desc: 'x = [-b ± sqrt(b² - 4ac)] / 2a', topic: 'Math', level: 'Senior 4' },
    { title: 'Newton\'s Second Law', desc: 'F = ma', topic: 'Physics', level: 'Senior 3' },
    { title: 'Ideal Gas Law', desc: 'PV = nRT', topic: 'Chemistry', level: 'Senior 5' },
    { title: 'Photosynthesis', desc: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', topic: 'Biology', level: 'Senior 2' },
    { title: 'Pythagorean Theorem', desc: 'a² + b² = c²', topic: 'Math', level: 'Senior 1' },
    { title: 'Ohm\'s Law', desc: 'V = IR', topic: 'Physics', level: 'Senior 4' },
    { title: 'Law of Sines', desc: 'a/sinA = b/sinB = c/sinC', topic: 'Math', level: 'Senior 3' },
    { title: 'Cell Respiration', desc: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP', topic: 'Biology', level: 'Senior 3' },
    { title: 'Uganda Independence', desc: 'October 9, 1962', topic: 'History', level: 'Senior 1' },
    { title: 'Simile', desc: 'Comparison using "as" or "like"', topic: 'English', level: 'Senior 1' },
];

export default function FlashCardsPage() {
    return (
        <div className="space-y-10 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                   <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active <span className="text-primary italic">Flashcards</span></h1>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Micro-learning for permanent memory</p>
                </div>
                <div className="flex w-full md:w-auto gap-3">
                   <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search cards..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm text-slate-900 shadow-sm"
                      />
                   </div>
                   <motion.button 
                     whileTap={{ scale: 0.95 }}
                     className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl shadow-slate-200 hover:bg-primary transition-colors"
                   >
                     <PlusCircle size={24} />
                   </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {formulas.map((f, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -8 }}
                        className="bg-white p-1 rounded-[2.5rem] border border-slate-100 shadow-sm relative group cursor-pointer"
                    >
                      <div className="bg-slate-50 p-8 rounded-[2.2rem] h-64 flex flex-col justify-between overflow-hidden relative border border-slate-50">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                        
                        <div className="flex justify-between items-start relative z-10">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest px-3 py-1 bg-white rounded-full border border-primary/5 shadow-sm">
                                {f.topic}
                            </span>
                            <Bookmark size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
                        </div>
                        
                        <div className="relative z-10">
                             <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-primary transition-colors">{f.title}</h2>
                             <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
                                <p className="text-lg font-mono text-slate-700">{f.desc}</p>
                             </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">
                            <span className="flex items-center gap-1"><Layers size={12} /> {f.level}</span>
                            <span className="italic">Pro Formula</span>
                        </div>
                      </div>
                    </motion.div>
                ))}
            </div>
            
            <div className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--primary)_0%,_transparent_50%)]"></div>
              <div className="relative z-10 max-w-xl mx-auto">
                 <h2 className="text-3xl font-black text-white tracking-tight mb-4">Neural <span className="text-primary italic">Retention</span> Engine</h2>
                 <p className="text-slate-400 font-medium leading-relaxed mb-8 text-sm">
                   Our spaced-repetition algorithm ensures you never forget a single formula. Start a smart study session now.
                 </p>
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-2xl shadow-black/50"
                 >
                   Begin Focused Session
                 </motion.button>
              </div>
            </div>
        </div>
    );
}
