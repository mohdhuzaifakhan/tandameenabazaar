import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="w-full flex flex-col gap-12 py-4 animate-fade-in">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
        <span className="text-slate-800">About Unifiedstack</span>
      </div>

      {/* Hero Header Block */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-emerald-50 via-white to-teal-50/20 px-6 py-12 md:px-12 md:py-20 text-slate-800 border border-emerald-100/50 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="relative z-10 max-w-2xl flex flex-col gap-4 text-center lg:text-left items-center lg:items-start">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold tracking-wider uppercase text-emerald-800">
            <i className="fa-solid fa-code"></i> Engineering Local Commerce
          </span>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
            About <span className="text-emerald-700">Unifiedstack</span>
          </h1>

          <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-lg">
            Unifiedstack is a software solutions company dedicated to building enterprise-grade, high-performance web applications for startups, local businesses, and modern brands. We engineer robust digital ecosystems that drive real business growth.
          </p>

          <div className="flex gap-3.5 mt-2">
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-xs"
            >
              Get Software Consultation
            </Link>
          </div>
        </div>

        {/* Brand visual marker */}
        <div className="relative z-10 hidden lg:block w-80 flex-shrink-0">
          <div className="p-6 bg-white rounded-3xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-sm">U</div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Unifiedstack Solutions</span>
            <div className="h-px bg-slate-100 my-1"></div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600"></i> Cloud Implementations
              </span>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600"></i> E-Commerce Architectures
              </span>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600"></i> Custom Mobile Solutions
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main split details grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mt-4">

        {/* Left column: Vision statement */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Software Solutions for Businesses &amp; Startups</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            At Unifiedstack, we bridge the gap between complex software systems and user-friendly products. We designed and engineered the Digital Meena Bazaar marketplace as a showcase of lightweight, offline-first commerce solutions tailored specifically for local businesses.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            Whether you are a startup building a custom SaaS product or a local brand transitioning online, we build codebases optimized for rapid updates, clean security protocols, and robust scaling.
          </p>
        </div>

        {/* Right columns: Pillars of implementation */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div className="bg-white p-5 rounded-2xl flex flex-col gap-3 hover:-translate-y-1 transition-transform">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h3 className="font-bold text-xs text-slate-900">Custom E-Commerce</h3>
            <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
              We design custom checkout flows, catalog listings, and instant messaging systems that eliminate complex checkout hurdles and reduce shopping cart abandonment.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl flex flex-col gap-3 hover:-translate-y-1 transition-transform">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <h3 className="font-bold text-xs text-slate-900">Full-Stack Scale</h3>
            <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
              Architecting secure backend microservices, resilient databases, and instant API response routing tailored specifically for startups and growing enterprises.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl flex flex-col gap-3 hover:-translate-y-1 transition-transform">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <i className="fa-solid fa-mobile-screen"></i>
            </div>
            <h3 className="font-bold text-xs text-slate-900">PWA &amp; Mobile-First</h3>
            <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
              Deploying Progressive Web Applications (PWAs) that run smoothly, cache assets locally for offline access, and load instantly on mobile networks.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl flex flex-col gap-3 hover:-translate-y-1 transition-transform">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3 className="font-bold text-xs text-slate-900">Secure OTP &amp; Auth</h3>
            <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
              Implementing authentication standards, zero-trust token matching, and 2-Factor OTP simulations to secure credentials.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}
