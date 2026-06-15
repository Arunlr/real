import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Search, MapPin, ArrowRight, CheckCircle, Star, Coffee, Pizza, Sparkles, TrendingUp, Mountain, Compass, Bike, Zap, Clock, Phone, Wifi, Users, Dumbbell, Home, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';

export function LandingPageWithMap() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const popularCities = [
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { name: 'Delhi', lat: 28.7041, lon: 77.1025 },
    { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
    { name: 'Pune', lat: 18.5204, lon: 73.8567 },
    { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  ];

  const placeTypes = [
    { icon: '🏨', label: 'Hotels', value: 'hotel' },
    { icon: '💪', label: 'Gyms', value: 'gym' },
    { icon: '🏘️', label: 'Neighborhoods', value: 'neighborhood' },
    { icon: '🏢', label: 'PG/Hostels', value: 'pg' },
  ];

  // Floating particles data
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSearch = () => {
    navigate('/request');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section with Map Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12">
        {/* Animated Map Background */}
        <div className="absolute inset-0">
          {/* Base dark layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-indigo-950 to-violet-950" />
          
          {/* Animated Map Grid */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          />

          {/* Floating Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, particle.size, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Animated light beams */}
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-full bg-gradient-to-b from-purple-500/20 via-transparent to-transparent blur-3xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-0 right-1/4 w-96 h-full bg-gradient-to-b from-indigo-500/20 via-transparent to-transparent blur-3xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              x: [0, -50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black" />
          <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-black via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="text-4xl md:text-6xl lg:text-7xl font-black">
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundImage: 'linear-gradient(90deg, #a855f7, #8b5cf6, #6366f1, #4f46e5, #a855f7, #8b5cf6)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Don't Trust the Review
              </motion.div>
              <div className="flex items-center justify-center gap-3 mt-2">
                <motion.span
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-block"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #a855f7, #8b5cf6, #6366f1, #4f46e5, #a855f7, #8b5cf6)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Trust Locals
                </motion.span>
                <motion.span
                  animate={{
                    rotate: [0, 14, -8, 14, 0],
                    scale: [1, 1.2, 1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="inline-block"
                >
                  ✨
                </motion.span>
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-purple-200 text-lg md:text-xl mt-4 font-medium"
            >
              Real-time verification from locals in Bangalore
            </motion.p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mb-16"
          >
            {/* Search glow */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-indigo-500/30 to-violet-500/30 blur-2xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
            
            {/* Search Container */}
            <motion.div 
              className="relative bg-white rounded-2xl p-2 shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col md:flex-row gap-2">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search hotels, schools, neighborhoods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400"
                  />
                </div>
                
                {/* City Selector */}
                <div className="relative md:w-48">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 text-gray-900 appearance-none cursor-pointer bg-white"
                  >
                    <option value="">Select City</option>
                    {popularCities.map(city => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Search Button */}
                <motion.button
                  onClick={handleSearch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Filters */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {placeTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => navigate('/nearby')}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-full font-semibold transition-all flex items-center gap-3 text-sm hover:border-white/30 cursor-pointer"
                >
                  <span>{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Featured Verified Places */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  delay: 0.35,
                  duration: 2,
                  repeat: Infinity
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold px-5 py-2.5 rounded-full mb-4 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                TRENDING NOW
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-purple-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Popular Verified Places
              </h2>
              <p className="text-lg text-gray-300 font-medium">
                Real-time verified locations trusted by locals in Bangalore
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Cafe Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative cursor-pointer"
                onClick={() => navigate('/nearby')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-2xl" />
                
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border-2 border-purple-200 group-hover:border-purple-400 transition-all">
                  <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2.5 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    VERIFIED
                  </div>

                  <div className="relative h-40 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop"
                      alt="Modern Cafe"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5">
                      <Coffee className="w-3 h-3 text-purple-600" />
                      <span className="text-xs font-bold text-gray-900">Cafe</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-green-600 uppercase">Verified Today</span>
                    </div>
                    
                    <h3 className="text-base font-black text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                      The Tech Hub Cafe
                    </h3>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>Indiranagar</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-gray-900">4.9</span>
                      </div>
                      <span className="text-xs text-gray-500">156 reviews</span>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mb-3">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <TrendingUp className="w-3 h-3 text-purple-600" />
                        <span className="text-xs font-bold text-purple-900">Locally Verified</span>
                      </div>
                      <p className="text-xs text-gray-700 mb-1.5">
                        Great WiFi & workspace setup
                      </p>
                      <div className="text-xs text-gray-600">
                        <span className="text-purple-600 font-black">₹200-400 per person</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/nearby');
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <CheckCircle className="w-3 h-3" />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Gym Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative cursor-pointer"
                onClick={() => navigate('/nearby')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-violet-500/30 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-2xl" />
                
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border-2 border-indigo-200 group-hover:border-indigo-400 transition-all">
                  <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2.5 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    VERIFIED
                  </div>

                  <div className="relative h-40 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop"
                      alt="Modern Gym"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5">
                      <Dumbbell className="w-3 h-3 text-indigo-600" />
                      <span className="text-xs font-bold text-gray-900">Gym</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-green-600 uppercase">Verified Today</span>
                    </div>
                    
                    <h3 className="text-base font-black text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      PowerFit Wellness
                    </h3>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>Koramangala</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-gray-900">4.7</span>
                      </div>
                      <span className="text-xs text-gray-500">203 reviews</span>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 mb-3">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <TrendingUp className="w-3 h-3 text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-900">Locally Verified</span>
                      </div>
                      <p className="text-xs text-gray-700 mb-1.5">
                        Modern equipment & clean facilities
                      </p>
                      <div className="text-xs text-gray-600">
                        <span className="text-indigo-600 font-black">₹1,500/month</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/nearby');
                      }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <CheckCircle className="w-3 h-3" />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Neighborhood Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative cursor-pointer"
                onClick={() => navigate('/nearby')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-2xl" />
                
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border-2 border-violet-200 group-hover:border-violet-400 transition-all">
                  <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2.5 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    VERIFIED
                  </div>

                  <div className="relative h-40 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&auto=format&fit=crop"
                      alt="Modern Neighborhood"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5">
                      <Home className="w-3 h-3 text-violet-600" />
                      <span className="text-xs font-bold text-gray-900">Area</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-green-600 uppercase">Verified Today</span>
                    </div>
                    
                    <h3 className="text-base font-black text-gray-900 mb-1 group-hover:text-violet-600 transition-colors">
                      HSR Layout
                    </h3>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>South Bangalore</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-gray-900">4.8</span>
                      </div>
                      <span className="text-xs text-gray-500">187 reviews</span>
                    </div>

                    <div className="bg-violet-50 border border-violet-200 rounded-lg p-2 mb-3">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <TrendingUp className="w-3 h-3 text-violet-600" />
                        <span className="text-xs font-bold text-violet-900">Locally Verified</span>
                      </div>
                      <p className="text-xs text-gray-700 mb-1.5">
                        Safe area with great connectivity
                      </p>
                      <div className="text-xs text-gray-600">
                        <span className="text-violet-600 font-black">₹15K-30K rent</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/nearby');
                      }}
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <CheckCircle className="w-3 h-3" />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Hotel Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative cursor-pointer"
                onClick={() => navigate('/nearby')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-2xl" />
                
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border-2 border-purple-200 group-hover:border-purple-400 transition-all">
                  <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2.5 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    VERIFIED
                  </div>

                  <div className="relative h-40 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop"
                      alt="Modern Hotel"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5">
                      <Home className="w-3 h-3 text-purple-600" />
                      <span className="text-xs font-bold text-gray-900">Hotel</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-green-600 uppercase">Verified Today</span>
                    </div>
                    
                    <h3 className="text-base font-black text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                      Zenith Stays
                    </h3>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>Whitefield</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-gray-900">4.6</span>
                      </div>
                      <span className="text-xs text-gray-500">142 reviews</span>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mb-3">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <TrendingUp className="w-3 h-3 text-purple-600" />
                        <span className="text-xs font-bold text-purple-900">Locally Verified</span>
                      </div>
                      <p className="text-xs text-gray-700 mb-1.5">
                        Clean rooms & excellent service
                      </p>
                      <div className="text-xs text-gray-600">
                        <span className="text-purple-600 font-black">₹2,500/night</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/nearby');
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <CheckCircle className="w-3 h-3" />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* View All Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/nearby')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 inline-flex items-center gap-2"
              >
                View All Verified Places
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Floating Admin Shortcut Button */}
      {user?.email === 'respectkills@gmail.com' && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          className="fixed bottom-6 left-6 z-50"
        >
          <Link
            to="/admin"
            className="group relative flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:scale-105 transition-all"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Shield className="w-5 h-5" />
            </motion.div>
            <span className="font-bold text-sm">Admin</span>
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
