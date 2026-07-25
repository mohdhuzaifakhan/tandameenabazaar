import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';

export default function Login() {
  const { login } = useBazaar();
  const navigate = useNavigate();

  // Login steps: 'credentials' | 'google-select' | 'google-otp'
  const [loginStep, setLoginStep] = useState('credentials');
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState(null);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(30);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let interval;
    if (loginStep === 'google-otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loginStep, timer]);

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    const result = login(email, password);
    if (result.success) {
      setSelectedGoogleAccount({
        email: email,
        name: email.includes('admin') ? 'Administrator' : 'Sharma Mobiles',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
        redirect: result.redirect
      });
      setTimer(30);
      setLoginStep('google-otp');
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleGoogleSelect = (acc) => {
    setSelectedGoogleAccount(acc);
    setTimer(30);
    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
    setLoginStep('google-otp');
  };

  const handleOtpChange = (value, idx) => {
    if (isNaN(value)) return;
    const newOtp = [...otpCode];
    newOtp[idx] = value.substring(value.length - 1);
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && idx < 5) {
      const nextInput = document.getElementById(`otp-input-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otpCode[idx] && idx > 0) {
      const prevInput = document.getElementById(`otp-input-${idx - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otpCode];
        newOtp[idx - 1] = '';
        setOtpCode(newOtp);
      }
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setOtpError('');
    const fullCode = otpCode.join('');
    
    if (fullCode === '123456') {
      const bypassEmail = selectedGoogleAccount.email;
      const pass = bypassEmail.includes('admin') ? 'admin123' : 'sharma123';
      const result = login(bypassEmail, pass);
      if (result.success) {
        navigate(result.redirect);
      } else {
        setOtpError('Failed to establish account context.');
      }
    } else {
      setOtpError('Invalid OTP code. Enter 123456 to bypass verification.');
    }
  };

  const handleResendOtp = () => {
    setTimer(30);
    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
    alert('A new 6-digit code has been generated. Enter 123456 to bypass.');
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* Left Designer Panel */}
      <div className="bg-gradient-to-tr from-emerald-950 via-emerald-900 to-slate-900 p-12 text-white flex flex-col justify-between hidden md:flex">
        
        {/* Branding Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-emerald-950 flex items-center justify-center text-lg font-black">
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
          <div>
            <div className="text-[10px] text-slate-300 font-bold tracking-wider leading-none uppercase">DIGITAL</div>
            <div className="text-base font-black text-emerald-400 leading-none mt-0.5">Meena Bazaar</div>
          </div>
        </div>

        {/* Features Info list */}
        <div className="flex flex-col gap-8 max-w-md">
          <h2 className="text-3xl font-black tracking-tight leading-tight">Scale your local storefront on the city marketplace.</h2>
          
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-emerald-400 text-lg flex-shrink-0">
                <i className="fa-solid fa-store"></i>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Multi-Vendor Storefronts</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">Showcase your products, manage local orders, and receive customer inquiries directly via WhatsApp.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-emerald-400 text-lg flex-shrink-0">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Two-Factor Authenticator</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">Protect your merchant panel updates using Google Authenticator code verifications.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-white/10 pt-6">
          <i className="fa-solid fa-shield-check text-emerald-400"></i>
          <span>Protected with industry standard encryption keys.</span>
        </div>

      </div>

      {/* Right Login Card panel */}
      <div className="bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 md:p-10">

          {/* STEP 1: CREDENTIALS */}
          {loginStep === 'credentials' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Portal Log In</h1>
                <p className="text-xs text-slate-500 mt-1">Access your platform administrator or shop manager panel.</p>
              </div>

              {/* Continue with Google */}
              <button 
                onClick={() => setLoginStep('google-select')}
                className="w-full py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl bg-white text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.57 2.69-3.87 2.69-6.6z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26a5.73 5.73 0 0 1-8.54-3.04H.46v2.33A9 9 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.51 10.5a5.78 5.78 0 0 1 0-3.6V4.57H.46a9 9 0 0 0 0 8.86l3.05-2.43z"/>
                  <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1C13.46.68 11.43 0 9 0A9 9 0 0 0 .46 4.57l3.05 2.43c.7-2.12 2.68-3.42 5.49-3.42z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 text-slate-200">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Or use Credentials</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 leading-normal flex items-start gap-2">
                  <i className="fa-solid fa-circle-exclamation mt-0.5"></i>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    placeholder="sharma@meenabazaar.com" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/50" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Password</label>
                    <a href="#forgot" onClick={e=>e.preventDefault()} className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700">Forgot?</a>
                  </div>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    placeholder="sharma123" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/50" 
                  />
                </div>
                <button type="submit" className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                  Sign In <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: ACCOUNT SELECTOR */}
          {loginStep === 'google-select' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <svg width="22" height="22" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.57 2.69-3.87 2.69-6.6z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26a5.73 5.73 0 0 1-8.54-3.04H.46v2.33A9 9 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.51 10.5a5.78 5.78 0 0 1 0-3.6V4.57H.46a9 9 0 0 0 0 8.86l3.05-2.43z"/>
                  <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1C13.46.68 11.43 0 9 0A9 9 0 0 0 .46 4.57l3.05 2.43c.7-2.12 2.68-3.42 5.49-3.42z"/>
                </svg>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Choose an Account</h2>
              </div>
              <p className="text-xs text-slate-500">Select an account linked with Google Authenticator:</p>

              <div className="flex flex-col gap-3">
                {/* Admin */}
                <div 
                  onClick={() => handleGoogleSelect({
                    email: 'admin@meenabazaar.com',
                    name: 'Mohd. Shadab',
                    role: 'Administrator',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
                    redirect: '/dashboard/admin'
                  })}
                  className="flex items-center gap-4 p-4 border border-slate-200 hover:border-emerald-500/25 rounded-2xl bg-white cursor-pointer transition-all"
                >
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80" alt="Admin" className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900 leading-none">Mohd. Shadab</span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1">admin@meenabazaar.com</span>
                  </div>
                </div>

                {/* Shop Owner */}
                <div 
                  onClick={() => handleGoogleSelect({
                    email: 'sharma@meenabazaar.com',
                    name: 'Sharma Mobile Store',
                    role: 'Shop Owner',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                    redirect: '/dashboard/shop'
                  })}
                  className="flex items-center gap-4 p-4 border border-slate-200 hover:border-emerald-500/25 rounded-2xl bg-white cursor-pointer transition-all"
                >
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Shop Owner" className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900 leading-none">Sharma Mobile Store</span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1">sharma@meenabazaar.com</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setLoginStep('credentials')}
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors mt-2 cursor-pointer bg-transparent border-none"
              >
                Go Back
              </button>
            </div>
          )}

          {/* STEP 3: OTP VERIFICATION */}
          {loginStep === 'google-otp' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-4">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Two-Step Verification</h2>
                <p className="text-xs text-slate-500 max-w-[280px] mt-1 leading-normal">
                  Enter the 6-digit code generated inside your Authenticator app for:
                </p>
                <div className="mt-3 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full flex items-center gap-2">
                  <img src={selectedGoogleAccount?.avatar} alt="Avatar" className="w-4 h-4 rounded-full" />
                  <span className="text-[10px] font-bold text-slate-700">{selectedGoogleAccount?.email}</span>
                </div>
              </div>

              {otpError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl text-center leading-normal">
                  <i className="fa-solid fa-circle-exclamation mr-1"></i> {otpError}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                <div className="flex justify-center gap-2.5">
                  {otpCode.map((val, idx) => (
                    <input 
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength="1"
                      required
                      value={val}
                      onChange={e => handleOtpChange(e.target.value, idx)}
                      onKeyDown={e => handleOtpKeyDown(e, idx)}
                      className="w-11 h-12 border-2 border-slate-200 rounded-xl text-lg font-black text-center outline-none focus:border-emerald-500 bg-slate-50/50"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <button type="submit" className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                  Verify &amp; Continue
                </button>
              </form>

              <div className="flex justify-between items-center text-xs">
                <button 
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                  className={`font-bold transition-colors bg-transparent border-none ${timer > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-700 cursor-pointer'}`}
                >
                  Resend Code
                </button>
                {timer > 0 ? (
                  <span className="text-slate-400 font-semibold">Code expires: <strong>{timer}s</strong></span>
                ) : (
                  <span className="text-emerald-600 font-bold">Code Ready!</span>
                )}
              </div>

              <button 
                onClick={() => setLoginStep('google-select')}
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none"
              >
                Choose another account
              </button>
            </div>
          )}

          {/* SANDBOX BANNER */}
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 leading-normal flex flex-col gap-1">
            <strong className="text-slate-800 font-bold flex items-center gap-1">
              <i className="fa-solid fa-lock text-emerald-600"></i> Sandbox passcode:
            </strong>
            <span>Standard OTP is <strong className="text-slate-800 font-bold">123456</strong> for testing Google Authenticator checkouts.</span>
          </div>

        </div>
      </div>

    </div>
  );
}
