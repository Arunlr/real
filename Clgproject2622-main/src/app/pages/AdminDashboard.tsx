import { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import {
  Users, UserCheck, MessageSquare, AlertTriangle,
  Clock, Gift, TrendingUp, Activity, ArrowUp, ArrowDown,
  Eye, Shield, Zap, Target, Award, DollarSign, CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { supabase } from '../../utils/supabase/client';

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalUsers: 0,
    totalContributors: 0,
    totalVerifiers: 0,
    totalReviews: 0,
    pendingVerifications: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    totalRewardsDistributed: 0,
    topContributors: [] as any[],
    reviewsByCategory: [] as any[],
    aiAuthenticity: [] as any[],
    recentActivities: [] as any[],
    dailyAnalytics: [] as any[]
  });

  const loadAdminMetrics = async () => {
    try {
      setLoading(true);

      const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('*');

      if (pErr) throw pErr;

      const { data: reviews, error: rErr } = await supabase
        .from('reviews')
        .select('*');

      if (rErr) throw rErr;

      const { data: rewards, error: rewErr } = await supabase
        .from('rewards')
        .select('*');

      if (rewErr) throw rewErr;

      const profileList = profiles || [];
      const reviewList = reviews || [];
      const rewardList = rewards || [];

      const totalUsers = profileList.length;
      const totalContributors = profileList.filter(p => p.role === 'contributor' || p.role === 'user').length;
      const totalVerifiers = profileList.filter(p => p.role === 'verifier').length;

      const totalReviews = reviewList.length;
      const pendingVerifications = reviewList.filter(r => r.verification_status === 'pending').length;
      const approvedReviews = reviewList.filter(r => r.verification_status === 'approved').length;
      const rejectedReviews = reviewList.filter(r => r.verification_status === 'rejected').length;

      const totalRewardsDistributed = rewardList.reduce((acc, curr) => acc + (Number(curr.cashback) || 0), 0);

      // Top Contributors
      const topContributors = [...profileList]
        .sort((a, b) => (b.xp_points || 0) - (a.xp_points || 0))
        .slice(0, 5)
        .map((p, idx) => ({
          name: p.full_name || p.email?.split('@')[0] || 'Contributor',
          reviews: reviewList.filter(r => r.user_id === p.id).length,
          xp: p.xp_points || 0,
          rank: idx + 1,
          avatar: (p.full_name || 'C').substring(0, 2).toUpperCase()
        }));

      // Reviews Per Category
      const categoryMap: { [key: string]: number } = {};
      reviewList.forEach(r => {
        const cat = r.category || 'other';
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });
      const reviewsByCategory = Object.keys(categoryMap).map(key => ({
        name: key.toUpperCase(),
        value: categoryMap[key]
      }));

      // AI score metrics
      const genuine = reviewList.filter(r => r.ai_score >= 80).length;
      const fake = reviewList.filter(r => r.ai_score < 55).length;
      const suspicious = reviewList.filter(r => r.ai_score >= 55 && r.ai_score < 80).length;

      const aiAuthenticity = [
        { name: 'Genuine', value: genuine || 5, color: '#10b981' },
        { name: 'Slop/Fake', value: fake || 1, color: '#ef4444' },
        { name: 'Suspicious', value: suspicious || 2, color: '#f59e0b' }
      ];

      // Recent Activity
      const recentActivities = reviewList.slice(0, 5).map(r => {
        const p = profileList.find(prof => prof.id === r.user_id);
        return {
          id: r.id,
          type: 'review',
          user: p?.full_name || 'Local Guide',
          action: `submitted a review for ${r.place_name}`,
          time: new Date(r.created_at).toLocaleDateString(),
          icon: MessageSquare,
          color: 'text-cyan-400'
        };
      });

      // Daily analytics data
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dailyMap: { [key: string]: { verified: number; pending: number; rejected: number } } = {};
      days.forEach(d => {
        dailyMap[d] = { verified: 0, pending: 0, rejected: 0 };
      });

      reviewList.forEach(r => {
        const dayName = days[new Date(r.created_at).getDay()];
        if (r.verification_status === 'approved') {
          dailyMap[dayName].verified += 1;
        } else if (r.verification_status === 'rejected') {
          dailyMap[dayName].rejected += 1;
        } else {
          dailyMap[dayName].pending += 1;
        }
      });

      const dailyAnalytics = days.map(d => ({
        day: d,
        verified: dailyMap[d].verified,
        pending: dailyMap[d].pending,
        rejected: dailyMap[d].rejected
      }));

      setData({
        totalUsers,
        totalContributors,
        totalVerifiers,
        totalReviews,
        pendingVerifications,
        approvedReviews,
        rejectedReviews,
        totalRewardsDistributed,
        topContributors,
        reviewsByCategory,
        aiAuthenticity,
        recentActivities,
        dailyAnalytics
      });
    } catch (e) {
      console.error('Failed to load admin metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminMetrics();
  }, []);

  const stats = [
    {
      label: 'Total Users',
      value: String(data.totalUsers),
      change: '+100%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      label: 'Active Contributors',
      value: String(data.totalContributors),
      change: '+100%',
      trend: 'up',
      icon: UserCheck,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      label: 'Total Verifiers',
      value: String(data.totalVerifiers),
      change: '+100%',
      trend: 'up',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      label: 'Total Reviews',
      value: String(data.totalReviews),
      change: '+100%',
      trend: 'up',
      icon: MessageSquare,
      color: 'from-cyan-500 to-teal-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30'
    },
    {
      label: 'Pending Reviews',
      value: String(data.pendingVerifications),
      change: 'Active',
      trend: 'up',
      icon: Clock,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    },
    {
      label: 'Approved Reviews',
      value: String(data.approvedReviews),
      change: 'Verified',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    },
    {
      label: 'Rejected Reviews',
      value: String(data.rejectedReviews),
      change: 'Declined',
      trend: 'down',
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    {
      label: 'Rewards Distributed',
      value: `₹${data.totalRewardsDistributed}`,
      change: 'Disbursed',
      trend: 'up',
      icon: Gift,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Live System Analytics</h1>
            <p className="text-gray-400 mt-1">Real-time database analytics from Supabase PostgreSQL</p>
          </div>
          <button 
            onClick={loadAdminMetrics}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/35 transition-all"
          >
            Refresh Database
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Activity className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border ${stat.borderColor} rounded-2xl p-6 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all group`}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-all`} />

                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 ${stat.bgColor} border ${stat.borderColor} rounded-xl`}>
                          <Icon className={`w-6 h-6 text-white`} />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {stat.change}
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reviews Category Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Reviews per Category</h2>
                    <p className="text-gray-400 text-sm mt-1">Dynamic categories listed inside reviews</p>
                  </div>
                  <Target className="w-5 h-5 text-indigo-400" />
                </div>
                {data.reviewsByCategory.length === 0 ? (
                  <p className="text-center text-slate-500 py-10">No categories found in reviews.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.reviewsByCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#fff'
                        }}
                      />
                      <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </motion.div>

              {/* Review Audit Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Daily Review Audits</h2>
                    <p className="text-gray-400 text-sm mt-1">Review validation output across weekdays</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.dailyAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="verified" fill="#10b981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="pending" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="rejected" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* AI Detection Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Trust & safety AI analysis</h2>
                    <p className="text-gray-400 text-sm mt-1">Review validation authenticity metrics</p>
                  </div>
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={data.aiAuthenticity}
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      dataKey="value"
                      label={(entry) => `${entry.name}`}
                    >
                      {data.aiAuthenticity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Recent Activities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Log Entries</h2>
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                <div className="space-y-4 max-h-[220px] overflow-y-auto">
                  {data.recentActivities.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-10">No recent submissions found.</p>
                  ) : (
                    data.recentActivities.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                          <div className={`p-2 bg-white/5 rounded-lg ${activity.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-white">
                              <span className="font-semibold">{activity.user}</span> {activity.action}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>

              {/* Top Contributors */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Local Leaderboard</h2>
                  <Award className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="space-y-3.5">
                  {data.topContributors.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-10">No members listed in system yet.</p>
                  ) : (
                    data.topContributors.map((contributor) => (
                      <div key={contributor.rank} className="flex items-center gap-4 p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-cyan-400">#{contributor.rank}</span>
                          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">{contributor.avatar}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{contributor.name}</p>
                          <p className="text-[10px] text-gray-400">{contributor.reviews} reviews • {contributor.xp} XP</p>
                        </div>
                        <Target className="w-4 h-4 text-yellow-400" />
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
