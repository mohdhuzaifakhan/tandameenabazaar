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
import { APP_CONFIG, STORAGE_KEYS } from '../constants/appConstants';
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase';

// Read Application Owner Admin Email from Central Constants
export const ADMIN_EMAIL = (APP_CONFIG.ADMIN_EMAIL || '').toLowerCase().trim();

export const isAdminEmail = (email) => {
  if (!email) return false;
  return email.toLowerCase().trim() === ADMIN_EMAIL;
};

// Helper for safe localStorage access
const safeGetItem = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e);
    return fallback;
  }
};

const safeSetItem = (key, value) => {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.warn(`Error writing localStorage key "${key}":`, e);
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Read persistent initial session from local storage cache
  const initialSession = safeGetItem(STORAGE_KEYS.AUTH_USER, null);

  const [currentUser, setCurrentUser] = useState(() => initialSession?.user || null);
  const [userProfile, setUserProfile] = useState(() => initialSession?.profile || null);
  const [loading, setLoading] = useState(!initialSession);
  const [authError, setAuthError] = useState(null);

  // Keep persistent storage in sync whenever user or profile changes
  useEffect(() => {
    if (currentUser || userProfile) {
      safeSetItem(STORAGE_KEYS.AUTH_USER, { user: currentUser, profile: userProfile });
    }
  }, [currentUser, userProfile]);

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
          safeSetItem('meena_bazaar_auth_session_v3', { user, profile });
          return profile;
        } else {
          // New merchant sign up - Shop in Firestore
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
          safeSetItem('meena_bazaar_auth_session_v3', { user, profile: newProfile });
          return newProfile;
        }
      } else {
        // Fallback for local demo mode
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
        safeSetItem('meena_bazaar_auth_session_v3', { user, profile });
        return profile;
      }
    } catch (err) {
      console.warn("Error syncing Firestore user profile:", err);
      const isUserAdmin = isAdminEmail(user.email);
      const fallbackProfile = userProfile || {
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
        const minimalUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        setCurrentUser(minimalUser);

        const profile = await fetchOrSyncUserProfile(user);
        const isUserAdmin = isAdminEmail(user.email);
        const finalRole = isUserAdmin ? 'admin' : 'shop_owner';

        if (profile) {
          profile.role = finalRole;
          setUserProfile({ ...profile });
          safeSetItem('meena_bazaar_auth_session_v3', { user: minimalUser, profile });
        }
        return { success: true, user: minimalUser, profile };
      } else {
        // Simulated Google Auth flow for dev environment
        const mockGoogleUser = {
          uid: 'google-uid-demo',
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
        safeSetItem('meena_bazaar_auth_session_v3', { user: mockGoogleUser, profile: mockProfile });
        safeSetItem('meena_bazaar_firebase_user', { user: mockGoogleUser, profile: mockProfile });
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

  // Explicit Sign out function
  const logout = async () => {
    try {
      if (isFirebaseConfigured) {
        await signOut(auth);
      }
    } catch (error) {
      console.warn("Logout warning:", error);
    } finally {
      setCurrentUser(null);
      setUserProfile(null);
      safeSetItem('meena_bazaar_auth_session_v3', null);
      safeSetItem('meena_bazaar_firebase_user', null);
      safeSetItem('meena_bazaar_user_v2', null);
    }
    return { success: true };
  };

  // Listen for Firebase auth state changes & maintain persistent state
  useEffect(() => {
    let unsubscribe = () => { };

    if (isFirebaseConfigured) {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const minimalUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          };
          setCurrentUser(minimalUser);

          // If no local profile loaded yet, construct immediate role profile
          const isUserAdmin = isAdminEmail(user.email);
          const derivedRole = isUserAdmin ? 'admin' : 'shop_owner';
          if (!userProfile) {
            setUserProfile({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'Merchant',
              photoURL: user.photoURL || '',
              role: derivedRole,
              shopId: null,
              shopName: null
            });
          }

          // Background sync profile without blocking UI
          fetchOrSyncUserProfile(user).catch(err => {
            console.warn("Background profile sync error:", err);
          });
        } else {
          // If Firebase signals signed out, check if user session exists in local persistent storage
          const stored = safeGetItem('meena_bazaar_auth_session_v3', null);
          if (!stored) {
            setCurrentUser(null);
            setUserProfile(null);
          }
        }
        setLoading(false);
      });
    } else {
      // Dev demo mode persistence
      const stored = safeGetItem('meena_bazaar_auth_session_v3', null) || safeGetItem('meena_bazaar_firebase_user', null);
      if (stored) {
        setCurrentUser(stored.user);
        setUserProfile(stored.profile);
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
