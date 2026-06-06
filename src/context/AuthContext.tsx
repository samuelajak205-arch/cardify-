import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  User 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type Role = 'student' | 'parent' | 'teacher' | 'bursar' | 'admin';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  profile: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, userClass: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    role: Role | null;
    profile: any | null;
    loading: boolean;
  }>({
    user: null,
    role: null,
    profile: null,
    loading: true
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setAuthState({
          user: null,
          role: null,
          profile: null,
          loading: false
        });
        return;
      }

      let role: Role = 'student';
      let profile: any = { role: 'student', email: currentUser.email };

      if (currentUser.email === 'samuelajak205@gmail.com' || currentUser.email === 'samuelajack205@gmail.com') {
        role = 'admin';
        profile = { role: 'admin', email: currentUser.email };
      } else {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            role = data.role as Role;
            profile = data;
          }
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      }

      setAuthState({
        user: currentUser,
        role,
        profile,
        loading: false
      });
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));

    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        role: 'student',
        class: 'Not Specified',
        createdAt: new Date().toISOString()
      });
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, userClass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      role: 'student',
      class: userClass,
      createdAt: new Date().toISOString()
    });
    await sendEmailVerification(userCredential.user);
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      throw new Error('Please verify your email address before signing in.');
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const value = useMemo(() => ({
    ...authState,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    logout
  }), [authState, signInWithGoogle, signUpWithEmail, signInWithEmail, logout]);

  return (
    <AuthContext.Provider value={value}>
      {!authState.loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
