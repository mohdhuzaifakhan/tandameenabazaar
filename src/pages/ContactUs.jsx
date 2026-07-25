import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 py-4 animate-fade-in">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
        <span className="text-slate-800">Contact Unifiedstack</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 mt-2">
        
        {/* Left Side: Contact Cards Info (2/5 Column space) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Get in Touch</h1>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Have a startup idea or need software development services? Connect directly with the developers at Unifiedstack.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            
            {/* Email Card */}
            <a 
              href="mailto:mohdhuzaifa8126195456@gmail.com" 
              className="bg-white p-4.5 rounded-2xl flex items-start gap-4 hover:bg-slate-50 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm flex-shrink-0">
                <i className="fa-regular fa-envelope"></i>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email Inquiry</span>
                <span className="text-xs font-bold text-slate-800 break-all group-hover:text-emerald-655 transition-colors">mohdhuzaifa8126195456@gmail.com</span>
              </div>
            </a>

            {/* Phone Card */}
            <a 
              href="tel:8433043426" 
              className="bg-white p-4.5 rounded-2xl flex items-start gap-4 hover:bg-slate-50 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm flex-shrink-0">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Call Support</span>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-655 transition-colors">+91 8433043426</span>
              </div>
            </a>

            {/* Direct WhatsApp Call Action */}
            <a 
              href="https://wa.me/918433043426?text=Hello Unifiedstack, I have a software solution query."
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white p-4.5 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-xs transition-colors cursor-pointer border-none"
            >
              <i className="fa-brands fa-whatsapp text-base"></i> Chat on WhatsApp
            </a>

          </div>

          <div className="bg-slate-50/50 p-5 rounded-2xl flex flex-col gap-2">
            <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5"><i className="fa-solid fa-clock text-slate-400"></i> Operation Timings</h4>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">We respond to email and WhatsApp queries under 15 minutes during standard operational hours (10:00 AM – 09:00 PM IST).</p>
          </div>
        </div>

        {/* Right Side: Message Submission Form (3/5 Column space) */}
        <div className="lg:col-span-3">
          <section className="bg-white rounded-3xl p-6 md:p-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-5">Send a Message</h2>
            
            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-2xl text-center flex flex-col items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600 text-3xl mb-1"></i>
                <h4 className="font-bold text-slate-800 text-xs">Message Sent Successfully!</h4>
                <p className="text-[11px] text-slate-500 leading-normal">Unifiedstack will get in touch with you at the email address provided.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/20"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Subject</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="E.g., Software project quote"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Message Description</label>
                  <textarea 
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your startup or product requirements..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/20 resize-y"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all hover:scale-[1.02] cursor-pointer mt-2 border-none"
                >
                  Submit Consultation Request
                </button>
              </form>
            )}
          </section>
        </div>

      </div>

    </div>
  );
}
