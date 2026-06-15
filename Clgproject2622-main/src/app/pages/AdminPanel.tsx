import { useState } from 'react';
import { motion } from 'motion/react';
import { Database, Zap, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { seedDemoData, clearDemoData } from '../../utils/seedDemoData';
import { callServer } from '../../utils/supabase/client';

export default function AdminPanel() {
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [testResult, setTestResult] = useState<any>(null);

  const handleSeedData = async () => {
    setSeeding(true);
    setMessage(null);
    try {
      const result = await seedDemoData();
      if (result.success) {
        setMessage({ type: 'success', text: 'Demo data seeded successfully! 🎉' });
      } else {
        setMessage({ type: 'error', text: 'Failed to seed demo data. Check console for details.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSeeding(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to clear demo data?')) return;

    setClearing(true);
    setMessage(null);
    try {
      await clearDemoData();
      setMessage({ type: 'success', text: 'Demo data cleared! Visit Supabase dashboard for manual cleanup.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setClearing(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    setMessage(null);
    try {
      const health = await callServer('/health');
      const userStats = await callServer('/users/demo-user-123/stats');

      setTestResult({
        health,
        userStats,
      });
      setMessage({ type: 'success', text: 'Backend connection successful! ✅' });
    } catch (error: any) {
      setMessage({ type: 'error', text: `Connection failed: ${error.message}` });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Supabase Admin Panel
          </h1>
          <p className="text-xl text-gray-400">
            Manage backend data and test Supabase integration
          </p>
        </motion.div>

        {/* Message Display */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-xl border-2 ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/50 text-green-400'
                : 'bg-red-500/10 border-red-500/50 text-red-400'
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === 'success' ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
              <p className="font-semibold">{message.text}</p>
            </div>
          </motion.div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Seed Data */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl"
          >
            <div className="w-16 h-16 mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Seed Demo Data</h3>
            <p className="text-gray-400 text-sm mb-4">
              Populate the backend with sample users, places, verifications, and rewards.
            </p>
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {seeding ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Seed Data
                </>
              )}
            </button>
          </motion.div>

          {/* Test Connection */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl"
          >
            <div className="w-16 h-16 mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Test Connection</h3>
            <p className="text-gray-400 text-sm mb-4">
              Verify backend API connectivity and fetch sample data.
            </p>
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {testing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Test Backend
                </>
              )}
            </button>
          </motion.div>

          {/* Clear Data */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl"
          >
            <div className="w-16 h-16 mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Trash2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Clear Data</h3>
            <p className="text-gray-400 text-sm mb-4">
              Remove demo data from the backend database.
            </p>
            <button
              onClick={handleClearData}
              disabled={clearing}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {clearing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Clear Data
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Test Results */}
        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl"
          >
            <h3 className="text-2xl font-black text-white mb-4">Test Results</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-400 mb-2">Health Check:</p>
                <pre className="bg-gray-900 p-4 rounded-xl text-green-400 text-sm overflow-x-auto">
                  {JSON.stringify(testResult.health, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400 mb-2">User Stats:</p>
                <pre className="bg-gray-900 p-4 rounded-xl text-blue-400 text-sm overflow-x-auto">
                  {JSON.stringify(testResult.userStats, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>
        )}

        {/* Documentation Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/30"
        >
          <h3 className="text-xl font-black text-white mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors"
            >
              <Database className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-bold text-white">Supabase Dashboard</p>
                <p className="text-xs text-gray-400">View database tables</p>
              </div>
            </a>
            <a
              href="https://zbefuotnmdvbqietdhhf.supabase.co/functions/v1/make-server-5bf721dd/health"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-bold text-white">API Health Check</p>
                <p className="text-xs text-gray-400">Test backend endpoint</p>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
