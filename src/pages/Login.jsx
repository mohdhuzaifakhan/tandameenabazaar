import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Store, UserCheck, ArrowLeft, AlertCircle, X, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { signInWithGoogle, userProfile, authError, setAuthError, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer' | 'shop_owner'

  // Redirect user automatically if already signed in
  useEffect(() => {
    if (userProfile) {
      if (userProfile.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else if (userProfile.role === 'shop_owner') {
        navigate('/dashboard/shop', { replace: true });
      } else {
        navigate('/dashboard/customer', { replace: true });
      }
    }
  }, [userProfile, navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthError(null);

    const result = await signInWithGoogle(selectedRole);
    setLoading(false);

    if (result.success && result.profile) {
      if (result.profile.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (result.profile.role === 'shop_owner') {
        navigate('/dashboard/shop');
      } else {
        navigate('/dashboard/customer');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Soft Glow Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-100/60 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-7 z-10 animate-fade-in">
        
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-[#056839] text-white flex items-center justify-center text-2xl font-black mx-auto shadow-md shadow-emerald-900/10">
            <ShoppingBag className="w-7 h-7 text-white stroke-[2.2]" />
          </div>

          <div>
            <span className="text-[10px] font-black text-[#056839] uppercase tracking-widest block">MEENA BAZAAR</span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Welcome to Meena Bazaar</h1>
            <p className="text-xs text-slate-500 mt-1">Select your account type to sign in or register</p>
          </div>
        </div>

        {/* Role Selection Container - ONLY Customer and Merchant */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
            Select Your Account Type
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Customer Role Option */}
            <button
              type="button"
              onClick={() => setSelectedRole('customer')}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                selectedRole === 'customer'
                  ? 'border-[#056839] bg-emerald-50/60 shadow-xs ring-2 ring-[#056839]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedRole === 'customer' ? 'bg-[#056839] text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <UserCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                {selectedRole === 'customer' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#056839]"></span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Customer</h3>
                <p className="text-[11px] text-slate-500 leading-snug mt-1 font-medium">
                  Browse local markets, save favorite products & contact shops.
                </p>
              </div>
            </button>

            {/* Merchant / Shop Owner Role Option */}
            <button
              type="button"
              onClick={() => setSelectedRole('shop_owner')}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                selectedRole === 'shop_owner'
                  ? 'border-[#056839] bg-emerald-50/60 shadow-xs ring-2 ring-[#056839]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedRole === 'shop_owner' ? 'bg-[#056839] text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Store className="w-5 h-5 stroke-[2.2]" />
                </div>
                {selectedRole === 'shop_owner' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#056839]"></span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Merchant / Shop Owner</h3>
                <p className="text-[11px] text-slate-500 leading-snug mt-1 font-medium">
                  Showcase your store, upload items & capture customer leads.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{authError}</span>
            </div>
            <button onClick={() => setAuthError(null)} className="text-rose-400 hover:text-rose-700 border-none bg-transparent cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Local Dev Mode Banner */}
        {!isFirebaseConfigured && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] text-center font-medium">
            Local Dev Mode: Instant sign-in as <strong>{selectedRole === 'shop_owner' ? 'Merchant' : 'Customer'}</strong>.
          </div>
        )}

        {/* Sign-In Action */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 active:scale-[0.99] shadow-md"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in as {selectedRole === 'shop_owner' ? 'Merchant' : 'Customer'}...</span>
              </>
            ) : (
              <>
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google as {selectedRole === 'shop_owner' ? 'Merchant' : 'Customer'}</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
            Secure authentication for Meena Bazaar users
          </p>
        </div>

        {/* Return to Storefront */}
        <div className="pt-5 border-t border-slate-100 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-bold text-slate-600 hover:text-[#056839] transition-colors inline-flex items-center gap-2 cursor-pointer border-none bg-transparent"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Storefront
          </button>
        </div>

      </div>

    </div>
  );
}
