import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Camera, CheckCircle, XCircle, AlertTriangle, Info, RefreshCw } from 'lucide-react';

export function CameraDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<{
    isHttps: boolean;
    hasGetUserMedia: boolean;
    hasNavigator: boolean;
    hasMediaDevices: boolean;
    cameraPermission: 'granted' | 'denied' | 'prompt' | 'unknown';
    locationPermission: 'granted' | 'denied' | 'prompt' | 'unknown';
    userAgent: string;
    cameras: MediaDeviceInfo[];
    testResult: 'success' | 'error' | 'pending' | null;
    errorMessage: string;
  }>({
    isHttps: window.location.protocol === 'https:',
    hasGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    hasNavigator: !!navigator,
    hasMediaDevices: !!navigator.mediaDevices,
    cameraPermission: 'unknown',
    locationPermission: 'unknown',
    userAgent: navigator.userAgent,
    cameras: [],
    testResult: null,
    errorMessage: '',
  });

  const [isTestingCamera, setIsTestingCamera] = useState(false);
  const [isTestingLocation, setIsTestingLocation] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Check permissions
  const checkPermissions = async () => {
    try {
      if (navigator.permissions) {
        // Check camera permission
        try {
          const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          setDiagnostics(prev => ({ ...prev, cameraPermission: cameraPermission.state }));
        } catch (e) {
          console.log('Camera permission query not supported');
        }

        // Check location permission
        try {
          const locationPermission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          setDiagnostics(prev => ({ ...prev, locationPermission: locationPermission.state }));
        } catch (e) {
          console.log('Location permission query not supported');
        }
      }

      // Enumerate devices
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setDiagnostics(prev => ({ ...prev, cameras }));
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  // Test camera access
  const testCamera = async () => {
    setIsTestingCamera(true);
    setDiagnostics(prev => ({ ...prev, testResult: 'pending', errorMessage: '' }));

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      setStream(mediaStream);
      setDiagnostics(prev => ({ 
        ...prev, 
        testResult: 'success',
        cameraPermission: 'granted',
        errorMessage: 'Camera access successful! 🎉',
      }));
      setIsTestingCamera(false);

      // Update camera list after permission granted
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setDiagnostics(prev => ({ ...prev, cameras }));

    } catch (error: any) {
      let errorMessage = 'Unknown error';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied by user';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found on this device';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use by another application';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints not supported';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Camera access not supported (HTTPS required)';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Security error: HTTPS required or permissions blocked';
      } else {
        errorMessage = `${error.name}: ${error.message}`;
      }

      setDiagnostics(prev => ({ 
        ...prev, 
        testResult: 'error',
        cameraPermission: 'denied',
        errorMessage,
      }));
      setIsTestingCamera(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Test location
  const testLocation = () => {
    setIsTestingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDiagnostics(prev => ({ 
          ...prev, 
          locationPermission: 'granted',
        }));
        setIsTestingLocation(false);
        alert(`Location access successful!\nLat: ${position.coords.latitude.toFixed(6)}\nLon: ${position.coords.longitude.toFixed(6)}`);
      },
      (error) => {
        let errorMessage = 'Location error';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location permission denied';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information unavailable';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out';
        }
        setDiagnostics(prev => ({ 
          ...prev, 
          locationPermission: 'denied',
        }));
        setIsTestingLocation(false);
        alert(errorMessage);
      }
    );
  };

  // Run diagnostics on mount
  useState(() => {
    checkPermissions();
  });

  const StatusIcon = ({ status }: { status: boolean | string }) => {
    if (status === true || status === 'granted' || status === 'success') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (status === 'prompt' || status === 'pending') {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Camera className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Camera Diagnostics
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              Troubleshoot webcam and location access issues
            </p>
          </div>

          {/* System Check */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              System Check
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon status={diagnostics.isHttps} />
                  <div>
                    <div className="font-semibold text-gray-900">HTTPS Connection</div>
                    <div className="text-sm text-gray-600">
                      Current: {window.location.protocol}
                    </div>
                  </div>
                </div>
                {!diagnostics.isHttps && (
                  <div className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                    ⚠️ HTTPS Required
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon status={diagnostics.hasNavigator} />
                  <div>
                    <div className="font-semibold text-gray-900">Navigator API</div>
                    <div className="text-sm text-gray-600">
                      {diagnostics.hasNavigator ? 'Available' : 'Not available'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon status={diagnostics.hasMediaDevices} />
                  <div>
                    <div className="font-semibold text-gray-900">MediaDevices API</div>
                    <div className="text-sm text-gray-600">
                      {diagnostics.hasMediaDevices ? 'Available' : 'Not available'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon status={diagnostics.hasGetUserMedia} />
                  <div>
                    <div className="font-semibold text-gray-900">getUserMedia API</div>
                    <div className="text-sm text-gray-600">
                      {diagnostics.hasGetUserMedia ? 'Available' : 'Not available'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Permissions Status</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon status={diagnostics.cameraPermission} />
                  <div>
                    <div className="font-semibold text-gray-900">Camera Permission</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {diagnostics.cameraPermission}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon status={diagnostics.locationPermission} />
                  <div>
                    <div className="font-semibold text-gray-900">Location Permission</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {diagnostics.locationPermission}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={checkPermissions}
              className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Permissions
            </button>
          </div>

          {/* Camera Devices */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Cameras</h2>

            {diagnostics.cameras.length > 0 ? (
              <div className="space-y-3">
                {diagnostics.cameras.map((camera, index) => (
                  <div key={camera.deviceId} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Camera className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-semibold text-green-900">
                          {camera.label || `Camera ${index + 1}`}
                        </div>
                        <div className="text-xs text-green-700">
                          Device ID: {camera.deviceId.slice(0, 20)}...
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  No cameras detected. Grant camera permission to see available devices.
                </p>
              </div>
            )}
          </div>

          {/* Test Camera */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Camera Access</h2>

            {!stream ? (
              <button
                onClick={testCamera}
                disabled={isTestingCamera}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
              >
                <Camera className="w-6 h-6" />
                {isTestingCamera ? 'Testing Camera...' : 'Test Camera Access'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={(video) => {
                      if (video && stream) {
                        video.srcObject = stream;
                        video.play();
                      }
                    }}
                    autoPlay
                    playsInline
                    className="w-full h-full"
                  />
                </div>
                <button
                  onClick={stopCamera}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Stop Camera
                </button>
              </div>
            )}

            {diagnostics.testResult && (
              <div className={`mt-4 p-4 rounded-lg ${
                diagnostics.testResult === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : diagnostics.testResult === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className={`text-sm font-semibold ${
                  diagnostics.testResult === 'success' 
                    ? 'text-green-900' 
                    : diagnostics.testResult === 'error'
                    ? 'text-red-900'
                    : 'text-blue-900'
                }`}>
                  {diagnostics.errorMessage}
                </p>
              </div>
            )}
          </div>

          {/* Test Location */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Location Access</h2>

            <button
              onClick={testLocation}
              disabled={isTestingLocation}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
            >
              <Camera className="w-6 h-6" />
              {isTestingLocation ? 'Getting Location...' : 'Test Location Access'}
            </button>
          </div>

          {/* Troubleshooting Guide */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">🔧 How to Fix "Permission Denied"</h2>
            
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold mb-3 text-xl">🎯 METHOD 1: Browser Address Bar (EASIEST)</h3>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Look at your browser's address bar (where the URL is):</p>
                  <div className="bg-white/20 rounded p-3 space-y-2">
                    <p>• <strong>Chrome/Edge:</strong> Click the 🔒 or 🎥 icon left of URL → Click "Site settings" → Set Camera and Location to "Allow"</p>
                    <p>• <strong>Firefox:</strong> Click the 🔒 or ⓘ icon left of URL → Click {'">"'} arrow next to "Blocked" → Click "Temporarily Allow" or "Allow"</p>
                    <p>• <strong>Safari:</strong> Click "Safari" menu → Settings for This Website → Camera & Location → "Allow"</p>
                    <p>• <strong>Brave:</strong> Click the 🦁 icon → Site settings → Camera & Location → "Allow"</p>
                  </div>
                  <p className="font-semibold mt-3 text-yellow-200">⚠️ After changing, REFRESH the page and click "Test Camera Access" again!</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold mb-3 text-xl">⚙️ METHOD 2: Browser Settings (More Permanent)</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white/20 rounded p-3">
                    <p className="font-semibold mb-2">Chrome / Edge / Brave:</p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Click three dots (⋮) in top-right</li>
                      <li>Settings → Privacy and security</li>
                      <li>Site Settings → Camera and Location</li>
                      <li>Find your site in "Blocked" list</li>
                      <li>Remove it or change to "Allow"</li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>

                  <div className="bg-white/20 rounded p-3">
                    <p className="font-semibold mb-2">Firefox:</p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Click hamburger menu (≡) in top-right</li>
                      <li>Settings → Privacy & Security</li>
                      <li>Scroll to "Permissions" section</li>
                      <li>Click "Settings" next to Camera and Microphone</li>
                      <li>Find your site and change to "Allow"</li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>

                  <div className="bg-white/20 rounded p-3">
                    <p className="font-semibold mb-2">Safari (Mac):</p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Safari menu → Settings</li>
                      <li>Websites tab</li>
                      <li>Camera and Location in left sidebar</li>
                      <li>Find your website and set to "Allow"</li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold mb-3 text-xl">🖥️ METHOD 3: System Settings (If Browser Still Blocks)</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white/20 rounded p-3">
                    <p className="font-semibold mb-2">macOS:</p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Click  → System Settings</li>
                      <li>Privacy & Security</li>
                      <li>Click "Camera" in left sidebar</li>
                      <li>Enable checkbox for your browser (Chrome, Firefox, Safari, etc.)</li>
                      <li>Do the same for "Location Services"</li>
                      <li>Restart your browser completely</li>
                    </ol>
                  </div>

                  <div className="bg-white/20 rounded p-3">
                    <p className="font-semibold mb-2">Windows 10/11:</p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Settings → Privacy & security</li>
                      <li>Click "Camera" and "Location"</li>
                      <li>Turn ON "Let apps access your camera/location"</li>
                      <li>Turn ON "Let desktop apps access your camera/location"</li>
                      <li>Make sure your browser is allowed</li>
                      <li>Restart your browser completely</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold mb-3 text-xl">🔄 METHOD 4: Clear Site Data & Try Again</h3>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Sometimes the browser remembers your "Deny" choice. Clear it:</p>
                  <ol className="list-decimal ml-5 space-y-1 bg-white/20 rounded p-3">
                    <li>Right-click anywhere on this page</li>
                    <li>Select "Inspect" or "Developer Tools"</li>
                    <li>Click "Application" tab (Chrome) or "Storage" tab (Firefox)</li>
                    <li>Click "Clear site data" or "Clear Storage"</li>
                    <li>Close Developer Tools</li>
                    <li>Refresh page and try again</li>
                  </ol>
                </div>
              </div>

              <div className="bg-purple-600 rounded-lg p-4 border-4 border-white/30">
                <h3 className="font-bold mb-2 text-xl">✨ STILL NOT WORKING? Use Demo Mode!</h3>
                <p className="text-sm mb-3">You can test the entire app without needing camera or location permissions!</p>
                <a
                  href="/demo/location-upload"
                  className="inline-block bg-white text-purple-600 font-bold px-6 py-3 rounded-lg hover:bg-purple-50 transition-all shadow-lg text-center w-full"
                >
                  🎮 Open Demo Mode →
                </a>
                <p className="text-xs mt-2 text-purple-100">
                  Click "Open Camera" → When error appears → Click "✨ Demo Mode" button
                </p>
              </div>
            </div>
          </div>

          {/* Browser Info */}
          <div className="mt-6 bg-gray-800 rounded-2xl p-6 text-gray-300">
            <h3 className="text-white font-bold mb-2">Browser Information</h3>
            <p className="text-xs font-mono break-all">{diagnostics.userAgent}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}