import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { 
  Shield, MapPin, Camera, Clock, CheckCircle, XCircle, 
  AlertCircle, TrendingUp, Award, Zap, Star, ChevronLeft,
  DollarSign, Target, Users, Activity, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../utils/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

export function VerifierDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'all'>('pending');
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [remarks, setRemarks] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Fetch verification requests with review details, media, and contributor details
      const { data, error } = await supabase
        .from('verification_requests')
        .select(`
          *,
          review:reviews(
            *,
            review_media(*)
          ),
          profiles!verification_requests_contributor_id_fkey(id, full_name, avatar_url, trust_score)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (e) {
      console.error('Failed to load verification tasks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTasks();
    }
  }, [user?.id]);

  const handleAction = async (task: any, approve: boolean) => {
    if (!remarks.trim()) {
      alert('Please add verifier remarks before submitting.');
      return;
    }
    try {
      setActionLoading(true);
      const newStatus = approve ? 'approved' : 'rejected';
      const requestStatus = 'completed';

      // 1. Update verification_requests row
      const { error: requestErr } = await supabase
        .from('verification_requests')
        .update({
          status: requestStatus,
          remarks: remarks,
          verifier_id: user?.id
        })
        .eq('id', task.id);

      if (requestErr) throw requestErr;

      // 2. Update reviews table status
      const { error: reviewErr } = await supabase
        .from('reviews')
        .update({
          verification_status: newStatus,
          verifier_id: user?.id,
          ai_score: approve ? 99.0 : 45.0
        })
        .eq('id', task.review_id);

      if (reviewErr) throw reviewErr;

      const contributorId = task.contributor_id;

      if (approve) {
        // 3. Award XP & Cashback to contributor
        const { data: contributorProfile } = await supabase
          .from('profiles')
          .select('xp_points, reward_balance')
          .eq('id', contributorId)
          .maybeSingle();

        const currentXp = contributorProfile?.xp_points || 0;
        const currentBalance = Number(contributorProfile?.reward_balance || 0);

        await supabase
          .from('profiles')
          .update({
            xp_points: currentXp + 250,
            reward_balance: currentBalance + 150.00
          })
          .eq('id', contributorId);

        // 4. Generate reward entry
        await supabase
          .from('rewards')
          .insert([{
            user_id: contributorId,
            xp_earned: 250,
            cashback: 150.00,
            reason: `Review for "${task.review.place_name}" approved by verifier during audit.`
          }]);

        // 5. Send notification to contributor
        await supabase
          .from('notifications')
          .insert([{
            user_id: contributorId,
            title: 'Review Audited & Approved! 🏆',
            message: `Your verification submission for "${task.review.place_name}" has been approved. You earned 250 XP and ₹150 Cashback!`,
            is_read: false
          }]);
      } else {
        // 3. Send notification about rejection to contributor
        await supabase
          .from('notifications')
          .insert([{
            user_id: contributorId,
            title: 'Review Rejected ⚠️',
            message: `Your review for "${task.review.place_name}" was rejected during audit. Reason: ${remarks}`,
            is_read: false
          }]);
      }

      // Also award verifier dynamic work credits (e.g., 50 credits to verifier)
      const { data: verifierProfile } = await supabase
        .from('profiles')
        .select('reward_balance')
        .eq('id', user?.id)
        .maybeSingle();
      
      const vBalance = Number(verifierProfile?.reward_balance || 0);
      await supabase
        .from('profiles')
        .update({
          reward_balance: vBalance + 100.00
        })
        .eq('id', user?.id);

      setSuccessMessage(`Submission successfully marked as ${newStatus}!`);
      setRemarks('');
      setSelectedTask(null);
      fetchTasks();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (e: any) {
      console.error('Error executing verifier audit:', e);
      alert(e.message || 'Verification audit failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'pending') return task.status !== 'completed';
    if (activeTab === 'completed') return task.status === 'completed';
    return true;
  });

  const stats = {
    totalAudited: tasks.filter(t => t.status === 'completed').length,
    pendingAudit: tasks.filter(t => t.status !== 'completed').length,
    trustLevel: user?.trust_score ? `${user.trust_score}%` : '100%',
    creditsEarned: user?.reward_balance || 0,
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Navbar />
      
      <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.07)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3">
                <span className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <Shield className="w-8 h-8" />
                </span>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                    Professional Audit Bureau
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">Verify submitted reviews and award network payout tokens</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-xs font-bold text-slate-400">SECURE DATABASE LINKED</span>
            </div>
          </div>

          {/* Success Banner */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 font-bold text-sm shadow-xl"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
              <Clock className="w-6 h-6 text-emerald-400 mb-3" />
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Your Completed Audits</p>
              <h3 className="text-3xl font-black text-white">{stats.totalAudited}</h3>
            </div>
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
              <Activity className="w-6 h-6 text-amber-400 mb-3" />
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Open Audits Remaining</p>
              <h3 className="text-3xl font-black text-white">{stats.pendingAudit}</h3>
            </div>
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
              <Award className="w-6 h-6 text-blue-400 mb-3" />
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Your Reputation trust</p>
              <h3 className="text-3xl font-black text-white">{stats.trustLevel}</h3>
            </div>
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
              <DollarSign className="w-6 h-6 text-teal-400 mb-3" />
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Your Audit Balance</p>
              <h3 className="text-3xl font-black text-white">₹{stats.creditsEarned}</h3>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-2 mb-6 bg-slate-900/30 border border-white/10 rounded-xl p-1.5 self-start max-w-md">
            {(['pending', 'completed', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedTask(null);
                }}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab === 'pending' ? 'Pending Actions' : tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Task List */}
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <div className="flex justify-center py-16">
                  <Activity className="w-10 h-10 animate-spin text-emerald-500" />
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-16 text-center text-slate-400">
                  <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold text-white mb-1">No requests found</h3>
                  <p className="text-sm">There are currently no reviews in this category.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ scale: 1.005 }}
                    onClick={() => {
                      setSelectedTask(task);
                      setRemarks(task.remarks || '');
                    }}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                      selectedTask?.id === task.id
                        ? 'bg-slate-900 border-emerald-500'
                        : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📍</span>
                        <div>
                          <h3 className="text-lg font-bold text-white">{task.review?.place_name}</h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {task.review?.address}
                          </p>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        task.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {task.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 line-clamp-2 mb-4 italic">
                      "{task.review?.description || 'No user review text provided.'}"
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-white/5">
                      <span className="font-bold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                        Submitted By: {task.profiles?.full_name || 'Anonymous Contributor'}
                      </span>
                      <span>{new Date(task.created_at).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Right Side: Detailed Audit Panel */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 h-fit sticky top-6">
              {selectedTask ? (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white">Physical Verification Audit</h2>
                    <p className="text-xs text-slate-400 mt-1">Audit verification request ID: {selectedTask.id}</p>
                  </div>

                  {/* Contributor credentials */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Contributor Profile</h4>
                    <p className="text-sm font-bold text-white">{selectedTask.profiles?.full_name || 'Anonymous User'}</p>
                    <p className="text-xs text-slate-400 mt-1">Trust Score: {selectedTask.profiles?.trust_score || 95}%</p>
                  </div>

                  {/* Review details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Review Submission Details</h4>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Category</span>
                        <span className="font-extrabold uppercase text-indigo-400">{selectedTask.review?.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Rating Provided</span>
                        <span className="font-extrabold text-amber-400">⭐ {selectedTask.review?.rating} / 5</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">AI Trust Score</span>
                        <span className="font-extrabold text-emerald-400">{selectedTask.review?.ai_score}% Genuine</span>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded media files */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Uploaded Media Attachments</h4>
                    {selectedTask.review?.review_media && selectedTask.review.review_media.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {selectedTask.review.review_media.map((media: any) => (
                          <div key={media.id} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                            <img src={media.media_url} alt="Verification" className="w-full h-full object-cover group-hover:scale-105 transition" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No media files attached.</p>
                    )}
                  </div>

                  {/* Audit Actions form */}
                  {selectedTask.status !== 'completed' ? (
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                          Verifier Remarks & Audit Findings
                        </label>
                        <textarea
                          rows={4}
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Provide detailed physical remarks (e.g., Checked reception area, verified cleanliness, confirmed coordinates)"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          disabled={actionLoading}
                          onClick={() => handleAction(selectedTask, true)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve Review
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleAction(selectedTask, false)}
                          className="flex-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject Review
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-white/5 text-center text-xs text-slate-400 bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <p className="font-extrabold text-emerald-400 uppercase tracking-widest mb-1">AUDIT ACTION COMPLETED</p>
                      <p className="mt-1 italic">Remarks: "{selectedTask.remarks}"</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500">
                  <Shield className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm font-semibold">Select an audit request to view coordinates, media, and complete the physical inspection.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
