import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Search, MapPin, Shield, Clock, ArrowRight, Sparkles, Zap, Star, TrendingUp, CheckCircle, Coffee, Pizza, Gift, Percent, Camera, Map } from 'lucide-react';
import { motion } from 'motion/react';

export function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const popularCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'
  ];

  const placeTypes = [
    { icon: '🏨', label: 'Hotels', value: 'hotel' },
    { icon: '🏫', label: 'Schools', value: 'school' },
    { icon: '🏘️', label: 'Neighborhoods', value: 'neighborhood' },
    { icon: '🏢', label: 'PG/Hostels', value: 'pg' },
  ];

  const featuredVerifications = [
    {
      id: 1,
      title: "Sunrise Grand Hotel",
      location: "Indiranagar, Bangalore",
      type: "Hotel",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      rating: 4.9,
      reviews: 128,
      status: "Verified",
      time: "2h ago"
    },
    {
      id: 2,
      title: "FitZone Premium Gym",
      location: "Koramangala, Bangalore",
      type: "Gym",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
      rating: 4.8,
      reviews: 94,
      status: "Verified",
      time: "5h ago"
    },
    {
      id: 3,
      title: "Greenwood Society",
      location: "HSR Layout, Bangalore",
      type: "Neighborhood",
      image: "https://images.unsplash.com/photo-1580587767526-cf3671a05014?auto=format&fit=crop&q=80&w=800",
      rating: 4.7,
      reviews: 56,
      status: "Verified",
      time: "1d ago"
    },
    {
      id: 4,
      title: "The Urban Cafe",
      location: "Whitefield, Bangalore",
      type: "Cafe",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
      rating: 4.9,
      reviews: 215,
      status: "Verified",
      time: "3h ago"
    }
  ];

  const handleSearch = () => {
    navigate('/request');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      {/* Hero Section - Professional Dark Tech Aesthetic */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-purple-900/20 to-indigo-900/30" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
        
        {/* Tech Spotlight Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent blur-3xl" />
        
        {/* Animated Floating Tech Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[10%] hidden lg:block"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/40 transition-all" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <Camera className="w-10 h-10 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-[12%] hidden lg:block"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full group-hover:bg-indigo-500/40 transition-all" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <Shield className="w-10 h-10 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
            </div>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-2.5 mb-10 shadow-2xl">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-xs font-bold tracking-wider text-indigo-200 uppercase">Live Local Verifications Active in Bangalore</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1] tracking-tight text-white">
              Verified Insights.
              <span className="block mt-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(129,140,248,0.3)]">
                Local Expertise.
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-14">
              Connect with trusted local verifiers for real-time proof of hotels, gyms, and neighborhoods. 
              AI-powered GPS and EXIF validation guaranteed.
            </p>
          </motion.div>
          
          {/* PROMINENT SEARCH BAR */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl mx-auto mb-16"
          >
            <div className="relative">
              {/* Glow effect behind search bar */}
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl" />
              
              <div className="relative bg-white rounded-2xl shadow-2xl p-2.5 flex flex-col lg:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search neighborhoods, hotels, or gyms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-slate-400 text-lg"
                  />
                </div>
                
                <div className="relative lg:w-60">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 appearance-none cursor-pointer text-lg bg-slate-50"
                  >
                    <option value="">Select Area</option>
                    <option value="Indiranagar">Indiranagar</option>
                    <option value="Koramangala">Koramangala</option>
                    <option value="HSR Layout">HSR Layout</option>
                    <option value="Whitefield">Whitefield</option>
                  </select>
                </div>
                
                <button
                  onClick={handleSearch}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 flex items-center justify-center gap-3 active:scale-95"
                >
                  Verify Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Quick Filters */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {placeTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => navigate('/request')}
                  className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-full font-semibold transition-all flex items-center gap-3 text-sm hover:border-white/30"
                >
                  <span>{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Featured Verifications Section - Replaces Valentine */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Latest Proof
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Verified Local Gems
              </h2>
              <p className="text-lg text-slate-600 mt-4 max-w-2xl font-medium">
                Recent on-the-ground verifications completed by our trusted Bangalore network.
              </p>
            </div>
            <button 
              onClick={() => navigate('/nearby')}
              className="group flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
            >
              Explore all locations
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredVerifications.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200/60 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-black text-slate-900 uppercase">Verified</span>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                    <span className="text-xs font-bold bg-indigo-600/80 px-2.5 py-1 rounded-lg backdrop-blur-md">{item.type}</span>
                    <span className="text-xs font-medium opacity-90 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4 font-medium">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    {item.location}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-black text-slate-900">{item.rating}</span>
                      <span className="text-xs text-slate-400 font-medium">({item.reviews})</span>
                    </div>
                    <button 
                      onClick={() => navigate('/nearby')}
                      className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-900/10"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <Camera className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Real-Time Proof</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Live photos and videos from verifiers who are physically at the location right now.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">AI Validation</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Automated EXIF and GPS metadata checks ensure all content is authentic and recent.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <Map className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Localized Network</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Connect with locals who know every corner of Bangalore better than any map.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
