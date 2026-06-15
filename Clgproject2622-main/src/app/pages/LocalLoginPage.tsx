import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MapPin, DollarSign, Clock, Shield, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function LocalLoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: authError } = await signIn(email, password);

      if (authError) {
        setError(authError.message || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        navigate('/local/tasks');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Become a Local Verifier
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Earn money by helping people verify locations in your city
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Flexible Earnings</h3>
                    <p className="text-gray-600">
                      Earn ₹150-300 per verification. Choose tasks that fit your schedule.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Work Near You</h3>
                    <p className="text-gray-600">
                      Get tasks within 2-5 km of your location. No long commutes needed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Quick Tasks</h3>
                    <p className="text-gray-600">
                      Most verifications take 30-60 minutes. Simple photo and checklist process.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Trusted Platform</h3>
                    <p className="text-gray-600">
                      Secure payments, safety guidelines, and community support.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="bg-white rounded-xl shadow-lg p-8 lg:p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600 mb-6">Sign in to start earning as a local verifier</p>

              {/* First Time User Help */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">💡</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-blue-900 mb-1">First time here?</p>
                    <p className="text-xs text-blue-700 mb-2">
                      Create an account first! Click "Sign Up" below to get started.
                    </p>
                    <p className="text-xs text-blue-600">
                      <strong>Already signed up?</strong> Make sure email confirmation is disabled in Supabase settings.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset functionality coming soon! Please contact support at support@locals.com')}
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </div>
                )}

                {/* Primary Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-[1.02] disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Sign In with Email
                    </>
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/local/signup')}
                    className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors"
                  >
                    Sign Up
                  </button>
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Requirements to Join</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 flex-shrink-0" />
                    Smartphone with camera
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 flex-shrink-0" />
                    Valid government ID
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 flex-shrink-0" />
                    Ability to travel within your city
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 flex-shrink-0" />
                    18+ years old
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}