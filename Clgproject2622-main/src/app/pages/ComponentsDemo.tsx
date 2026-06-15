import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CameraPermissionModal } from '../components/CameraPermissionModal';
import { BudgetRecommendation } from '../components/BudgetRecommendation';
import { Camera, Sparkles, CheckCircle, XCircle } from 'lucide-react';

export function ComponentsDemo() {
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [selectedPlaceType, setSelectedPlaceType] = useState<'hotel' | 'school' | 'neighborhood' | 'pg' | 'restaurant' | 'other'>('hotel');
  const [duration, setDuration] = useState(1);
  const [occupancy, setOccupancy] = useState(1);
  const [recommendedBudget, setRecommendedBudget] = useState(0);

  const handleCameraAllow = () => {
    setCameraPermissionStatus('granted');
    setIsCameraModalOpen(false);
  };

  const handleCameraDeny = () => {
    setCameraPermissionStatus('denied');
    setIsCameraModalOpen(false);
  };

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune'];
  const placeTypes: Array<{ value: 'hotel' | 'school' | 'neighborhood' | 'pg' | 'restaurant' | 'other'; label: string; icon: string }> = [
    { value: 'hotel', label: 'Hotel', icon: '🏨' },
    { value: 'school', label: 'School', icon: '🏫' },
    { value: 'neighborhood', label: 'Neighborhood', icon: '🏘️' },
    { value: 'pg', label: 'PG/Hostel', icon: '🏢' },
    { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              New Components Demo
            </h1>
            <p className="text-xl text-gray-600">
              Camera Permission Modal & AI Budget Recommendation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Camera Permission Modal Demo */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg shadow-blue-600/30">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Camera Permission Modal</h2>
                  <p className="text-sm text-gray-600">Request camera access for verification photos</p>
                </div>
              </div>

              {/* Status Display */}
              {cameraPermissionStatus !== 'pending' && (
                <div className={`mb-6 p-4 rounded-xl border-2 ${
                  cameraPermissionStatus === 'granted'
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="flex items-center gap-3">
                    {cameraPermissionStatus === 'granted' ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                          <div className="font-bold text-green-900">Camera Access Granted</div>
                          <div className="text-sm text-green-700">You can now take verification photos</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-red-600" />
                        <div>
                          <div className="font-bold text-red-900">Camera Access Denied</div>
                          <div className="text-sm text-red-700">Enable camera in browser settings to continue</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900">Features:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    <span>Modern modal design with backdrop blur</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    <span>Animated camera icon with pulsing rings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    <span>Clear explanation of why permission is needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    <span>Privacy notice and trust messaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    <span>Real browser camera permission request</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    <span>Allow/Deny action buttons</span>
                  </li>
                </ul>
              </div>

              {/* Trigger Button */}
              <button
                onClick={() => setIsCameraModalOpen(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/50 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Open Camera Permission Modal
              </button>

              {/* Reset Button */}
              {cameraPermissionStatus !== 'pending' && (
                <button
                  onClick={() => setCameraPermissionStatus('pending')}
                  className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Reset Status
                </button>
              )}
            </div>

            {/* AI Budget Recommendation Demo */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg shadow-purple-600/30">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">AI Budget Recommendation</h2>
                  <p className="text-sm text-gray-600">Smart pricing based on location & data</p>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Place Type
                  </label>
                  <select
                    value={selectedPlaceType}
                    onChange={(e) => setSelectedPlaceType(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {placeTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Occupancy
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={occupancy}
                      onChange={(e) => setOccupancy(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900">Features:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2" />
                    <span>Real-time AI-powered budget calculation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2" />
                    <span>City-specific pricing data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2" />
                    <span>Budget/Mid-range/Premium options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2" />
                    <span>Market trend indicators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2" />
                    <span>Visual price range positioning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2" />
                    <span>Duration & occupancy adjustments</span>
                  </li>
                </ul>
              </div>

              {recommendedBudget > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-4">
                  <div className="text-sm font-semibold text-purple-900 mb-1">Current Recommendation:</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(recommendedBudget)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Width Budget Recommendation Demo */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Budget Calculator</h2>
            <BudgetRecommendation
              city={selectedCity}
              placeType={selectedPlaceType}
              duration={duration}
              occupancy={occupancy}
              onChange={(budget) => setRecommendedBudget(budget)}
            />
          </div>

          {/* Usage Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Camera Permission Usage</h3>
              <pre className="bg-gray-900 text-gray-300 rounded-lg p-4 text-xs overflow-x-auto">
{`import { CameraPermissionModal } from './components/CameraPermissionModal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Request Camera
      </button>
      
      <CameraPermissionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAllow={() => {
          console.log('Camera allowed');
          setIsOpen(false);
        }}
        onDeny={() => {
          console.log('Camera denied');
          setIsOpen(false);
        }}
      />
    </>
  );
}`}
              </pre>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Budget Recommendation Usage</h3>
              <pre className="bg-gray-900 text-gray-300 rounded-lg p-4 text-xs overflow-x-auto">
{`import { BudgetRecommendation } from './components/BudgetRecommendation';

function MyComponent() {
  return (
    <BudgetRecommendation
      city="Mumbai"
      placeType="hotel"
      duration={3}
      occupancy={2}
      onChange={(budget) => {
        console.log('Budget:', budget);
      }}
    />
  );
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Camera Permission Modal */}
      <CameraPermissionModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onAllow={handleCameraAllow}
        onDeny={handleCameraDeny}
      />
    </div>
  );
}