import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Database, Key, Globe, HelpCircle, Activity, Info, CheckCircle, XCircle, ArrowLeft, RefreshCw, Save, Sparkles, ExternalLink, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { supabaseUrl as activeUrl, supabaseKey as activeKey, isCustomSupabase } from '../../utils/supabase/client';

export function SupabaseSetupPage() {
  const navigate = useNavigate();

  // Local state for the inputs
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');

  // Status states
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Load active inputs on mount
  useEffect(() => {
    setUrlInput(localStorage.getItem('localz_supabase_url') || activeUrl || '');
    setKeyInput(localStorage.getItem('localz_supabase_anon_key') || activeKey || '');
  }, []);

  // Mouse move effect for tech grid background parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Connection Test Logic
  const handleTestConnection = async () => {
    if (!urlInput.trim()) {
      setTestResult({ success: false, message: 'Please provide a Supabase URL to test.' });
      return;
    }
    if (!keyInput.trim()) {
      setTestResult({ success: false, message: 'Please provide a Supabase Anon/Public Key to test.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const sanitizedUrl = urlInput.trim().replace(/\/$/, '');
      const sanitizedKey = keyInput.trim();

      // Basic structure validation
      if (!sanitizedUrl.startsWith('http://') && !sanitizedUrl.startsWith('https://')) {
        setTestResult({ success: false, message: 'Invalid URL. It must begin with http:// or https://' });
        setIsTesting(false);
        return;
      }

      if (sanitizedKey.length < 50) {
        setTestResult({ success: false, message: 'Invalid Anon Key. It should be a long JWT token.' });
        setIsTesting(false);
        return;
      }

      // Query standard PostgREST entry path - works on ANY Supabase instance
      // bypassing need for custom table names and avoiding database schema conflicts
      const checkPath = `${sanitizedUrl}/rest/v1/`;
      const response = await fetch(checkPath, {
        method: 'GET',
        headers: {
          'apikey': sanitizedKey,
          'Authorization': `Bearer ${sanitizedKey}`
        }
      });

      if (response.ok) {
        setTestResult({
          success: true,
          message: 'Connection successful! The Supabase endpoint validated the API key correctly.'
        });
      } else {
        let errorHint = `HTTP ${response.status} Error`;
        try {
          const body = await response.json();
          if (body.message) errorHint = body.message;
          else if (body.error) errorHint = body.error;
        } catch (_) {
          try {
            const txt = await response.text();
            if (txt) errorHint = txt.substring(0, 150);
          } catch (_) {}
        }
        setTestResult({
          success: false,
          message: `Database rejected credentials: ${errorHint}. Please check if the Anon Key matches this URL.`
        });
      }
    } catch (err: any) {
      console.error('Test connection error:', err);
      setTestResult({
        success: false,
        message: `Network Connection Failed: ${err?.message || 'Could not fetch from endpoint. Ensure your URL is correct and active, and check your internet connection.'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Save Credentials Logic
  const handleSaveCredentials = async () => {
    if (!urlInput.trim() || !keyInput.trim()) {
      alert('Please fill out both Supabase URL and Anon Key fields.');
      return;
    }

    setIsSaving(true);
    try {
      localStorage.setItem('localz_supabase_url', urlInput.trim().replace(/\/$/, ''));
      localStorage.setItem('localz_supabase_anon_key', keyInput.trim());
      
      // Visual feedback with sound/delay
      setTimeout(() => {
        setIsSaving(false);
        // Force full refresh so that all providers and singleton references reload with these keys!
        window.location.href = '/account';
      }, 1000);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
      alert('Failed to save to local storage.');
    }
  };

  // Revert back to autogenerated sandboxed defaults
  const handleResetToSandbox = () => {
    if (window.confirm('Reset to the initial built-in locals sandbox database credentials?')) {
      localStorage.removeItem('localz_supabase_url');
      localStorage.removeItem('localz_supabase_anon_key');
      window.location.href = '/account';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white relative">
      <Navbar />

      {/* Tech Grid Parallax Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />
        
        {/* Futuristic Grid Layer */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.4s ease-out',
          }}
        />

        {/* Ambient Neon Floating Spheres */}
        <motion.div
          className="absolute top-1/4 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"
          animate={{
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[140px]"
          animate={{
            y: [0, -60, 0],
            scale: [1.1, 0.95, 1.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      {/* Primary Layout Wrapper */}
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
        <div className="max-w-3xl mx-auto">
          {/* Header & Back Button */}
          <div className="mb-8 flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/account')}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-slate-300 font-bold hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Account
            </motion.button>

            <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
              Relational Portal
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-block p-4 bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-600 rounded-[30px] border border-white/20 shadow-2xl shadow-indigo-600/20 mb-4 animate-float">
              <Database className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
              Supabase <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">Integration</span> Portal
            </h1>
            <p className="text-slate-400 font-medium max-w-xl mx-auto text-sm leading-relaxed">
              Connect the Locals platform to your own dedicated Supabase cloud instance. Save, authenticate, and query live neighborhood datasets securely.
            </p>
          </motion.div>

          {/* Configuration Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[35px] shadow-2xl p-8 sm:p-10 relative overflow-hidden"
          >
            {/* Status overview */}
            <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Current Connection Mode</span>
                <span className="text-sm font-bold text-slate-200 mt-1 flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isCustomSupabase ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-500'}`} />
                  {isCustomSupabase ? 'Custom External Database' : 'Default Shared Locals Sandbox'}
                </span>
              </div>
              {isCustomSupabase && (
                <button
                  onClick={handleResetToSandbox}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Clear Custom keys
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Supabase URL */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  Supabase Project URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      if (testResult) setTestResult(null);
                    }}
                    placeholder="https://your-project-id.supabase.co"
                    className="w-full px-5 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium transition-all text-sm"
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Located in your Supabase project under Settings &rsaquo; API &rsaquo; Project URL
                </p>
              </div>

              {/* Supabase Anon Key */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-400" />
                  Supabase Anon Key
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={keyInput}
                    onChange={(e) => {
                      setKeyInput(e.target.value);
                      if (testResult) setTestResult(null);
                    }}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..."
                    className="w-full px-5 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono transition-all text-sm leading-relaxed"
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Also listed under Settings &rsaquo; API &rsaquo; `anon` `public` key. Do not share your service_role keys.
                </p>
              </div>

              {/* Test Connection Result Alert */}
              <AnimatePresence>
                {testResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-5 rounded-2xl border border-dashed flex items-start gap-4 ${
                      testResult.success
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                        : 'bg-red-500/10 border-red-500/30 text-red-200'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {testResult.success ? (
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-extrabold text-sm uppercase tracking-wider mb-1">
                        {testResult.success ? 'Success State' : 'Connection Rejected'}
                      </p>
                      <p className="text-xs leading-relaxed font-bold opacity-90">{testResult.message}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                {/* Connection Test Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isTesting}
                  onClick={handleTestConnection}
                  type="button"
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/15 rounded-2xl text-slate-200 hover:text-white hover:bg-white/10 transition-all font-black text-sm flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin text-purple-400' : ''}`} />
                  {isTesting ? 'Initializing Test...' : 'Test Connection'}
                </motion.button>

                {/* Save Integration Button - Primary */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSaving}
                  onClick={handleSaveCredentials}
                  type="button"
                  className="w-full sm:flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Synchronizing Keys...' : 'Save & Initialize Portal'}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Quick instructions panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 flex gap-3 text-left p-6 bg-slate-900/60 border border-white/5 rounded-3xl"
          >
            <Info className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-1.5">Where can I sign up for a database?</p>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Supabase offers clean PostgreSQL databases that are completely free to initialize on their hosting platform. Visit{' '}
                <a 
                  href="https://supabase.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5 font-bold transition-all"
                >
                  supabase.com <ExternalLink className="w-3 h-3" />
                </a>{' '}
                to provision a new standard SQL instance in seconds.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
