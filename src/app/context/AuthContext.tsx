"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
// import { ref, set } from 'firebase/database';
import { database } from '@/app/lib/firebase';
// Replace this line
// import { ref, set, serverTimestamp } from 'firebase/database';

// With this correct import
import { ref, set } from 'firebase/database';
import { serverTimestamp } from 'firebase/database';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

const saveUserToDatabase = async (user: User) => {
  try {
    // Update only user profile data, not history
    await set(ref(database, `users/${user.uid}/profile`), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      lastLogin: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};


  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await saveUserToDatabase(result.user);
      return result.user;
    } catch (error: any) {
      const errorMessage = error.code === 'auth/invalid-credential' 
        ? 'Invalid email or password' 
        : error.message;
      throw new Error(errorMessage);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserToDatabase(result.user);
      return result.user;
    } catch (error: any) {
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'Email already in use'
        : error.message;
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    // Add a small delay before opening the popup
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = await signInWithPopup(auth, provider);
    await saveUserToDatabase(result.user);
    return result.user;
  } catch (error: any) {
    // Handle specific error codes
    if (error.code === 'auth/popup-closed-by-user' || 
        error.code === 'auth/cancelled-popup-request') {
      console.log('Authentication popup was closed or cancelled');
      // Don't throw an error for this specific case
      return null;
    }
    
    console.error("Google sign-in error:", error);
    throw new Error('Failed to sign in with Google');
  }
};


  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error('Failed to log out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found'
        ? 'No account found with this email'
        : error.message;
      throw new Error(errorMessage);
    }
  };

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!auth.currentUser) throw new Error('No user is signed in');
    
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: photoURL || auth.currentUser.photoURL
      });
      
      // Update the user state to reflect changes
      setUser({ ...auth.currentUser });
      
      // Update user data in database
      await saveUserToDatabase(auth.currentUser);
    } catch (error) {
      console.error("Profile update error:", error);
      throw new Error('Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      loginWithGoogle, 
      logout,
      resetPassword,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
