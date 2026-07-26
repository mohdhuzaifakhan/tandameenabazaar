import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleClearCacheAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn("Could not clear storage:", e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-3xl mx-auto">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Something went wrong</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected error occurred while rendering this page. Don't worry, your data is safe.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-950/80 rounded-2xl p-4 text-left border border-slate-800 max-h-40 overflow-y-auto">
                <p className="text-[11px] font-mono text-rose-400 font-bold break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg cursor-pointer"
              >
                <i className="fa-solid fa-rotate-right mr-1.5"></i> Try Again
              </button>

              <button
                onClick={this.handleClearCacheAndReload}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                <i className="fa-solid fa-broom mr-1.5"></i> Reset & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
