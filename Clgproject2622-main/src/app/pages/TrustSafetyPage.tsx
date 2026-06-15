import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, ShieldCheck, MapPin, Eye, Camera, CheckCircle, ArrowLeft, 
  RotateCcw, AlertTriangle, Users, Award, Lock, Sparkles, Home, 
  Scale, BookOpen, UserCheck, Cpu, ChevronRight, Zap, RefreshCw, Info
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export function TrustSafetyPage() {
  const navigate = useNavigate();

  // Interactive Trust Meter Calculator State
  const [coordsAccuracy, setCoordsAccuracy] = useState(5); // in meters
  const [photoMethods, setPhotoMethods] = useState<'live' | 'uploaded'>('live');
  const [peerReviews, setPeerReviews] = useState<number>(3); // number of positive reviews
  const [isAiValidated, setIsAiValidated] = useState<boolean>(true);
  const [historicalVerif, setHistoricalVerif] = useState<number>(12); // completed verifications

  // Calculate dynamic trust rating based on parameters above
  const computeTrustScore = () => {
    let score = 50; // base score

    // Coords Accuracy impact: up to +15 pts
    if (coordsAccuracy <= 3) score += 15;
    else if (coordsAccuracy <= 7) score += 10;
    else if (coordsAccuracy <= 15) score += 5;

    // Photo Method: live camera gives +15 pts (more trusted) vs uploaded
    if (photoMethods === 'live') score += 15;
    else score += 5;

    // Peer reviews: +5 pts per peer review, cap at +20 pts
    score += Math.min(peerReviews * 5, 20);

    // AI validation matching: +15 pt
    if (isAiValidated) score += 15;

    // Experience multiplier: up to +15 pts
    score += Math.min(historicalVerif * 1, 15);

    // Absolute limits
    return Math.min(100, Math.max(10, score));
  };

  const currentScore = computeTrustScore();

  const getTrustBadge = (score: number) => {
    if (score >= 85) return { name: 'Elite Guardian', color: 'from-purple-500 to-indigo-500', text: 'text-purple-400' };
    if (score >= 70) return { name: 'Trusted Local', color: 'from-emerald-500 to-teal-500', text: 'text-emerald-400' };
    if (score >= 40) return { name: 'Verified Contributor', color: 'from-blue-500 to-cyan-500', text: 'text-blue-400' };
    return { name: 'Candidate status', color: 'from-gray-500 to-slate-500', text: 'text-gray-400' };
  };

  const badge = getTrustBadge(currentScore);

  const resetCalculator = () => {
    setCoordsAccuracy(5);
    setPhotoMethods('live');
    setPeerReviews(3);
    setIsAiValidated(true);
    setHistoricalVerif(12);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-yellow-500 selection:text-slate-900 font-sans relative overflow-hidden">
      {/* Background radial elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Header / Navigation bar */}
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-28 pb-20">
        
        {/* Navigation & Controls header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <motion.button
            onClick={() => navigate('/home')}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-white font-bold rounded-2xl border-2 border-emerald-500/20 hover:border-emerald-500/40 flex items-center gap-2 cursor-pointer shadow-xl backdrop-blur-md group transition-all duration-300"
            id="back-btn-top"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-400 group-hover:-translate-x-1.5 transition-transform duration-300" />
            <span className="tracking-wide">Back to Home Page</span>
          </motion.button>
          
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs text-emerald-400 font-bold tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 animate-pulse text-emerald-400" />
            Official Security & Integrity Standard
          </div>
        </div>

        {/* HERO TITLE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4 p-3 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-3xl border border-emerald-500/30">
            <Shield className="w-12 h-12 text-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Trust & Safety Core
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-medium">
            Discover the uncompromised standard of verification. Our comprehensive network utilizes multi-signature physical validation, real-time secure telemetry, and community peer audits to engineer an unbreakable chain of trust.
          </p>
        </motion.div>

        {/* THREE CORE PILLARS BLOCK */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* PILLAR 1: Real-time Telemetry & GPS Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/12 transition-all duration-500" />
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3">Anti-Spoof GPS Control</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              We check geographic coordinates directly from system APIs (not device headers) when capturing media. Photos are validated against registered business bounding boxes, ensuring verifiers physically set foot inside authorized boundaries.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              ACCURACY THRESHOLD &lt; 15 METERS
            </div>
          </motion.div>

          {/* PILLAR 2: AI Computer Vision & EXIF Audits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/12 transition-all duration-500" />
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3">AI Vision Verification</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Our automated models scan each submission. We detect manipulated imagery, verify visual consistency of elements (signboards, exterior, facilities), identify license plates or private metadata to mask them, and match historical photographs for discrepancy alerts.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              COMPLEMENTARY REVERSE REPOSITORY CHECKS
            </div>
          </motion.div>

          {/* PILLAR 3: Multi-Verifier Consensuses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/12 transition-all duration-500" />
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3">Peer Multi-Sign Review</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Any high-value location or disputed property receives double-blind verification. Different verifiers from independent areas inspect physical sites without overlapping assignments, matching results together for 100% verified validity.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              DOUBLE-BLIND CONSENSUS SYSTEM
            </div>
          </motion.div>

        </div>

        {/* SECTION: INTERACTIVE TRUST CALCULATOR GIG */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 border border-slate-800 shadow-2xl flex-1 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/25 rounded-xl">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Trust Engine Simulator</h3>
                  <p className="text-xs text-slate-400 font-mono">CALCULATE HOW VERIFIER ACTIVITIES IMPACT TRUST SCORE INDEX</p>
                </div>
                <button 
                  onClick={resetCalculator}
                  className="ml-auto p-2 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700/50 flex items-center gap-1.5 text-xs font-bold transition-all"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              {/* SLIDERS & OPTIONS */}
              <div className="space-y-6">
                
                {/* Lat/Lng Accuracy */}
                <div className="p-4 bg-slate-950/70 border border-slate-850 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-300">GPS Telemetry Accuracy</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{coordsAccuracy} meters</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    value={coordsAccuracy}
                    onChange={(e) => setCoordsAccuracy(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 rounded-lg appearance-none h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>1m (Highest)</span>
                    <span>15m (Required Limit)</span>
                    <span>30m (Low Trust)</span>
                  </div>
                </div>

                {/* Live Capture vs Uploaded */}
                <div className="p-4 bg-slate-950/70 border border-slate-850 rounded-2xl">
                  <span className="text-sm font-bold text-slate-300 block mb-2">Photo Capture Method</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPhotoMethods('live')}
                      className={`py-2 px-4 rounded-xl text-xs font-extrabold tracking-wider uppercase border transition-all ${
                        photoMethods === 'live'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      📷 Live Camera (High trust)
                    </button>
                    <button
                      onClick={() => setPhotoMethods('uploaded')}
                      className={`py-2 px-4 rounded-xl text-xs font-extrabold tracking-wider uppercase border transition-all ${
                        photoMethods === 'uploaded'
                          ? 'bg-amber-500/15 border-amber-500/60 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      📁 Local File Upload
                    </button>
                  </div>
                </div>

                {/* Peer reviews */}
                <div className="p-4 bg-slate-950/70 border border-slate-850 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-300">Double-Blind Peer Confirmations</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">{peerReviews} Peers</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="5" 
                    value={peerReviews}
                    onChange={(e) => setPeerReviews(Number(e.target.value))}
                    className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>0 Reviews</span>
                    <span>3 Reviews (Optimal)</span>
                    <span>5 (Maximum)</span>
                  </div>
                </div>

                {/* Toggle Controls for AI & History */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* AI Metadata Val */}
                  <div className="p-4 bg-slate-950/70 border border-slate-850 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">AI Photo Match Validate</span>
                      <span className="text-[10px] text-slate-500 font-mono">Neural network pattern check</span>
                    </div>
                    <button
                      onClick={() => setIsAiValidated(!isAiValidated)}
                      className={`w-12 h-6 rounded-full p-1 transition-all ${
                        isAiValidated ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                        isAiValidated ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Experience counter */}
                  <div className="p-4 bg-slate-950/70 border border-slate-850 rounded-2xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-300">Historical Submissions</span>
                      <span className="text-xs font-mono font-bold text-indigo-400">{historicalVerif}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="0" 
                        max="20" 
                        value={historicalVerif}
                        onChange={(e) => setHistoricalVerif(Number(e.target.value))}
                        className="w-full accent-indigo-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                      />
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* SIMULATOR OUTPUT PANEL */}
          <div className="lg:col-span-5 flex">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 border border-indigo-500/20 shadow-2xl flex-1 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent pointer-events-none" />
              
              <div className="text-center relative z-10">
                <span className="text-xs tracking-widest text-indigo-300 font-mono uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 inline-block mb-6">
                  CALCULATED SCORE INDEX
                </span>
                
                {/* Circular indicator container */}
                <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                  {/* Outer circle layout */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="#1e293b" 
                      strokeWidth="6" 
                      fill="transparent" 
                    />
                    <motion.circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke={currentScore >= 70 ? '#10b981' : currentScore >= 40 ? '#06b6d4' : '#eab308'} 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray="251.2"
                      animate={{ strokeDashoffset: 251.2 - (251.2 * currentScore) / 100 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 80 }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-black text-white">{currentScore}</span>
                    <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">PTS VALUE</span>
                  </div>
                </div>

                <h4 className="text-2xl font-black text-white mb-2 tracking-tight">
                  Status: <span className={badge.text}>{badge.name}</span>
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Excellent metrics ensure priority dispatch, higher payout multiplier, and quick peer-approval processing times.
                </p>
              </div>

              {/* STATS PROGRESSION DETAILS */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 mt-6 font-mono text-xs text-slate-300 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> GPS Precision</span>
                  <span className={coordsAccuracy <= 7 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {coordsAccuracy <= 7 ? 'Optimal Proof' : 'Nominal'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1"><Camera className="w-3.5 h-3.5 text-slate-400" /> Media Source</span>
                  <span className={photoMethods === 'live' ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {photoMethods === 'live' ? 'In-App Secure Cam (+15)' : 'File Storage Upload (+5)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> Co-verifier Match</span>
                  <span className={peerReviews >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {peerReviews} Matches (+{peerReviews * 5})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-slate-400" /> Computer Vision</span>
                  <span className={isAiValidated ? 'text-emerald-400 font-bold' : 'text-yellow-400'}>
                    {isAiValidated ? 'Valid metadata match (+15)' : 'Flagged discrepancy (+0)'}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* VERIFIER SECURITY GUIDANCE & CONDUCT */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-16">
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/10 border border-yellow-500/25 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Trust, Safety & Conduct Guidelines</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div className="p-5 bg-slate-950/70 rounded-2xl border border-slate-850">
              <h4 className="font-extrabold text-white text-base mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Physical Field Rules
              </h4>
              <ul className="space-y-3 font-medium text-slate-400 leading-relaxed">
                <li>• <strong className="text-slate-300">Always ask permission:</strong> Never trespass onto private properties. Stand on public walkways or communal spaces to take outer photos.</li>
                <li>• <strong className="text-slate-300">Respect civilian privacy:</strong> Blindly blur faces, private documents, or vehicular number plates. Our AI filter filters them automatically, but keep them off picture fields whenever possible.</li>
                <li>• <strong className="text-slate-300">Wear identification:</strong> If requested by security, specify that you are an independent verifier conducting an inspection for Locals.com.</li>
              </ul>
            </div>

            <div className="p-5 bg-slate-950/70 rounded-2xl border border-slate-850">
              <h4 className="font-extrabold text-white text-base mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                Integrity & Manipulation Policies
              </h4>
              <ul className="space-y-3 font-medium text-slate-400 leading-relaxed">
                <li>• <strong className="text-slate-300">Zero tolerance for spoofing:</strong> Any spoofing app detected inside your device system instantly leads to profile ban of all earnings accrued.</li>
                <li>• <strong className="text-slate-300">Stock images forbidden:</strong> Do not upload reviews containing online images. Reviews must reflect current physical state.</li>
                <li>• <strong className="text-slate-300">Peer collusion risk:</strong> Verifier accounts found colluding on double-blind assessments are blacklisted with their coordinates flagged.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM HOME ACTIONS BLOCK */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-indigo-900/50 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-10 text-center relative overflow-hidden"
        >
          <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Ready to Return to Bangalore Map?</h3>
          <p className="text-slate-400 font-medium max-w-xl mx-auto mb-8 text-sm md:text-base">
            Now that you have reviewed the Trust & Safety guidelines, return to the interactive dashboard to request or audit local places.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              onClick={() => navigate('/home')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-500/20 cursor-pointer flex items-center gap-2 group transition-all"
              id="back-btn-bottom"
            >
              <Home className="w-5 h-5 text-white animate-pulse" />
              Return to Home Dashboard
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
