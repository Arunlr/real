import { AdminLayout } from '../components/admin/AdminLayout';
import {
  Brain, Shield, AlertTriangle, CheckCircle, XCircle, Eye,
  Zap, Target, TrendingUp, Activity, FileText, Users, MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export function AIModerationPanel() {
  const [selectedTab, setSelectedTab] = useState<'suspicious' | 'spam' | 'fraud' | 'duplicates'>('suspicious');

  // Suspicious Reviews
  const suspiciousReviews = [
    {
      id: 1,
      user: 'Rajesh Kumar',
      place: 'Hotel Paradise Inn',
      review: 'Best hotel ever! Amazing service! Highly recommend! 5 stars!',
      aiScore: 78,
      reason: 'Excessive positivity, generic phrases, no specific details',
      confidence: 85,
      trustScore: 42,
      timestamp: '2 mins ago',
      status: 'pending'
    },
    {
      id: 2,
      user: 'Priya Singh',
      place: 'City Gym & Fitness',
      review: 'Worst experience. Never go here. Complete waste of money.',
      aiScore: 82,
      reason: 'Excessive negativity, no constructive feedback, potential competitor attack',
      confidence: 91,
      trustScore: 38,
      timestamp: '15 mins ago',
      status: 'pending'
    },
    {
      id: 3,
      user: 'Amit Verma',
      place: 'Spice Garden Restaurant',
      review: 'Good food good ambience good service everything is good',
      aiScore: 71,
      reason: 'Repetitive language, lacks authenticity',
      confidence: 76,
      trustScore: 51,
      timestamp: '28 mins ago',
      status: 'pending'
    },
    {
      id: 4,
      user: 'Sneha Patel',
      place: 'Tech Hub Co-working',
      review: 'This place changed my life! Best decision ever! You must visit! Amazing!',
      aiScore: 88,
      reason: 'Overly promotional, bot-like language pattern',
      confidence: 94,
      trustScore: 29,
      timestamp: '45 mins ago',
      status: 'pending'
    },
  ];

  // Spam Detection Stats
  const spamStats = [
    { label: 'Spam Detected Today', value: '47', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
    { label: 'Blocked IPs', value: '23', color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30' },
    { label: 'Duplicate Content', value: '31', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' },
    { label: 'Bot Attempts', value: '12', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
  ];

  // AI Model Stats
  const aiModelStats = [
    { metric: 'Detection Accuracy', value: '96.8%', status: 'excellent', icon: Target },
    { metric: 'False Positive Rate', value: '2.1%', status: 'good', icon: Shield },
    { metric: 'Processing Speed', value: '0.3s', status: 'excellent', icon: Zap },
    { metric: 'Model Confidence', value: '94.2%', status: 'excellent', icon: Brain },
  ];

  // Auto-Moderation Logs
  const moderationLogs = [
    { id: 1, action: 'Auto-rejected', reason: 'Spam detected (98.7% confidence)', time: '3 mins ago', type: 'auto' },
    { id: 2, action: 'Flagged for review', reason: 'Suspicious pattern detected', time: '8 mins ago', type: 'flag' },
    { id: 3, action: 'Auto-approved', reason: 'High trust score (92%)', time: '12 mins ago', type: 'auto' },
    { id: 4, action: 'Duplicate blocked', reason: 'Same content posted 3 times', time: '18 mins ago', type: 'auto' },
    { id: 5, action: 'IP banned', reason: 'Multiple spam attempts', time: '25 mins ago', type: 'ban' },
  ];

  const handleReviewAction = (reviewId: number, action: 'approve' | 'reject') => {
    console.log(`Review ${reviewId} ${action}ed`);
    // Handle review action
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Brain className="w-8 h-8 text-cyan-400" />
              AI Moderation Panel
            </h1>
            <p className="text-gray-400 mt-1">Automated fraud detection and content moderation</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <span className="text-sm text-green-400 font-medium">AI Model: Active</span>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              Configure AI Settings
            </button>
          </div>
        </div>

        {/* AI Model Performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {aiModelStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.metric}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-6 h-6 text-cyan-400" />
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    stat.status === 'excellent' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {stat.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.metric}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Spam Detection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {spamStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`bg-slate-900/50 backdrop-blur-xl border ${stat.borderColor} rounded-2xl p-6`}
            >
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-2">
          {[
            { id: 'suspicious', label: 'Suspicious Reviews', icon: AlertTriangle },
            { id: 'spam', label: 'Spam Detection', icon: Shield },
            { id: 'fraud', label: 'Fraud Probability', icon: XCircle },
            { id: 'duplicates', label: 'Duplicates', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  selectedTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Suspicious Reviews List */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              Suspicious Reviews Detected
            </h2>
            <p className="text-gray-400 text-sm mt-1">AI-flagged content requiring manual review</p>
          </div>

          <div className="divide-y divide-white/5">
            {suspiciousReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-white/5 transition-all"
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {review.user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{review.user}</p>
                        <p className="text-gray-400 text-sm">{review.place}</p>
                      </div>
                      <span className="text-xs text-gray-500">{review.timestamp}</span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-3">
                      <p className="text-gray-300 text-sm">{review.review}</p>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-400 font-medium text-sm mb-1">AI Detection Reason:</p>
                          <p className="text-red-300 text-sm">{review.reason}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Scores */}
                  <div className="w-80 space-y-4">
                    {/* Fraud Score */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Fraud Probability</span>
                        <span className="text-red-400 font-bold">{review.aiScore}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${review.aiScore}%` }}
                        />
                      </div>
                    </div>

                    {/* AI Confidence */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">AI Confidence</span>
                        <span className="text-cyan-400 font-bold">{review.confidence}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${review.confidence}%` }}
                        />
                      </div>
                    </div>

                    {/* Trust Score */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">User Trust Score</span>
                        <span className={`font-bold ${
                          review.trustScore > 70 ? 'text-green-400' :
                          review.trustScore > 50 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {review.trustScore}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            review.trustScore > 70 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            review.trustScore > 50 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                            'bg-gradient-to-r from-red-500 to-orange-500'
                          }`}
                          style={{ width: `${review.trustScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReviewAction(review.id, 'approve')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReviewAction(review.id, 'reject')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Auto-Moderation Logs */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-400" />
              Auto-Moderation Logs
            </h2>
            <button className="text-sm text-cyan-400 hover:text-cyan-300">View All Logs</button>
          </div>
          <div className="space-y-3">
            {moderationLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                <div className={`w-2 h-2 rounded-full ${
                  log.type === 'auto' ? 'bg-blue-400' :
                  log.type === 'flag' ? 'bg-yellow-400' :
                  'bg-red-400'
                }`} />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{log.action}</p>
                  <p className="text-gray-400 text-xs mt-1">{log.reason}</p>
                </div>
                <span className="text-gray-500 text-xs">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
