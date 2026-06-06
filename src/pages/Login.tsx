import { useState, useEffect } from 'react';
import React from 'react';
import { motion } from 'motion/react';
import { LogIn, Eye, EyeOff, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userClass, setUserClass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const { signInWithGoogle, signUpWithEmail, signInWithEmail, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
        try {
            await signUpWithEmail(email, password, userClass);
            setMessage('Account created! Please check your email for verification.');
        } catch (error: any) {
            if (error.code === 'auth/operation-not-allowed') {
                setMessage('Email/Password sign-in is not enabled. Please enable it in the Firebase Console or use Google Sign-In.');
            } else {
                setMessage(error.message);
            }
        }
    } else {
        try {
            await signInWithEmail(email, password);
            navigate('/');
        } catch (error: any) {
            if (error.code === 'auth/operation-not-allowed') {
                setMessage('Email/Password sign-in is not enabled. Please enable it in the Firebase Console or use Google Sign-In.');
            } else {
                setMessage(error.message);
            }
        }
    }
  };

  const handleGoogleLogin = async () => {
    try {
        await signInWithGoogle();
        navigate('/');
    } catch (error: any) {
        setMessage(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 transition-colors duration-300">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10 bg-[length:20px_20px]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 lg:p-10 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600"></div>
        
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 shadow-xl shadow-blue-200"
          >
            C
          </motion.div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {isSignUp ? 'Join Cardify Pro' : 'Welcome Back'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Empowering the next generation of learners.</p>
        </div>
        
        {message && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 text-sm text-center p-4 bg-blue-50 text-blue-800 rounded-2xl border border-blue-100 font-medium"
          >
            {message}
          </motion.div>
        )}

        <motion.button 
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white rounded-2xl py-4 mb-8 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="font-bold">{isSignUp ? 'Sign up with Google' : 'Sign in with Google'}</span>
        </motion.button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest">Or email access</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-slate-900 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {isSignUp && (
            <input 
              type="text" 
              placeholder="Current Class (e.g., Senior 4)" 
              className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-slate-900 font-medium"
              value={userClass}
              onChange={(e) => setUserClass(e.target.value)}
              required
            />
          )}

          <div className="relative group">
            <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-slate-900 font-medium pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? "Hide Password" : "Show Password"}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <motion.button 
            type="submit"
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white rounded-2xl py-4 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 font-black text-lg mt-4"
          >
            {isSignUp ? 'Create My Account' : 'Sign In Now'}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 font-medium">
          {isSignUp ? 'Already a member? ' : "New here? "}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 font-black hover:text-blue-700 transition-colors decoration-2 hover:underline underline-offset-4"
          >
            {isSignUp ? 'Sign In' : 'Join Cardify Pro'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
