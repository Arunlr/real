import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PhotoUploadWithLocation } from '../components/PhotoUploadWithLocation';
import { MapPin, Navigation, AlertCircle, CheckCircle, Info } from 'lucide-react';

export function LocationUploadDemo() {
  const [selectedLocation, setSelectedLocation] = useState<'hotel' | 'school' | 'park'>('hotel');

  // Mock location data for different places
  const mockLocations = {
    hotel: {
      name: 'Sunrise Grand Hotel',
      latitude: 19.1136,
      longitude: 72.8697,
      address: 'Andheri West, Mumbai',
    },
    school: {
      name: 'Green Valley School',
      latitude: 12.9698,
      longitude: 77.7499,
      address: 'Whitefield, Bangalore',
    },
    park: {
      name: 'Central Park',
      latitude: 18.5204,
      longitude: 73.8567,
      address: 'Koregaon Park, Pune',
    },
  };

  const currentLocation = mockLocations[selectedLocation];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Location-Verified Photo Upload
            </h1>
            <p className="text-xl text-gray-600">
              Upload photos with GPS coordinate validation
            </p>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">How Location Verification Works</h2>
                <ul className="space-y-2 text-blue-50">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Takes photo and captures your GPS coordinates simultaneously</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Calculates distance from expected location using Haversine formula</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Validates you're within acceptable range (default 100 meters)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Shows real-time feedback with distance and coordinates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Permission Instructions Banner */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-200 p-3 rounded-xl flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-yellow-800" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-900 mb-3">⚠️ Camera Not Working?</h3>
                
                <div className="bg-orange-500 text-white rounded-xl p-4 mb-4 shadow-lg">
                  <p className="font-bold text-lg mb-2">🔧 Run Camera Diagnostics First!</p>
                  <p className="text-sm mb-3">Having trouble accessing your camera? Our diagnostics tool will identify the exact problem.</p>
                  <a
                    href="/diagnostics"
                    target="_blank"
                    className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-lg hover:bg-orange-50 transition-all shadow-md"
                  >
                    <AlertCircle className="w-5 h-5" />
                    Open Camera Diagnostics
                    <span className="text-xl">→</span>
                  </a>
                </div>

                <div className="space-y-3 text-sm text-yellow-800">
                  <div>
                    <p className="font-semibold mb-1">📷 Common Issues:</p>
                    <ul className="list-disc ml-5 space-y-1">
                      <li>HTTP instead of HTTPS (camera requires secure connection)</li>
                      <li>Browser permission denied (click camera icon in address bar)</li>
                      <li>No camera found on device</li>
                      <li>Camera already in use by another app</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-100 border border-purple-300 rounded-lg p-3">
                    <p className="font-semibold mb-1 text-purple-900">✨ Can't Fix Camera?</p>
                    <p className="text-purple-800">Use <strong>Demo Mode</strong> instead! Click "Open Camera" → When error appears → Click "✨ Demo Mode" button</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Location Selector */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Select Location to Verify
                </h3>

                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedLocation('hotel')}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedLocation === 'hotel'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🏨</div>
                      <div>
                        <div className="font-bold text-gray-900">Sunrise Grand Hotel</div>
                        <div className="text-xs text-gray-600">Andheri West, Mumbai</div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          📍 19.1136°N, 72.8697°E
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedLocation('school')}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedLocation === 'school'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🏫</div>
                      <div>
                        <div className="font-bold text-gray-900">Green Valley School</div>
                        <div className="text-xs text-gray-600">Whitefield, Bangalore</div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          📍 12.9698°N, 77.7499°E
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedLocation('park')}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedLocation === 'park'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🏞️</div>
                      <div>
                        <div className="font-bold text-gray-900">Central Park</div>
                        <div className="text-xs text-gray-600">Koregaon Park, Pune</div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          📍 18.5204°N, 73.8567°E
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-yellow-800">
                      <p className="font-semibold mb-1">Testing Note:</p>
                      <p>Unless you're at these exact locations, the validation will likely fail, showing you the distance from the expected coordinates.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Upload Verification Photos
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <PhotoUploadWithLocation
                    label="Photo 1"
                    helperText="Primary verification photo"
                    size="lg"
                    required
                    expectedLocation={currentLocation}
                    maxDistance={100}
                    onImageChange={(file, coords) => {
                      console.log('Photo 1 uploaded:', file, coords);
                    }}
                  />

                  <PhotoUploadWithLocation
                    label="Photo 2"
                    helperText="Secondary angle"
                    size="lg"
                    expectedLocation={currentLocation}
                    maxDistance={100}
                    onImageChange={(file, coords) => {
                      console.log('Photo 2 uploaded:', file, coords);
                    }}
                  />

                  <PhotoUploadWithLocation
                    label="Photo 3"
                    helperText="Additional evidence"
                    size="lg"
                    expectedLocation={currentLocation}
                    maxDistance={100}
                    onImageChange={(file, coords) => {
                      console.log('Photo 3 uploaded:', file, coords);
                    }}
                  />
                </div>

                {/* Features List */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">Validation Features:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Navigation className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">GPS Coordinates</div>
                        <div className="text-xs text-gray-600">Captures exact latitude/longitude when photo is taken</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Distance Calculation</div>
                        <div className="text-xs text-gray-600">Uses Haversine formula for accurate distance</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Location Matching</div>
                        <div className="text-xs text-gray-600">Validates proximity to expected coordinates</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Real-time Feedback</div>
                        <div className="text-xs text-gray-600">Shows distance and validation status instantly</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="mt-6 bg-gray-900 rounded-2xl p-6 text-gray-300">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Technical Implementation
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• Uses browser Geolocation API for high-accuracy positioning</li>
                  <li>• Haversine formula calculates great-circle distance between coordinates</li>
                  <li>• Configurable distance threshold (default: 100m radius)</li>
                  <li>• Displays actual distance and coordinates for transparency</li>
                  <li>• Visual indicators: Green for valid, Red for invalid location</li>
                  <li>• Error handling for denied permissions or unavailable GPS</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Usage Example</h3>
            <pre className="bg-gray-900 text-gray-300 rounded-lg p-6 text-sm overflow-x-auto">
{`import { PhotoUploadWithLocation } from './components/PhotoUploadWithLocation';

function VerificationPage() {
  const expectedLocation = {
    name: 'Sunrise Grand Hotel',
    latitude: 19.1136,
    longitude: 72.8697,
  };

  return (
    <PhotoUploadWithLocation
      label="Verification Photo"
      helperText="Take a photo at the location"
      size="lg"
      required
      expectedLocation={expectedLocation}
      maxDistance={100} // Maximum 100 meters
      onImageChange={(file, coordinates) => {
        console.log('File:', file);
        console.log('GPS:', coordinates);
      }}
    />
  );
}`}
            </pre>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}