import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy, Star, Zap, TrendingUp, Award, Shield, Target, Coins,
  Gift, CreditCard, Ticket, Wallet, Crown, Sparkles, ChevronRight,
  MapPin, Clock, Users, Flame, Brain, Eye, Lock, Unlock,
  BarChart3, Activity, CheckCircle, AlertCircle, Radio,
  Rocket, Globe, Smartphone, Database, FileCheck, Building2, ArrowLeft, Home
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { useUserStats } from '../../hooks/useSupabase';

interface Level {
  id: number;
  name: string;
  icon: any;
  verifications: string;
  xpRange: string;
  rewards: string[];
  earning: string;
  gradient: string;
  borderGlow: string;
  bgGlow: string;
}

interface RewardType {
  id: string;
  name: string;
  icon: any;
  description: string;
  gradient: string;
  count: number;
}

interface Task {
  id: string;
  location: string;
  reward: number;
  urgency: number;
  time: string;
  difficulty: string;
  type: string;
  gradient: string;
}

export default function RewardsLevelsDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading: statsLoading, error: statsError, updateStats } = useUserStats(user?.id || null);

  // Initialize default stats if backend returns empty
  useEffect(() => {
    if (!statsLoading && stats && Object.keys(stats).length === 0) {
      // Set initial demo stats
      updateStats({
        level: 2,
        xp: 450,
        trustScore: 87,
        totalEarnings: 12450,
        monthlyEarnings: 3200,
        verificationCount: 8,
        streak: 12
      });
    }
  }, [statsLoading, stats]);

  // Use stats from backend or defaults
  const currentLevel = stats?.level || 2;
  const xp = stats?.xp || 450;
  const trustScore = stats?.trustScore || 87;
  const totalEarnings = stats?.totalEarnings || 12450;
  const monthlyEarnings = stats?.monthlyEarnings || 3200;
  const verificationCount = stats?.verificationCount || 8;
  const streak = stats?.streak || 12;

  const levels: Level[] = [
    {
      id: 1,
      name: 'Bronze Local',
      icon: Award,
      verifications: '1-5 verifications',
      xpRange: '0 - 500 XP',
      rewards: ['Small cashback', 'App coins', 'Referral bonuses', 'Basic tasks'],
      earning: '₹500 - ₹2,000/month',
      gradient: 'from-amber-700 via-amber-600 to-amber-500',
      borderGlow: 'shadow-amber-500/50',
      bgGlow: 'bg-amber-500/10'
    },
    {
      id: 2,
      name: 'Silver Local',
      icon: Star,
      verifications: '5-10 verifications',
      xpRange: '500 - 1,500 XP',
      rewards: ['Gift coupons', 'Food delivery discounts', 'Bonus XP', 'Priority tasks'],
      earning: '₹2,000 - ₹5,000/month',
      gradient: 'from-gray-400 via-gray-300 to-gray-200',
      borderGlow: 'shadow-gray-400/50',
      bgGlow: 'bg-gray-400/10'
    },
    {
      id: 3,
      name: 'Gold Local',
      icon: Trophy,
      verifications: '10-30 verifications',
      xpRange: '1,500 - 5,000 XP',
      rewards: ['Gift cards', 'Travel coupons', 'Monthly bonuses', 'Premium tasks'],
      earning: '₹5,000 - ₹15,000/month',
      gradient: 'from-yellow-500 via-yellow-400 to-amber-300',
      borderGlow: 'shadow-yellow-400/50',
      bgGlow: 'bg-yellow-400/10'
    },
    {
      id: 4,
      name: 'Platinum Local',
      icon: Zap,
      verifications: '30-75 verifications',
      xpRange: '5,000 - 15,000 XP',
      rewards: ['Direct bank payouts', 'OTT subscriptions', 'Sponsored tasks', 'VIP status'],
      earning: '₹15,000 - ₹40,000/month',
      gradient: 'from-cyan-400 via-blue-400 to-indigo-400',
      borderGlow: 'shadow-blue-400/50',
      bgGlow: 'bg-blue-400/10'
    },
    {
      id: 5,
      name: 'Diamond Local',
      icon: Sparkles,
      verifications: '75-150 verifications',
      xpRange: '15,000 - 30,000 XP',
      rewards: ['Revenue sharing', 'Business verification contracts', 'Ambassador role', 'Elite access'],
      earning: '₹40,000 - ₹100,000/month',
      gradient: 'from-purple-400 via-pink-400 to-rose-400',
      borderGlow: 'shadow-purple-400/50',
      bgGlow: 'bg-purple-400/10'
    },
    {
      id: 6,
      name: 'Legend Verifier',
      icon: Crown,
      verifications: '150+ verifications',
      xpRange: '30,000+ XP',
      rewards: ['Professional paid jobs', 'Salary-style payouts', 'Government projects', 'Enterprise contracts'],
      earning: '₹100,000+/month',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      borderGlow: 'shadow-red-500/50',
      bgGlow: 'bg-red-500/10'
    }
  ];

  const rewardTypes: RewardType[] = [
    { id: '1', name: 'Cashback', icon: Wallet, description: 'Instant cashback rewards', gradient: 'from-green-500 to-emerald-500', count: 24 },
    { id: '2', name: 'Gift Cards', icon: Gift, description: 'Amazon, Flipkart & more', gradient: 'from-blue-500 to-cyan-500', count: 12 },
    { id: '3', name: 'Coupons', icon: Ticket, description: 'Food, travel, shopping', gradient: 'from-orange-500 to-amber-500', count: 18 },
    { id: '4', name: 'Coins', icon: Coins, description: 'Platform currency', gradient: 'from-yellow-500 to-amber-400', count: 1250 },
    { id: '5', name: 'Real Cash', icon: CreditCard, description: 'Bank transfer payouts', gradient: 'from-purple-500 to-pink-500', count: 8 },
    { id: '6', name: 'Premium Access', icon: Crown, description: 'VIP features unlocked', gradient: 'from-indigo-500 to-blue-500', count: 3 },
    { id: '7', name: 'Sponsored Tasks', icon: Zap, description: 'High-value assignments', gradient: 'from-red-500 to-orange-500', count: 5 },
    { id: '8', name: 'Revenue Sharing', icon: TrendingUp, description: 'Ongoing passive income', gradient: 'from-teal-500 to-cyan-500', count: 2 }
  ];

  const tasks: Task[] = [
    { id: '1', location: 'Hotel Prestige, Indiranagar', reward: 500, urgency: 2, time: '45 min', difficulty: 'Medium', type: 'Emergency', gradient: 'from-red-500 to-orange-500' },
    { id: '2', location: 'PG near Koramangala', reward: 300, urgency: 1, time: '30 min', difficulty: 'Easy', type: 'Standard', gradient: 'from-blue-500 to-cyan-500' },
    { id: '3', location: 'Restaurant - HSR Layout', reward: 800, urgency: 3, time: '60 min', difficulty: 'Hard', type: 'Elite Platinum', gradient: 'from-purple-500 to-pink-500' },
    { id: '4', location: 'Government School Verification', reward: 1200, urgency: 2, time: '90 min', difficulty: 'Expert', type: 'Government', gradient: 'from-green-500 to-emerald-500' }
  ];

  const leaderboard = [
    { rank: 1, name: 'Priya Sharma', earnings: 45200, xp: 12400, verifications: 156, avatar: '👩', badge: '🏆' },
    { rank: 2, name: 'Raj Kumar', earnings: 38900, xp: 10800, verifications: 142, avatar: '👨', badge: '🥈' },
    { rank: 3, name: 'Ananya Reddy', earnings: 34100, xp: 9200, verifications: 128, avatar: '👩', badge: '🥉' },
    { rank: 4, name: 'Vikram Singh', earnings: 29600, xp: 8100, verifications: 115, avatar: '👨', badge: '⭐' },
    { rank: 5, name: 'Neha Gupta', earnings: 25300, xp: 7400, verifications: 98, avatar: '👩', badge: '⭐' }
  ];

  // Show loading state
  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl">Loading your rewards...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (statsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <Navbar />
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white text-xl mb-2">Unable to load rewards data</p>
          <p className="text-gray-400 text-sm mb-4">{statsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      <Navbar />

      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          style={{ bottom: '10%', right: '10%' }}
        />

        {/* Floating Particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full"
            animate={{
              y: [0, -1000],
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-28 pb-12">
        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-start"
        >
          <motion.button
            onClick={() => navigate('/home')}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 bg-gradient-to-r from-gray-800/90 to-gray-900/90 hover:from-gray-700/90 hover:to-gray-800/90 text-white font-bold rounded-2xl border-2 border-yellow-500/20 hover:border-yellow-500/40 flex items-center gap-2 cursor-pointer shadow-xl backdrop-blur-md group transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-yellow-400 group-hover:-translate-x-1.5 transition-transform duration-300" />
            <span className="tracking-wide">Back to Home Page</span>
          </motion.button>
        </motion.div>

        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/50">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Earn Rewards by Verifying the Real World
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Complete verification tasks, increase your trust score, unlock elite levels, and earn real income.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* XP Progress */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <span className="text-sm text-gray-400">Level {currentLevel}</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">XP Progress</span>
                    <span className="text-yellow-400 font-bold">{xp}/1500</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${(xp / 1500) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                <p className="text-2xl font-black text-white">{xp} XP</p>
              </div>
            </motion.div>

            {/* Trust Score */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="w-8 h-8 text-green-400" />
                  <span className="text-sm text-green-400">Excellent</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">Trust Score</p>
                <p className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{trustScore}%</p>
              </div>
            </motion.div>

            {/* Monthly Earnings */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Wallet className="w-8 h-8 text-purple-400" />
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-sm text-gray-400 mb-2">This Month</p>
                <p className="text-3xl font-black text-white">₹{monthlyEarnings.toLocaleString()}</p>
              </div>
            </motion.div>

            {/* Streak Counter */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Flame className="w-8 h-8 text-orange-400" />
                  <span className="text-sm text-orange-400">🔥 Hot!</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">Verification Streak</p>
                <p className="text-4xl font-black text-white">{streak} days</p>
              </div>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <motion.button
              onClick={() => {
                const element = document.getElementById('available-tasks');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/verifier/dashboard');
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-2xl shadow-orange-500/50 flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-5 h-5" />
              Start Verification
              <ChevronRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => {
                const element = document.getElementById('leaderboard-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-2xl shadow-purple-500/50 flex items-center gap-2 cursor-pointer"
            >
              <Trophy className="w-5 h-5" />
              View Leaderboard
            </motion.button>
          </div>
        </motion.div>

        {/* LEVEL SYSTEM SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Level Progression System
            </h2>
            <p className="text-xl text-gray-400">Unlock premium rewards as you level up</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level, index) => {
              const Icon = level.icon;
              const isCurrentLevel = level.id === currentLevel;

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className={`relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border-2 ${
                    isCurrentLevel ? 'border-yellow-400' : 'border-gray-700/50'
                  } shadow-2xl overflow-hidden group`}
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 ${level.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Badge */}
                  {isCurrentLevel && (
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 bg-yellow-500 text-black text-xs font-black rounded-full">
                        CURRENT
                      </div>
                    </div>
                  )}

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 mb-4 bg-gradient-to-r ${level.gradient} rounded-2xl flex items-center justify-center shadow-2xl ${level.borderGlow}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Level Name */}
                    <h3 className={`text-2xl font-black mb-2 bg-gradient-to-r ${level.gradient} bg-clip-text text-transparent`}>
                      {level.name}
                    </h3>

                    {/* Requirements */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">{level.verifications}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">{level.xpRange}</span>
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2 font-bold">REWARDS:</p>
                      <div className="space-y-1">
                        {level.rewards.map((reward, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-gray-400">{reward}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Earning Potential */}
                    <div className={`mt-4 p-3 bg-gradient-to-r ${level.gradient} bg-opacity-10 rounded-xl border border-gray-700`}>
                      <p className="text-xs text-gray-400 mb-1">Earning Potential</p>
                      <p className="text-lg font-black text-white">{level.earning}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* REWARD TYPES SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Reward Types
            </h2>
            <p className="text-xl text-gray-400">Multiple ways to earn and redeem</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewardTypes.map((reward, index) => {
              const Icon = reward.icon;

              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl overflow-hidden group cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${reward.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className={`w-16 h-16 mb-4 bg-gradient-to-r ${reward.gradient} rounded-2xl flex items-center justify-center shadow-2xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-black text-white mb-2">{reward.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{reward.description}</p>

                    <div className={`inline-block px-4 py-2 bg-gradient-to-r ${reward.gradient} rounded-full`}>
                      <p className="text-white font-bold">{reward.count}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* AI TRUST SCORE ANALYTICS SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              AI Trust Score Analytics
            </h2>
            <p className="text-xl text-gray-400">Your verification quality & reliability metrics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Trust Score Circle */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-64 h-64 mb-6">
                  {/* Circular Progress */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-700"
                    />
                    <motion.circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="url(#trustGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 691 }}
                      animate={{ strokeDashoffset: 691 - (691 * trustScore) / 100 }}
                      transition={{ duration: 2, ease: 'easeOut' }}
                      style={{ strokeDasharray: 691 }}
                    />
                    <defs>
                      <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Shield className="w-12 h-12 text-green-400 mb-2" />
                    <p className="text-6xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {trustScore}
                    </p>
                    <p className="text-sm text-gray-400">Trust Score</p>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">Accuracy Rate</span>
                    </div>
                    <span className="text-white font-bold">94%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">Response Time</span>
                    </div>
                    <span className="text-white font-bold">12 min avg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300">GPS Consistency</span>
                    </div>
                    <span className="text-white font-bold">98%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Analysis Graph */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Weekly Performance</h3>
                  <p className="text-sm text-gray-400">Last 7 days verification quality</p>
                </div>
                <Brain className="w-12 h-12 text-purple-400" />
              </div>

              {/* Simple Bar Chart */}
              <div className="space-y-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const value = [85, 92, 88, 95, 90, 87, 94][i];
                  return (
                    <div key={day} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{day}</span>
                        <span className="text-green-400 font-bold">{value}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Insights */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
                <div className="flex items-start gap-3">
                  <Eye className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-purple-300 mb-1">AI Insight</p>
                    <p className="text-xs text-gray-300">
                      Your verification speed improved 23% this week. Maintain current response time to unlock Platinum tier faster!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* LEADERBOARD SECTION */}
        <motion.div
          id="leaderboard-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Top Verifiers Leaderboard
            </h2>
            <p className="text-xl text-gray-400">Compete with the best and climb the ranks</p>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl"
          >
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className={`flex items-center gap-6 p-6 rounded-2xl transition-all ${
                    user.rank <= 3
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50'
                      : 'bg-gray-800/50 border border-gray-700'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black ${
                    user.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-2xl shadow-yellow-500/50' :
                    user.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900' :
                    user.rank === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {user.badge}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{user.avatar}</span>
                      <div>
                        <h3 className="text-xl font-black text-white">{user.name}</h3>
                        <p className="text-sm text-gray-400">{user.verifications} verifications</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${(user.xp / 15000) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-8 text-right">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">XP</p>
                      <p className="text-xl font-black text-yellow-400">{user.xp.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Earnings</p>
                      <p className="text-xl font-black text-green-400">₹{user.earnings.toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View Full Rankings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              View Full Rankings
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* TASK MARKETPLACE SECTION */}
        <motion.div
          id="available-tasks"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Available Tasks
            </h2>
            <p className="text-xl text-gray-400">Choose tasks near you and start earning now</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl overflow-hidden group cursor-pointer"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${task.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-4 py-2 bg-gradient-to-r ${task.gradient} rounded-full`}>
                      <p className="text-white font-black text-sm">{task.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-white">₹{task.reward}</p>
                      {task.urgency > 1 && (
                        <p className="text-xs text-orange-400 font-bold">{task.urgency}x Urgency Multiplier</p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <p className="text-white font-bold">{task.location}</p>
                  </div>

                  {/* Task Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{task.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{task.difficulty}</span>
                    </div>
                  </div>

                  {/* Accept Button */}
                  <motion.button
                    onClick={() => navigate(`/verifier/task/${task.id}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 bg-gradient-to-r ${task.gradient} text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xl cursor-pointer`}
                  >
                    <Zap className="w-5 h-5" />
                    Accept Task
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Tasks */}
          <div className="text-center mt-8">
            <motion.button
              onClick={() => navigate('/verifier/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-2xl border border-gray-600 flex items-center gap-2 mx-auto cursor-pointer"
            >
              View All Available Tasks
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* FUTURE ECOSYSTEM SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Future Ecosystem
            </h2>
            <p className="text-xl text-gray-400">Upcoming features powered by cutting-edge technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Blockchain Verification */}
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Blockchain Proof</h3>
                <p className="text-sm text-gray-400 mb-3">Immutable verification records stored on-chain</p>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs text-indigo-400 font-bold">Coming Q3 2026</span>
                </div>
              </div>
            </motion.div>

            {/* Deepfake Detection */}
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">AI Deepfake Shield</h3>
                <p className="text-sm text-gray-400 mb-3">Detect and prevent AI-generated fraud</p>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-400 font-bold">Beta Testing</span>
                </div>
              </div>
            </motion.div>

            {/* Real-time Video */}
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Radio className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Live Video Verify</h3>
                <p className="text-sm text-gray-400 mb-3">Real-time video streaming validation</p>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400 font-bold">Alpha Access</span>
                </div>
              </div>
            </motion.div>

            {/* Government Integration */}
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Gov Contracts</h3>
                <p className="text-sm text-gray-400 mb-3">Official government verification partnerships</p>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-blue-400 font-bold">Pilot Program</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Vision Statement */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="mt-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl text-center"
          >
            <Rocket className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h3 className="text-3xl font-black text-white mb-4">Building the World's Most Trusted Verification Network</h3>
            <p className="text-gray-400 max-w-3xl mx-auto mb-6">
              LOCALS.COM is pioneering a decentralized verification ecosystem where human intelligence meets AI precision.
              Our vision: empower millions to earn sustainable income while creating an unbreakable chain of trust for the digital age.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button
                onClick={() => navigate('/home')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold rounded-xl shadow-2xl shadow-orange-500/50 cursor-pointer flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home Page
              </motion.button>
              <motion.button
                onClick={() => navigate('/original')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-2xl shadow-purple-500/50 cursor-pointer flex items-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Learn More
              </motion.button>
              <motion.button
                onClick={() => alert("Successfully joined the LOCALS.COM verification waitlist! You'll be notified when new verification open calls launch in your city.")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-800 border border-gray-600 text-white font-bold rounded-xl cursor-pointer flex items-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                Join Waitlist
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
