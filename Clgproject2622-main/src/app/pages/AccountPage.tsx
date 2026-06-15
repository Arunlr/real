import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, Mail, Phone, MapPin, Shield, CreditCard, Edit2, Save, X, CheckCircle, Camera, Lock, Smartphone, Key, Coins, TrendingUp, Award, Gift, ArrowRight, Zap, Bell, Eye, EyeOff, LogOut, Image as ImageIcon, Video, History, FileText, Star, Clock, Building2, Dumbbell, Home, Search, MousePointerClick, Sparkles, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { isCustomSupabase } from '../../utils/supabase/client';

export function AccountPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<'verifications' | 'browsing'>('verifications');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.email?.split('@')[0] || 'Rahul Sharma',
    email: user?.email || 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    city: 'Bangalore',
    joinDate: 'January 2026',
    verified: true,
  });

  const [editData, setEditData] = useState(profileData);

  // Sync profileData when user details load or are configured
  useEffect(() => {
    if (user) {
      const initialName = user.name || user.email?.split('@')[0] || 'Rahul Sharma';
      const initialEmail = user.email || 'rahul.sharma@example.com';
      
      setProfileData(prev => ({
        ...prev,
        name: initialName,
        email: initialEmail
      }));
      setEditData(prev => ({
        ...prev,
        name: initialName,
        email: initialEmail
      }));
    }
  }, [user]);

  // Load persistent profile picture from localStorage on mount
  useEffect(() => {
    const savedPic = localStorage.getItem('localz_profile_pic');
    if (savedPic) {
      setProfilePicture(savedPic);
    }
  }, []);

  const creditsData = {
    balance: 450,
    earned: 850,
    spent: 400,
    history: [
      { id: 1, type: 'earned', amount: 50, description: 'Review verified', date: '2026-02-09', icon: CheckCircle, color: 'emerald' },
      { id: 2, type: 'spent', amount: -30, description: 'Verification request', date: '2026-02-08', icon: ArrowRight, color: 'indigo' },
      { id: 3, type: 'earned', amount: 100, description: 'Photo verification bonus', date: '2026-02-07', icon: Camera, color: 'blue' },
      { id: 4, type: 'earned', amount: 50, description: 'Review verified', date: '2026-02-06', icon: CheckCircle, color: 'emerald' },
    ]
  };

  const verificationHistory = [
    {
      id: 1,
      placeName: 'Sunrise Grand Hotel',
      placeType: 'Hotel',
      location: 'Indiranagar, Bangalore',
      date: '2026-02-09',
      status: 'Completed',
      trustScore: 92,
      icon: Building2,
      color: 'blue',
    },
    {
      id: 2,
      placeName: 'FitZone Premium Gym',
      placeType: 'Gym',
      location: 'Koramangala, Bangalore',
      date: '2026-02-08',
      status: 'Completed',
      trustScore: 88,
      icon: Dumbbell,
      color: 'indigo',
    },
    {
      id: 3,
      placeName: 'ABC PG',
      placeType: 'PG/Hostel',
      location: 'HSR Layout, Bangalore',
      date: '2026-02-06',
      status: 'Completed',
      trustScore: 87,
      icon: Home,
      color: 'purple',
    },
  ];

  const browsingActivity = [
    {
      id: 1,
      action: 'Viewed verification report',
      page: 'Sunrise Grand Hotel',
      time: '2 hours ago',
      icon: MousePointerClick,
      color: 'blue',
    },
    {
      id: 2,
      action: 'Searched for gyms',
      page: 'Nearby Places',
      time: '5 hours ago',
      icon: Search,
      color: 'indigo',
    },
    {
      id: 3,
      action: 'Added review',
      page: 'FitZone Premium Gym',
      time: '1 day ago',
      icon: Star,
      color: 'amber',
    },
  ];

  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

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

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleToggle2FA = () => {
    if (!twoFactorEnabled) {
      setShowVerificationCode(true);
    } else {
      setTwoFactorEnabled(false);
    }
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }

      if (newCode.every(digit => digit) && index === 5) {
        setTimeout(() => {
          setTwoFactorEnabled(true);
          setShowVerificationCode(false);
          setVerificationCode(['', '', '', '', '', '']);
        }, 500);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Navbar />
      
      {/* Animated Background - Modern Blue/Indigo Tech Theme */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(129, 140, 248, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(129, 140, 248, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.5s ease-out',
          }}
        />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-indigo-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, particle.size, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/40 to-black" />
      </div>

      <div className="flex-1 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              Verified Local Account
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Manage Your <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Identity</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto font-medium">
              Update your local profile, monitor your verifications, and manage your trusted status.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Profile Section */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-700" />
                
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-12">
                  <div className="relative group/pic">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-40 h-40 rounded-[32px] overflow-hidden border-4 border-white/20 shadow-2xl relative cursor-pointer active:scale-95 transition-all"
                      onClick={() => setIsProfilePicModalOpen(true)}
                    >
                      {profilePicture ? (
                        <img src={profilePicture} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center">
                          <span className="text-6xl font-black text-white">{profileData.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/pic:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-10 h-10 text-white" />
                      </div>
                    </motion.div>
                    <button 
                      onClick={() => setIsProfilePicModalOpen(true)}
                      className="absolute -bottom-3 -right-3 w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all cursor-pointer"
                    >
                      <Camera className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      {isEditing ? (
                        <div className="flex flex-col gap-1.5 w-full max-w-sm">
                          <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest text-left">Display Name</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editData.name}
                              onChange={(e) => setEditData({...editData, name: e.target.value})}
                              className="px-4 py-2 bg-white/10 text-white font-bold rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-base"
                            />
                            {profileData.email && (
                              <button
                                type="button"
                                onClick={() => setEditData({...editData, name: profileData.email.split('@')[0]})}
                                className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex-shrink-0 transition-all cursor-pointer border border-indigo-400/30"
                                title="Reset to Gmail ID"
                              >
                                Gmail ID
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <h2 className="text-3xl font-black text-white">{profileData.name}</h2>
                      )}
                      <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                        <CheckCircle className="w-4 h-4" />
                        Verified Guide
                      </div>
                    </div>
                    <p className="text-slate-400 font-bold mb-6 flex items-center justify-center md:justify-start gap-2">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      Based in {profileData.city}, Bangalore
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                          >
                            Edit Profile
                          </button>
                          <button
                            onClick={() => navigate('/local/signup')}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-purple-500/30 active:scale-95 flex items-center gap-2"
                          >
                            <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
                            Become a Verifier
                          </button>
                        </>
                      ) : (
                        <div className="flex gap-3">
                          <button onClick={handleSave} className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm active:scale-95 transition-all">Save Changes</button>
                          <button onClick={handleCancel} className="px-8 py-3 bg-white/10 text-white rounded-2xl font-black text-sm active:scale-95 transition-all">Cancel</button>
                        </div>
                      )}
                      {user?.email === 'respectkills@gmail.com' && (
                        <button
                          onClick={() => navigate('/admin')}
                          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-cyan-500/30 active:scale-95 flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4 text-cyan-200 animate-pulse" />
                          Complete Admin Panel
                        </button>
                      )}
                      <button onClick={handleLogout} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-sm transition-all border border-white/10 active:scale-95">Logout</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-white font-bold flex items-center gap-3">
                      <Mail className="w-5 h-5 text-indigo-400" />
                      {isEditing ? (
                        <input value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} className="bg-transparent border-none p-0 focus:ring-0 w-full" />
                      ) : profileData.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-white font-bold flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-400" />
                      {isEditing ? (
                        <input value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} className="bg-transparent border-none p-0 focus:ring-0 w-full" />
                      ) : profileData.phone}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Security Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Trust & Security</h2>
                    <p className="text-slate-400 text-sm font-medium">Protect your identity and verifier status.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 gap-6">
                    <div className="flex gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${twoFactorEnabled ? 'bg-emerald-500/20' : 'bg-slate-700/20'}`}>
                        <Smartphone className={`w-7 h-7 ${twoFactorEnabled ? 'text-emerald-400' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <p className="text-white font-black">2-Step Verification</p>
                        <p className="text-slate-400 text-sm font-medium">Extra layer of security for verification reports.</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleToggle2FA}
                      className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95 ${twoFactorEnabled ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'}`}
                    >
                      {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Supabase Database Integration Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Database Integration</h2>
                    <p className="text-slate-400 text-sm font-medium font-bold">Configure and sync your custom Supabase database.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 gap-6">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-500/10">
                        <Database className="w-7 h-7 text-purple-400 animate-pulse" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-black">Connection Credentials</p>
                        <p className="text-slate-400 text-sm font-medium">
                          Active: {isCustomSupabase ? 'Custom External Database' : 'Shared Locals Sandbox'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/supabase-setup')}
                      className="px-8 py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 cursor-pointer"
                    >
                      Configure Keys
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar Credits & Rank */}
            <div className="space-y-8">
              {/* Credits Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-indigo-600 rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden group"
              >
                <motion.div 
                  className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <Coins className="w-12 h-12 mb-6 opacity-50" />
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-100 mb-2">Total Balance</h3>
                <div className="text-6xl font-black mb-8 leading-none">450 <span className="text-xl font-bold opacity-70">LCR</span></div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm font-bold border-b border-white/10 pb-3">
                    <span className="opacity-70">Weekly Earned</span>
                    <span className="text-emerald-300">+150</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold border-b border-white/10 pb-3">
                    <span className="opacity-70">Recent Spending</span>
                    <span className="text-indigo-200">-30</span>
                  </div>
                </div>
                <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-sm active:scale-95 transition-all shadow-xl">
                  Redeem Rewards
                </button>
              </motion.div>

              {/* Achievements Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 shadow-2xl"
              >
                <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                  <Award className="w-6 h-6 text-indigo-400" />
                  Unlocked Badges
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '🏆', label: 'Explorer', color: 'bg-amber-400/10' },
                    { icon: '⚡', label: 'Fast Fix', color: 'bg-blue-400/10' },
                    { icon: '🛡️', label: 'Trusted', color: 'bg-indigo-400/10' },
                    { icon: '🌟', label: 'Reviewer', color: 'bg-purple-400/10' },
                  ].map((badge) => (
                    <div key={badge.label} className={`flex flex-col items-center gap-3 p-5 rounded-[32px] ${badge.color} border border-white/5 group hover:bg-white/10 transition-all`}>
                      <span className="text-3xl shadow-sm">{badge.icon}</span>
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Immersive Avatar Selector & Profile Photo Upload Modal */}
      <AnimatePresence>
        {isProfilePicModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfilePicModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-slate-900 border border-white/10 rounded-[32px] p-6 max-w-lg w-full relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsProfilePicModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-indigo-400" />
                Configure Profile Photo
              </h3>
              <p className="text-sm text-slate-400 mb-6 font-medium">
                Choose a verified local badge avatar or upload your custom hardware authorization card photo.
              </p>

              {/* Direct File Selector Container */}
              <div className="mb-6 font-sans">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Upload Custom Image</label>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-dashed border-white/10 hover:border-white/20 transition-all">
                  <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-xs font-black text-white block">Local PNG or JPG</span>
                    <span className="text-[10px] text-slate-400 block">Up to 4MB auto-compressed</span>
                  </div>
                  <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md">
                    Choose File
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64 = reader.result as string;
                            setProfilePicture(base64);
                            localStorage.setItem('localz_profile_pic', base64);
                            setIsProfilePicModalOpen(false);
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Preset avatars */}
              <div className="font-sans">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Preselected Avatar Set</label>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
                  ].map((url, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setProfilePicture(url);
                        localStorage.setItem('localz_profile_pic', url);
                        setIsProfilePicModalOpen(false);
                      }}
                      className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/5 hover:border-indigo-500 transition-all cursor-pointer relative"
                    >
                      <img src={url} className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
