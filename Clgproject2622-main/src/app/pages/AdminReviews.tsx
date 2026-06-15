import { AdminLayout } from '../components/admin/AdminLayout';
import {
  MessageSquare, Search, Star, Shield, CheckCircle, XCircle, AlertTriangle,
  Locate, MapPin, Eye, Trash2, ShieldAlert, BadgeCheck, Check, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface ReviewItem {
  id: number;
  userName: string;
  userEmail: string;
  userAvatar: string;
  placeName: string;
  placeType: string;
  city: string;
  reviewText: string;
  rating: number;
  status: 'verified' | 'pending' | 'flagged';
  gps: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  hasPhoto: boolean;
  photoUrl: string;
  date: string;
  trustScore: number;
}

const initialReviews: ReviewItem[] = [
  {
    id: 1,
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh.k@gmail.com',
    userAvatar: 'RK',
    placeName: 'Royal Orchid Resort & Spa',
    placeType: 'Hotel',
    city: 'Bangalore',
    reviewText: 'I physically visited this resort. This hotel is absolutely exceptional and fully verified! The infrastructure is in perfect condition, safety and hygiene standards overall are extremely high, and the ambiance is very welcoming. Highly recommended for anyone seeking trustworthy local services!',
    rating: 5,
    status: 'verified',
    gps: { latitude: 12.9716, longitude: 77.5946, accuracy: 10 },
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60',
    date: '2026-06-12',
    trustScore: 98
  },
  {
    id: 2,
    userName: 'Sneha Patel',
    userEmail: 'sneha.p@yahoo.com',
    userAvatar: 'SP',
    placeName: 'Gold Gym Elite',
    placeType: 'Gym',
    city: 'Mumbai',
    reviewText: 'Excellent equipment, fully clean and sanitized sanitization bays. Verified latitude and longitude match listing description perfectly. The trainers are certified and very helpful.',
    rating: 4,
    status: 'pending',
    gps: { latitude: 19.0760, longitude: 72.8777, accuracy: 15 },
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60',
    date: '2026-06-13',
    trustScore: 82
  },
  {
    id: 3,
    userName: 'Amit Singh',
    userEmail: 'amit.singh@outlook.com',
    userAvatar: 'AS',
    placeName: 'Starlight Ladies PG',
    placeType: 'PG/Hostel',
    city: 'Bangalore',
    reviewText: 'Highly secure environment with 24/7 CCTV surveillance. The rooms are clean but somewhat tight. High speed fiber internet verified (95 Mbps). Geolocation accuracy verified on terminal.',
    rating: 4,
    status: 'verified',
    gps: { latitude: 12.9345, longitude: 77.6101, accuracy: 8 },
    hasPhoto: false,
    photoUrl: '',
    date: '2026-06-10',
    trustScore: 91
  },
  {
    id: 4,
    userName: 'Vikas Gupta',
    userEmail: 'vikas.g@gmail.com',
    userAvatar: 'VG',
    placeName: 'Spice Garden Dhaba',
    placeType: 'Restaurant',
    city: 'Pune',
    reviewText: 'Awesome butter chicken! Great hygiene standards! Buy 1 get 1 free! Best deal ever! Click this link to redeem coupon!!!',
    rating: 5,
    status: 'flagged',
    gps: { latitude: 18.5204, longitude: 73.8567, accuracy: 125 },
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60',
    date: '2026-06-11',
    trustScore: 34
  },
  {
    id: 5,
    userName: 'Anjali Sharma',
    userEmail: 'anjali.s@gmail.com',
    userAvatar: 'AS',
    placeName: 'Little Flowers Nursery School',
    placeType: 'School',
    city: 'Chennai',
    reviewText: 'Very friendly teaching staff and secure campus borders. Highly recommended for kids starting pre-primary education. Clean play area and drinking water stations.',
    rating: 5,
    status: 'pending',
    gps: { latitude: 13.0827, longitude: 80.2707, accuracy: 12 },
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&auto=format&fit=crop&q=60',
    date: '2026-06-13',
    trustScore: 89
  }
];

const statusColors: Record<string, string> = {
  verified: 'text-green-400 bg-green-400/10 border-green-500/30',
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/30',
  flagged: 'text-red-400 bg-red-400/10 border-red-500/30',
};

const typeIcons: Record<string, string> = {
  Hotel: '🏨',
  Gym: '💪',
  'PG/Hostel': '🏢',
  Restaurant: '🍽️',
  School: '🏫',
};

export function AdminReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'flagged'>('all');
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = (id: number, newStatus: 'verified' | 'pending' | 'flagged') => {
    setReviews(prev =>
      prev.map(r => r.id === id ? { ...r, status: newStatus, trustScore: newStatus === 'verified' ? Math.max(90, r.trustScore) : newStatus === 'flagged' ? Math.min(40, r.trustScore) : r.trustScore } : r)
    );
    if (selectedReview?.id === id) {
      setSelectedReview(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Review #${id} status updated to ${newStatus}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(`Are you sure you want to delete review #${id}?`)) {
      setReviews(prev => prev.filter(r => r.id !== id));
      if (selectedReview?.id === id) {
        setSelectedReview(null);
      }
      showToast(`Review #${id} deleted successfully`);
    }
  };

  const filtered = reviews.filter(r => {
    const matchSearch =
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.placeName.toLowerCase().includes(search.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase()) ||
      r.placeType.toLowerCase().includes(search.toLowerCase());
    
    const matchFilter = filter === 'all' || r.status === filter;
    return matchSearch && matchFilter;
  });

  const totalReviews = reviews.length;
  const verifiedCount = reviews.filter(r => r.status === 'verified').length;
  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const flaggedCount = reviews.filter(r => r.status === 'flagged').length;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Toast Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed top-24 right-6 z-50 px-6 py-3 bg-cyan-900 border border-cyan-500 text-cyan-200 rounded-xl shadow-2xl flex items-center gap-3 font-semibold backdrop-blur-md"
            >
              <Check className="w-5 h-5 text-cyan-400" />
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-cyan-400" />
              Reviews Moderation
            </h1>
            <p className="text-gray-400 mt-1">Audit guest reviews, check physical metadata, and control platform content quality.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 border border-white/10 rounded-2xl p-5"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-black text-white">{totalReviews}</p>
            <p className="text-sm text-gray-400 mt-1">Total Audited Reviews</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-slate-900/40 border border-white/10 rounded-2xl p-5"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-3">
              <BadgeCheck className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-black text-green-400">{verifiedCount}</p>
            <p className="text-sm text-gray-400 mt-1">Verified (GPS Coords)</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/40 border border-white/10 rounded-2xl p-5"
          >
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-black text-yellow-400">{pendingCount}</p>
            <p className="text-sm text-gray-400 mt-1">Pending Inspection</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-900/40 border border-white/10 rounded-2xl p-5"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-3xl font-black text-red-400">{flaggedCount}</p>
            <p className="text-sm text-gray-400 mt-1">Flagged / Spam Cases</p>
          </motion.div>
        </div>

        {/* Actions & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by spot, city, user, text..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900/40 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {(['all', 'verified', 'pending', 'flagged'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize border flex-shrink-0 cursor-pointer ${
                  filter === tab
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                    : 'bg-slate-900/30 text-gray-400 border-white/10 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Reviews Table/Grid */}
          <div className={`${selectedReview ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-300 space-y-4`}>
            <div className="bg-slate-900/30 border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-900/40">
                      <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Spot / Type</th>
                      <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Contributor</th>
                      <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                      <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Trust Score</th>
                      <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-gray-500 text-sm">
                          No reviews found matching the selected parameters.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item, idx) => (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedReview(item)}
                          className={`hover:bg-white/5 transition-colors cursor-pointer ${
                            selectedReview?.id === item.id ? 'bg-white/5 border-l-4 border-l-cyan-500' : ''
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-start gap-2.5">
                              <span className="text-xl" title={item.placeType}>
                                {typeIcons[item.placeType] || '📍'}
                              </span>
                              <div>
                                <h4 className="text-white font-semibold text-sm line-clamp-1">{item.placeName}</h4>
                                <span className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3" />
                                  {item.city}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white text-xs font-black">
                                {item.userAvatar}
                              </div>
                              <div>
                                <p className="text-white text-xs font-medium line-clamp-1">{item.userName}</p>
                                <p className="text-gray-500 text-[10px] line-clamp-1">{item.userEmail}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className={`text-sm font-bold ${
                              item.trustScore >= 90 ? 'text-emerald-400' :
                              item.trustScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {item.trustScore}%
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[item.status]}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedReview(item)}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.id, 'verified')}
                                disabled={item.status === 'verified'}
                                className="p-1.5 hover:bg-green-500/10 rounded-lg text-gray-500 hover:text-green-400 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                                title="Approve Review"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.id, 'flagged')}
                                disabled={item.status === 'flagged'}
                                className="p-1.5 hover:bg-orange-500/10 rounded-lg text-gray-500 hover:text-orange-400 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                                title="Flag / Mark Suspect"
                              >
                                <AlertTriangle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-all cursor-pointer"
                                title="Delete Permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Side Inspection Drawer / Detail Card */}
          <AnimatePresence>
            {selectedReview && (
              <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                className="lg:col-span-5 bg-slate-900/55 border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-xl relative"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Verification Inspector</h3>
                    <p className="text-xs text-gray-400">Review metadata & secure photos</p>
                  </div>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all cursor-pointer"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Review Source Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-base font-black">
                    {selectedReview.userAvatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{selectedReview.userName}</p>
                    <p className="text-xs text-gray-400">{selectedReview.userEmail}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      Submitted on {selectedReview.date}
                    </div>
                  </div>
                </div>

                {/* Space Details */}
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Target Place</span>
                    <span className="text-xs font-semibold text-cyan-400 px-2 py-0.5 bg-cyan-400/10 rounded-md">
                      {selectedReview.placeType}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-base">{selectedReview.placeName}</h4>
                  <p className="text-xs text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    {selectedReview.city} (India)
                  </p>
                </div>

                {/* The Review Comment Content */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Review Content</label>
                  <p className="text-sm text-gray-100 bg-black/30 rounded-xl p-4 border border-white/5 leading-relaxed italic">
                    "{selectedReview.reviewText}"
                  </p>
                </div>

                {/* Photo Evidence & Camera Details */}
                {selectedReview.hasPhoto ? (
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Photo Evidence</label>
                    <div className="relative rounded-xl overflow-hidden border border-white/10 group aspect-video">
                      <img
                        src={selectedReview.photoUrl}
                        alt="Location verification"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-white font-medium text-xs">Uploaded with camera model verifier v2.4</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-dashed border-white/10 text-gray-500 text-xs">
                    No photo uploaded with this review.
                  </div>
                )}

                {/* Geolocation Hardware Check */}
                <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5 space-y-3.5">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <Locate className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">GPS Hardware Verification</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500">Latitude</p>
                      <p className="text-white font-mono font-medium mt-0.5">{selectedReview.gps.latitude.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Longitude</p>
                      <p className="text-white font-mono font-medium mt-0.5">{selectedReview.gps.longitude.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Accuracy Margin</p>
                      <p className={`font-mono font-bold mt-0.5 ${
                        selectedReview.gps.accuracy <= 15 ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        ± {selectedReview.gps.accuracy} meters
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Trust Coefficient</p>
                      <p className={`font-bold mt-0.5 ${
                        selectedReview.trustScore >= 80 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedReview.trustScore >= 80 ? 'HIGH' : 'LOW (FLAGGED)'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions inside inspector */}
                <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                  <button
                    onClick={() => handleStatusChange(selectedReview.id, 'verified')}
                    className="flex flex-col items-center gap-1.5 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 border border-green-500/20 rounded-xl transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Approve</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedReview.id, 'flagged')}
                    className="flex flex-col items-center gap-1.5 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 border border-orange-500/20 rounded-xl transition-all cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Flag/Spam</span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedReview.id)}
                    className="flex flex-col items-center gap-1.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Delete</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
