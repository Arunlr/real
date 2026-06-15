import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { StatusBadge } from '../components/StatusBadge';
import { Eye, MapPin, Calendar, TrendingUp, Clock, Award, Zap, Bell, Star, Flame, Target, Gift, ChevronRight, Map, Activity, CreditCard, Users, Shield, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../utils/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 15 - 7.5,
        y: (e.clientY / window.innerHeight) * 15 - 7.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const { data: revs, error: revError } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles!reviews_verifier_id_fkey(full_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (revError) throw revError;
      setReviews(revs || []);

      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (notifs) {
        setNotifications(notifs);
      }
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();

      const rSubscription = supabase
        .channel(`reviews_user_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews', filter: `user_id=eq.${user.id}` }, () => {
          fetchData();
        })
        .subscribe();

      const nSubscription = supabase
        .channel(`notifications_user_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => {
          fetchData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(rSubscription);
        supabase.removeChannel(nSubscription);
      };
    }
  }, [user?.id]);

  const stats = {
    totalRequests: reviews.length,
    completed: reviews.filter(r => r.verification_status === 'approved').length,
    inProgress: reviews.filter(r => r.verification_status === 'pending').length,
    credits: user?.reward_balance || 0,
    streak: user?.xp_points ? Math.floor(user.xp_points / 250) + 1 : 1,
  };

  const getMappedStatus = (status: string) => {
    if (status === 'approved') return 'completed';
    if (status === 'rejected') return 'failed';
    return 'in-progress';
  };

  const filteredRequests = reviews.filter(request => {
    const mapped = getMappedStatus(request.verification_status);
    const matchesFilter = filterStatus === 'all' || mapped === filterStatus;
    const matchesSearch = 
      request.place_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Dashboard Overview
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                  Welcome Back, {user?.name || 'Local Guide'}!
                </h1>
                <p className="text-slate-600 text-lg mt-2 font-medium">Track your verifications and community rewards.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/account')}
                className="relative bg-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <Bell className="w-6 h-6" />
                {notifications.some(n => !n.is_read) && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 rounded-full border-4 border-white"></span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 group hover:border-indigo-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Total Requests</p>
              <p className="text-3xl font-black text-slate-900">{stats.totalRequests}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 group hover:border-emerald-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Completed</p>
              <p className="text-3xl font-black text-slate-900">{stats.completed}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 group hover:border-blue-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Active</p>
              <p className="text-3xl font-black text-slate-900">{stats.inProgress}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-indigo-600 rounded-3xl p-6 shadow-xl shadow-indigo-600/20 text-white relative overflow-hidden group"
            >
              <motion.div 
                className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <p className="text-indigo-100 font-bold text-xs uppercase tracking-wider mb-1">Earnings Balance</p>
              <p className="text-3xl font-black">₹{stats.credits}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-900/20 text-white relative overflow-hidden group"
            >
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Guide Level</p>
              <p className="text-3xl font-black">{stats.streak}</p>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 mb-10"
          >
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-indigo-600" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Verify a Place', icon: Target, color: 'bg-indigo-500', path: '/add-review' },
                { label: 'Explore Places', icon: Map, color: 'bg-blue-500', path: '/home' },
                { label: 'My Rewards', icon: Gift, color: 'bg-emerald-500', path: '/rewards' },
                { label: 'Settings', icon: Award, color: 'bg-amber-500', path: '/account' },
              ].map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => action.path && navigate(action.path)}
                  className="flex flex-col items-center gap-4 p-6 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group"
                >
                  <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-black text-slate-900">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Verifications List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900">Your Verification Submissions</h2>
                  
                  <div className="flex gap-2">
                    {['all', 'completed', 'in-progress', 'failed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status as any)}
                        className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                          filterStatus === status
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status === 'in-progress' ? 'Pending' : status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search your custom reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Verifications Cards */}
              <div className="space-y-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Activity className="w-8 h-8 animate-spin text-indigo-600" />
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
                    <p className="text-slate-500 font-medium text-lg">No reviews found matching the filter.</p>
                    <button onClick={() => navigate('/add-review')} className="mt-4 bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-indigo-700 transition">
                      Add Your First Review
                    </button>
                  </div>
                ) : filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all group"
                  >
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {request.place_name}
                            </h3>
                            <StatusBadge status={getMappedStatus(request.verification_status)} />
                          </div>
                          <div className="flex items-center text-slate-500 font-bold text-sm mb-4">
                            <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                            {request.address} • {request.category}
                          </div>
                          {request.profiles && (
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-xl inline-flex">
                              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                <Users className="w-3.5 h-3.5 text-indigo-600" />
                              </div>
                              Assigned Verifier: {request.profiles.full_name}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                            <span className="text-xl font-black text-slate-900">{request.rating}</span>
                          </div>
                          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-2">{request.category.toUpperCase()} Rating</span>
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                        {request.description || 'No description provided.'}
                      </p>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-slate-100">
                        <div className="flex items-center text-sm font-bold text-slate-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          Submitted {new Date(request.created_at).toLocaleDateString()}
                        </div>

                        {request.verification_status === 'approved' ? (
                          <button
                            onClick={() => navigate(`/report/${request.id}`)}
                            className="bg-slate-900 hover:bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all flex items-center gap-3 shadow-lg shadow-slate-900/10 active:scale-95"
                          >
                            <Eye className="w-4 h-4" />
                            View Trust Verification Report
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="flex items-center gap-3 text-sm font-black text-indigo-600 bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
                            <Activity className="w-4 h-4 animate-spin" />
                            PENDING PHYSICAL AUDIT
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Activity Feed */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8"
              >
                <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <Activity className="w-6 h-6 text-indigo-600" />
                  Recent System Logs
                </h2>
                <div className="space-y-6">
                  {notifications.length === 0 ? (
                    <p className="text-slate-400 text-sm font-medium">No system notifications found.</p>
                  ) : notifications.map((notif, index) => (
                    <div key={notif.id} className="flex gap-4 relative">
                      {index !== notifications.length - 1 && (
                        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-100" />
                      )}
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-slate-100 border border-slate-200`}>
                        <Bell className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-900 leading-tight">{notif.title}</p>
                        <p className="text-xs font-medium text-slate-500 mt-1">
                          {notif.message}
                        </p>
                        <p className="text-[10px] font-medium text-slate-300 mt-1">
                          {new Date(notif.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Achievements Card */}
              <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full" />
                <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                  <Award className="w-6 h-6 text-indigo-400" />
                  Role & Verification Status
                </h2>
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 group-hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 bg-amber-400/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      🛡️
                    </div>
                    <div>
                      <p className="font-black text-sm">Role: {user?.role?.toUpperCase() || 'USER'}</p>
                      <p className="text-[10px] font-black text-amber-400 mt-1">Trust Score: {user?.trust_score || 100}%</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 group-hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 bg-blue-400/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      ⚡
                    </div>
                    <div>
                      <p className="font-black text-sm">Total XP: {user?.xp_points || 0}</p>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Authentic Member</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] p-8 text-white relative overflow-hidden">
                <motion.div
                  className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <Shield className="w-10 h-10 mb-4 opacity-50" />
                <h3 className="text-2xl font-black mb-2">Secure Localz</h3>
                <p className="text-indigo-100 font-medium mb-8 leading-relaxed">
                  Earn cashback and high reputation inside your city with verified reviews!
                </p>
                <button 
                  onClick={() => navigate('/add-review')}
                  className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-xl"
                >
                  Post Review Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
