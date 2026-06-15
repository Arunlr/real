import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { TrustBadge, getTrustLevel } from '../components/TrustBadge';
import { TrustScoreMeter } from '../components/TrustScoreMeter';
import { CreditsDisplay } from '../components/CreditsDisplay';
import { VerificationCard } from '../components/VerificationCard';
import { 
  Award, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  Clock,
  Star,
  Gift,
  Sparkles,
  ArrowRight,
  Trophy,
  Zap,
  ArrowLeft,
  Home
} from 'lucide-react';

export function RewardsDashboard() {
  const navigate = useNavigate();
  const [userStats] = useState({
    trustScore: 67,
    previousTrustScore: 62,
    credits: 1250,
    earnedToday: 150,
    totalVerifications: 23,
    completedToday: 3,
    accuracy: 94,
    responseRate: 98,
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const trustLevel = getTrustLevel(userStats.trustScore);

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

  const recentVerifications = [
    {
      verifier: { name: 'Priya Sharma', trustScore: 67, totalVerifications: 23 },
      location: { name: 'Gold\'s Gym, Indiranagar', coordinates: '12.9716° N, 77.5946° E' },
      timestamp: new Date('2026-02-11T14:30:00'),
      media: { photos: 8, videos: 1 },
      status: 'verified' as const,
      completeness: 95,
      freshness: 'fresh' as const,
    },
    {
      verifier: { name: 'Priya Sharma', trustScore: 67, totalVerifications: 23 },
      location: { name: 'The Oberoi Hotel, Koramangala', coordinates: '12.9352° N, 77.6245° E' },
      timestamp: new Date('2026-02-10T16:45:00'),
      media: { photos: 12, videos: 2 },
      status: 'verified' as const,
      completeness: 100,
      freshness: 'fresh' as const,
    },
    {
      verifier: { name: 'Priya Sharma', trustScore: 67, totalVerifications: 23 },
      location: { name: 'HSR Layout Neighborhood Tour', coordinates: '12.9082° N, 77.6476° E' },
      timestamp: new Date('2026-02-09T11:20:00'),
      media: { photos: 15, videos: 3 },
      status: 'verified' as const,
      completeness: 98,
      freshness: 'recent' as const,
    },
  ];

  const benefits = [
    {
      level: 'verified',
      title: 'Unlock Verified Benefits',
      description: 'Complete 5 more verifications',
      progress: 60,
      rewards: ['Higher credits per task', 'Priority task visibility', 'Verified badge'],
      unlocked: true,
    },
    {
      level: 'trusted',
      title: 'Reach Trusted Status',
      description: '18 points needed',
      progress: 45,
      rewards: ['Bonus credits', 'Featured placement', 'Lower request costs'],
      unlocked: false,
    },
    {
      level: 'elite',
      title: 'Become Elite Local',
      description: 'Premium tier with exclusive perks',
      progress: 25,
      rewards: ['Maximum credits', 'Cash rewards', 'VIP recognition'],
      unlocked: false,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Animated Background - Same as Home Page */}
      <div className="absolute inset-0 -z-10">
        {/* Base dark layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-950 via-magenta-950 to-pink-950" />
        
        {/* Animated Map Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(236, 72, 153, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(236, 72, 153, 0.3) 1px, transparent 1px)
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
            className="absolute w-1 h-1 bg-fuchsia-400 rounded-full"
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

        {/* Glowing Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl relative z-10">
        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-start"
        >
          <motion.button
            onClick={() => navigate('/home')}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 bg-gradient-to-r from-gray-800/90 to-gray-900/90 hover:from-gray-700/90 hover:to-gray-800/90 text-white font-bold rounded-2xl border-2 border-pink-500/20 hover:border-pink-500/40 flex items-center gap-2 cursor-pointer shadow-xl backdrop-blur-md group transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-pink-400 group-hover:-translate-x-1.5 transition-transform duration-300" />
            <span className="tracking-wide">Back to Home Page</span>
          </motion.button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-pink-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
              Rewards & Trust
            </h1>
          </div>
          <p className="text-pink-200">Build your reputation, earn rewards, and unlock exclusive benefits</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Trust Score Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 border border-pink-200 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Trust Score</h2>
              <TrustBadge level={trustLevel} score={userStats.trustScore} />
            </div>
            <TrustScoreMeter score={userStats.trustScore} previousScore={userStats.previousTrustScore} />
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-xl p-4 border border-pink-200 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Total Verifications</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{userStats.totalVerifications}</div>
              <div className="text-xs text-green-600 mt-1">+{userStats.completedToday} today</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-pink-200 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Accuracy Rate</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{userStats.accuracy}%</div>
              <div className="text-xs text-gray-500 mt-1">Based on feedback</div>
            </div>
          </motion.div>
        </div>

        {/* Credits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <CreditsDisplay
            credits={userStats.credits}
            earnedToday={userStats.earnedToday}
          />
        </motion.div>

        {/* Benefits Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
            <Sparkles className="w-6 h-6 text-pink-400" />
            Unlock More Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-6 border-2 ${
                  benefit.unlocked ? 'border-green-300 bg-green-50' : 'border-gray-200'
                } transition-all hover:shadow-lg`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                  {benefit.unlocked && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{benefit.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${benefit.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-pink-600 to-red-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {benefit.rewards.map((reward, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <Zap className="w-3 h-3 text-pink-600" />
                      <span>{reward}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Verifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Award className="w-6 h-6 text-pink-400" />
              Recent Verifications
            </h2>
            <button className="text-pink-400 hover:text-pink-300 font-medium text-sm flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVerifications.map((verification, index) => (
              <VerificationCard key={index} {...verification} />
            ))}
          </div>
        </motion.div>

        {/* How to Improve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-pink-600 to-red-600 rounded-2xl p-6 text-white"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            How to Increase Your Trust Score
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Star className="w-8 h-8 mb-2" />
              <h4 className="font-bold mb-1">Complete More Verifications</h4>
              <p className="text-sm text-white/90">Each quality verification increases your score</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Clock className="w-8 h-8 mb-2" />
              <h4 className="font-bold mb-1">Upload Fresh Content</h4>
              <p className="text-sm text-white/90">Recent photos and videos boost freshness</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Gift className="w-8 h-8 mb-2" />
              <h4 className="font-bold mb-1">Maintain Consistency</h4>
              <p className="text-sm text-white/90">Regular, quality submissions build trust</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}