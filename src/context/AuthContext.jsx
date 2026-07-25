import {
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase';

// Read Application Owner Admin Email from .env configuration
export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase().trim();

export const isAdminEmail = (email) => {
  if (!email) return false;
  return email.toLowerCase().trim() === ADMIN_EMAIL;
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sync user profile from Firestore or local cache
  const fetchOrSyncUserProfile = async (user) => {
    if (!user) {
      setUserProfile(null);
      return null;
    }

    try {
      const isUserAdmin = isAdminEmail(user.email);
      const derivedRole = isUserAdmin ? 'admin' : 'shop_owner';

      if (isFirebaseConfigured) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // Existing user profile in Firestore
          const data = userSnap.data();
          const effectiveRole = isUserAdmin ? 'admin' : 'shop_owner';

          // Ensure Firestore role is up-to-date
          if (data.role !== effectiveRole) {
            await updateDoc(userRef, { role: effectiveRole });
          }

          await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
            displayName: user.displayName || data.displayName,
            photoURL: user.photoURL || data.photoURL
          });

          const profile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || data.displayName,
            photoURL: user.photoURL || data.photoURL,
            role: effectiveRole,
            shopId: data.shopId || null,
            shopName: data.shopName || null,
            ...data,
            role: effectiveRole
          };
          setUserProfile(profile);
          return profile;
        } else {
          // New merchant sign up - store in Firestore
          const newProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'Merchant',
            photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
            role: derivedRole,
            shopId: null,
            shopName: null,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          };

          await setDoc(userRef, newProfile);
          setUserProfile(newProfile);
          return newProfile;
        }
      } else {
        // Fallback for local demo mode when Firebase API key is unconfigured
        const profile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || (isUserAdmin ? 'Admin' : 'Merchant'),
          photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80',
          role: derivedRole,
          shopId: null,
          shopName: null
        };
        setUserProfile(profile);
        return profile;
      }
    } catch (err) {
      console.error("Error syncing Firestore user profile:", err);
      const isUserAdmin = isAdminEmail(user.email);
      const fallbackProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Merchant',
        photoURL: user.photoURL || '',
        role: isUserAdmin ? 'admin' : 'shop_owner',
        shopId: null,
        shopName: null
      };
      setUserProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

  // Google Sign-In Function
  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      if (isFirebaseConfigured) {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const profile = await fetchOrSyncUserProfile(user);

        const isUserAdmin = isAdminEmail(user.email);
        const finalRole = isUserAdmin ? 'admin' : 'shop_owner';

        if (profile) {
          profile.role = finalRole;
          setUserProfile({ ...profile });
        }
        return { success: true, user, profile };
      } else {
        // Simulated Google Auth flow for dev environment
        const mockGoogleUser = {
          uid: 'google-uid-' + Date.now(),
          email: ADMIN_EMAIL,
          displayName: 'Application Admin',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80'
        };

        const mockProfile = {
          uid: mockGoogleUser.uid,
          email: mockGoogleUser.email,
          displayName: mockGoogleUser.displayName,
          photoURL: mockGoogleUser.photoURL,
          role: 'admin',
          shopId: null,
          shopName: null
        };

        setCurrentUser(mockGoogleUser);
        setUserProfile(mockProfile);
        localStorage.setItem('meena_bazaar_firebase_user', JSON.stringify({ user: mockGoogleUser, profile: mockProfile }));
        return { success: true, user: mockGoogleUser, profile: mockProfile };
      }
    } catch (error) {
      console.error("Google Authentication error:", error);
      let friendlyMessage = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        friendlyMessage = 'Sign-in popup was closed before completing.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        friendlyMessage = 'Sign-in request was cancelled.';
      } else if (error.code === 'auth/api-key-not-valid') {
        friendlyMessage = 'Firebase API key is invalid or unconfigured in .env file.';
      }
      setAuthError(friendlyMessage);
      return { success: false, message: friendlyMessage };
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      if (isFirebaseConfigured) {
        await signOut(auth);
      }
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('meena_bazaar_firebase_user');
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, message: error.message };
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    let unsubscribe = () => { };

    if (isFirebaseConfigured) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          await fetchOrSyncUserProfile(user);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      });
    } else {
      // Check stored dev auth user
      const stored = localStorage.getItem('meena_bazaar_firebase_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed.user);
          setUserProfile(parsed.profile);
        } catch (e) {
          console.error("Error reading stored mock user:", e);
        }
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    authError,
    setAuthError,
    signInWithGoogle,
    logout,
    isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
