import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, Users, UserCheck, MessageSquare, Brain,
  Gift, CreditCard, FileText, Bell, Settings, LogOut,
  Search, Menu, X, Sun, Moon, Activity, Server, Zap, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.email !== 'respectkills@gmail.com')) {
      const timer = setTimeout(() => {
        navigate('/home');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
        <div className="w-12 h-12 border-4 border-dashed border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-cyan-400 font-medium tracking-wide">Verifying credentials...</p>
      </div>
    );
  }

  if (!user || user.email !== 'respectkills@gmail.com') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-red-500/10 blur-3xl rounded-full" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-2xl font-bold mb-4 border border-red-500/30 animate-pulse">
            ✕
          </div>
          <h2 className="text-2xl font-black text-red-400 tracking-tight">Access Denied</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mt-2">
            Only <span className="text-cyan-400 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10 select-all">respectkills@gmail.com</span> is authorized to access the Admin Panel.
          </p>
          <p className="text-[11px] text-slate-500 mt-4 font-mono">Redirecting you to home page in 3 seconds...</p>
          <button
            onClick={() => navigate('/home')}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-lg shadow-red-600/20 active:scale-95"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/contributors', icon: UserCheck, label: 'Contributors' },
    { path: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
    { path: '/admin/ai-moderation', icon: Brain, label: 'AI Moderation' },
    { path: '/admin/rewards', icon: Gift, label: 'Rewards' },
    { path: '/admin/transactions', icon: CreditCard, label: 'Transactions' },
    { path: '/admin/analytics', icon: FileText, label: 'Reports' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const notifications = [
    { id: 1, text: 'New suspicious review detected', type: 'warning', time: '2m ago' },
    { id: 2, text: '5 new contributors pending approval', type: 'info', time: '15m ago' },
    { id: 3, text: 'AI model updated successfully', type: 'success', time: '1h ago' },
    { id: 4, text: 'High fraud probability detected', type: 'danger', time: '2h ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed left-0 top-0 h-screen w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 z-50"
          >
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">LOCALZ.COM</h1>
                  <p className="text-xs text-cyan-400">AI Admin Panel</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="ml-auto w-2 h-2 bg-cyan-400 rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-slate-900/80 backdrop-blur-xl">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-slate-900/50 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6 text-gray-400" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-400" />
                )}
              </button>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search users, reviews, transactions..."
                  className="w-96 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* AI Status */}
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 font-medium">AI Active</span>
              </div>

              {/* Server Status */}
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Server className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400 font-medium">99.9%</span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-14 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-white font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-4 border-b border-white/5 hover:bg-white/5 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notif.type === 'warning' ? 'bg-yellow-400' :
                              notif.type === 'danger' ? 'bg-red-400' :
                              notif.type === 'success' ? 'bg-green-400' :
                              'bg-blue-400'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm text-white">{notif.text}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Admin Profile */}
              <div className="flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AD</span>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Admin</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
