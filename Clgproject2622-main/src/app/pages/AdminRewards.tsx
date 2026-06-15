import { AdminLayout } from '../components/admin/AdminLayout';
import {
  Gift, TrendingUp, Award, DollarSign, Users, Target,
  CheckCircle, Clock, XCircle, Zap, Trophy, Star
} from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function AdminRewards() {
  const rewardStats = [
    {
      label: 'Total Rewards Distributed',
      value: '₹12.4M',
      change: '+23.5%',
      icon: Gift,
      color: 'from-pink-500 to-rose-500',
      textColor: 'text-pink-400'
    },
    {
      label: 'Active Reward Campaigns',
      value: '24',
      change: '+4',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-400'
    },
    {
      label: 'Cashback Claimed Today',
      value: '₹45,678',
      change: '+18.2%',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-400'
    },
    {
      label: 'Pending Approvals',
      value: '156',
      change: '-12',
      icon: Clock,
      color: 'from-yellow-500 to-amber-500',
      textColor: 'text-yellow-400'
    },
  ];

  const rewardDistributionData = [
    { month: 'Jan', cashback: 850000, xp: 450000, coupons: 120000 },
    { month: 'Feb', cashback: 920000, xp: 520000, coupons: 145000 },
    { month: 'Mar', cashback: 1050000, xp: 610000, coupons: 178000 },
    { month: 'Apr', cashback: 1180000, xp: 680000, coupons: 195000 },
    { month: 'May', cashback: 1340000, xp: 790000, coupons: 220000 },
    { month: 'Jun', cashback: 1520000, xp: 880000, coupons: 265000 },
  ];

  const topEarners = [
    { rank: 1, name: 'Rahul Sharma', avatar: 'RS', earned: '₹45,890', xp: 12450, level: 'Diamond' },
    { rank: 2, name: 'Priya Patel', avatar: 'PP', earned: '₹38,670', xp: 10890, level: 'Platinum' },
    { rank: 3, name: 'Amit Kumar', avatar: 'AK', earned: '₹32,450', xp: 9870, level: 'Gold' },
    { rank: 4, name: 'Sneha Singh', avatar: 'SS', earned: '₹28,340', xp: 8765, level: 'Gold' },
    { rank: 5, name: 'Vikas Gupta', avatar: 'VG', earned: '₹24,890', xp: 8234, level: 'Silver' },
  ];

  const recentTransactions = [
    {
      id: 1,
      user: 'Rahul Sharma',
      type: 'cashback',
      amount: '₹500',
      status: 'completed',
      reason: 'Review verification bonus',
      time: '2 mins ago'
    },
    {
      id: 2,
      user: 'Priya Patel',
      type: 'xp',
      amount: '250 XP',
      status: 'completed',
      reason: 'Quality review reward',
      time: '15 mins ago'
    },
    {
      id: 3,
      user: 'Amit Kumar',
      type: 'cashback',
      amount: '₹300',
      status: 'pending',
      reason: 'Monthly streak bonus',
      time: '28 mins ago'
    },
    {
      id: 4,
      user: 'Sneha Singh',
      type: 'coupon',
      amount: '₹1000 Voucher',
      status: 'completed',
      reason: 'Top contributor reward',
      time: '1 hour ago'
    },
    {
      id: 5,
      user: 'Vikas Gupta',
      type: 'cashback',
      amount: '₹200',
      status: 'rejected',
      reason: 'Suspicious activity detected',
      time: '2 hours ago'
    },
  ];

  const activeCampaigns = [
    {
      id: 1,
      name: 'Summer Review Bonanza',
      type: 'Cashback',
      budget: '₹500,000',
      spent: '₹342,890',
      participants: 2340,
      endDate: '2024-08-31',
      status: 'active'
    },
    {
      id: 2,
      name: 'XP Double Weekend',
      type: 'XP Boost',
      budget: 'Unlimited',
      spent: '890K XP',
      participants: 5670,
      endDate: '2024-07-21',
      status: 'active'
    },
    {
      id: 3,
      name: 'New User Welcome Reward',
      type: 'Coupon',
      budget: '₹200,000',
      spent: '₹145,670',
      participants: 1234,
      endDate: 'Ongoing',
      status: 'active'
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Gift className="w-8 h-8 text-pink-400" />
              Rewards Management
            </h1>
            <p className="text-gray-400 mt-1">Manage rewards, XP, cashback, and campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all">
              Export Report
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-pink-500/50 transition-all">
              Create Campaign
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {rewardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:shadow-pink-500/10 transition-all group"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-all`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-white/5 border border-white/10 rounded-xl`}>
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                    <span className="text-sm font-medium text-green-400">{stat.change}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reward Distribution Trend */}
          <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Reward Distribution Trend</h2>
                <p className="text-gray-400 text-sm mt-1">Monthly breakdown by reward type</p>
              </div>
              <TrendingUp className="w-6 h-6 text-pink-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rewardDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#9ca3af" />
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
                <Bar dataKey="cashback" fill="#ec4899" radius={[8, 8, 0, 0]} />
                <Bar dataKey="xp" fill="#a855f7" radius={[8, 8, 0, 0]} />
                <Bar dataKey="coupons" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Earners Leaderboard */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Top Earners</h2>
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="space-y-4">
              {topEarners.map((earner) => (
                <div key={earner.rank} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${
                      earner.rank === 1 ? 'text-yellow-400' :
                      earner.rank === 2 ? 'text-gray-300' :
                      earner.rank === 3 ? 'text-amber-600' :
                      'text-gray-500'
                    }`}>
                      #{earner.rank}
                    </span>
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{earner.avatar}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{earner.name}</p>
                    <p className="text-gray-400 text-xs">{earner.level} • {earner.xp} XP</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold text-sm">{earner.earned}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              Active Reward Campaigns
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Campaign</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Budget</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Spent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Participants</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">End Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-white/5 transition-all">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{campaign.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-medium">
                        {campaign.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{campaign.budget}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-cyan-400 font-medium">{campaign.spent}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{campaign.participants.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-400">{campaign.endDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        {campaign.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              Recent Reward Transactions
            </h2>
          </div>
          <div className="divide-y divide-white/5">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-white/5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      transaction.type === 'cashback' ? 'bg-green-500/10 border border-green-500/30' :
                      transaction.type === 'xp' ? 'bg-purple-500/10 border border-purple-500/30' :
                      'bg-blue-500/10 border border-blue-500/30'
                    }`}>
                      {transaction.type === 'cashback' && <DollarSign className="w-5 h-5 text-green-400" />}
                      {transaction.type === 'xp' && <Zap className="w-5 h-5 text-purple-400" />}
                      {transaction.type === 'coupon' && <Gift className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.user}</p>
                      <p className="text-gray-400 text-sm">{transaction.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-white font-bold">{transaction.amount}</p>
                      <p className="text-gray-500 text-xs">{transaction.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {transaction.status === 'completed' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                      {transaction.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                      {transaction.status === 'rejected' && <XCircle className="w-3 h-3 inline mr-1" />}
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
