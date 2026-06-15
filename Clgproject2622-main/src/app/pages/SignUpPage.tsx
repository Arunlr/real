import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle, ArrowLeft, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from 'figma:asset/631dfbc430742baae2d80970ce70de987ccbd36c.png';
import { useAuth } from '@/contexts/AuthContext';

export function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<{ auth?: string; password?: string }>({});
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);

  // Floating particles data
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate terms agreement
    if (!agreedToTerms) {
      setErrors({ auth: 'Please agree to the terms and conditions' });
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setErrors({ password: 'Passwords do not match' });
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters long' });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signUp(formData.email, formData.password, formData.fullName, formData.phone);

      if (error) {
        setErrors({
          auth: error.message || 'Failed to create account. Please try again.'
        });
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        // Check if email confirmation is required (session is null or identities empty)
        const needsEmailConfirmation = !data.session || (data.user.identities && data.user.identities.length === 0);

        if (needsEmailConfirmation) {
          setEmailConfirmationRequired(true);
          setIsLoading(false);
        } else {
          // Navigate to home page after successful signup
          navigate('/home');
        }
      }
    } catch (err) {
      setErrors({
        auth: 'An unexpected error occurred. Please try again.'
      });
      setIsLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background - professional purple-indigo tech aesthetic */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950 via-indigo-950 to-violet-950" />
      
      {/* Floating Particles */}
      <div className="fixed inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-purple-300/30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate('/local/login')}
        className="fixed top-8 left-8 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 group z-20"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back</span>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 blur-xl opacity-60 rounded-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
              <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 via-indigo-500 to-violet-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-white absolute" />
                  <CheckCircle className="w-5 h-5 text-emerald-300 absolute" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-5xl font-black bg-gradient-to-r from-purple-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2 tracking-wide"
          >
            LOCALS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-gray-300 mb-8"
          >
            Create Your Account
          </motion.p>

          {/* Email Confirmation Success Message */}
          <AnimatePresence>
            {emailConfirmationRequired && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 mb-6"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Check Your Email</h2>
                  <p className="text-gray-300">
                    We've sent a confirmation email to <span className="text-purple-300 font-semibold">{formData.email}</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Click the link in the email to confirm your account and complete signup.
                  </p>
                  <button
                    onClick={() => navigate('/local/login')}
                    className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all"
                  >
                    Go to Login
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Card */}
          {!emailConfirmationRequired && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Phone className="w-5 h-5 text-purple-400" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-purple-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-purple-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-white/30 bg-white/10 text-purple-500 focus:ring-2 focus:ring-purple-400/50 cursor-pointer"
                  />
                  <span className="text-sm text-gray-300 leading-relaxed group-hover:text-white">
                    I agree to the{' '}
                    <button type="button" className="text-purple-300 hover:text-purple-200 underline">
                      Terms & Conditions
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-purple-300 hover:text-purple-200 underline">
                      Privacy Policy
                    </button>
                  </span>
                </label>
              </div>

              {/* Error Messages */}
              <AnimatePresence>
                {(errors.auth || errors.password) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/10 border border-red-400/30 rounded-xl p-4"
                  >
                    <p className="text-sm text-red-400 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {errors.auth || errors.password}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sign Up Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white absolute" />
                      <CheckCircle className="w-2.5 h-2.5 text-emerald-300 absolute" />
                    </div>
                  </>
                )}
              </motion.button>

              {/* Sign In Link */}
              <div className="text-center pt-2">
                <p className="text-gray-300 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/local/login')}
                    className="text-purple-300 hover:text-purple-200 font-semibold transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </motion.div>
          )}

          {/* Footer Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-gray-400 mt-6"
          >
            Trusted by locals across Bangalore
          </motion.p>
        </motion.div>
      </div>

      {/* Floating Help Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full shadow-2xl shadow-purple-500/50 flex items-center justify-center text-white font-bold text-xl z-20 transition-all group"
      >
        <span className="group-hover:scale-110 transition-transform">?</span>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-purple-950"></div>
      </motion.button>
    </div>
  );
}