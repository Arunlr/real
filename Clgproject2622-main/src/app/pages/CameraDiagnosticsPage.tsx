import { useState, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, AlertCircle, RefreshCw, Lock, Globe } from 'lucide-react';

export function CameraDiagnosticsPage() {
  const [isSecure, setIsSecure] = useState(false);
  const [hasMediaDevices, setHasMediaDevices] = useState(false);
  const [permissionState, setPermissionState] = useState<string>('checking');
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);
  const [testStream, setTestStream] = useState<MediaStream | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    // Check 1: HTTPS
    setIsSecure(window.location.protocol === 'https:' || window.location.hostname === 'localhost');

    // Check 2: MediaDevices API
    setHasMediaDevices(!!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia);

    // Check 3: Permission state
    try {
      if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermissionState(result.state);

        // Listen for permission changes
        result.addEventListener('change', () => {
          setPermissionState(result.state);
        });
      } else {
        setPermissionState('unavailable');
      }
    } catch (err) {
      setPermissionState('unavailable');
    }

    // Check 4: List cameras
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setCameraList(cameras);
    } catch (err) {
      console.error('Cannot enumerate devices:', err);
    }
  };

  const testCamera = async () => {
    setIsTesting(true);
    setTestError(null);

    // Stop any existing stream
    if (testStream) {
      testStream.getTracks().forEach(track => track.stop());
      setTestStream(null);
    }

    try {
      console.log('Testing camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('✅ Camera access SUCCESS!', stream);
      setTestStream(stream);
      setTestError(null);

      // Update permission state
      await runDiagnostics();
    } catch (error) {
      console.error('❌ Camera access FAILED:', error);
      const err = error as Error;
      setTestError(`${err.name}: ${err.message}`);
      setTestStream(null);
    } finally {
      setIsTesting(false);
    }
  };

  const stopTest = () => {
    if (testStream) {
      testStream.getTracks().forEach(track => track.stop());
      setTestStream(null);
    }
  };

  useEffect(() => {
    return () => {
      if (testStream) {
        testStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [testStream]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Camera className="w-10 h-10 text-blue-400" />
            Camera Diagnostics
          </h1>
          <p className="text-gray-300">Check camera permissions and troubleshoot issues</p>
        </div>

        {/* Diagnostic Results */}
        <div className="grid gap-4 mb-8">
          {/* HTTPS Check */}
          <div className={`p-4 rounded-xl border-2 ${isSecure ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
            <div className="flex items-start gap-3">
              {isSecure ? (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Secure Connection (HTTPS)</h3>
                <p className="text-sm opacity-90">
                  {isSecure ? (
                    <>✅ Site is running on HTTPS or localhost - camera access is allowed</>
                  ) : (
                    <>❌ Site is NOT secure (HTTP) - camera access is BLOCKED by browser. You MUST use HTTPS.</>
                  )}
                </p>
                <p className="text-xs mt-2 opacity-75">Current: {window.location.protocol}//{window.location.host}</p>
              </div>
            </div>
          </div>

          {/* MediaDevices API Check */}
          <div className={`p-4 rounded-xl border-2 ${hasMediaDevices ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
            <div className="flex items-start gap-3">
              {hasMediaDevices ? (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">MediaDevices API</h3>
                <p className="text-sm opacity-90">
                  {hasMediaDevices ? (
                    <>✅ Browser supports camera access</>
                  ) : (
                    <>❌ Browser does NOT support camera API - try a different browser</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Permission State */}
          <div className={`p-4 rounded-xl border-2 ${
            permissionState === 'granted' ? 'bg-green-500/10 border-green-500/50' :
            permissionState === 'denied' ? 'bg-red-500/10 border-red-500/50' :
            'bg-yellow-500/10 border-yellow-500/50'
          }`}>
            <div className="flex items-start gap-3">
              {permissionState === 'granted' ? (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              ) : permissionState === 'denied' ? (
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Permission State</h3>
                <p className="text-sm opacity-90 mb-2">
                  Current state: <span className="font-bold uppercase">{permissionState}</span>
                </p>

                {permissionState === 'denied' && (
                  <div className="bg-red-900/30 rounded-lg p-3 mt-2">
                    <p className="text-sm font-bold text-red-300 mb-2">🚫 Camera Permission is DENIED</p>
                    <p className="text-xs text-red-200 mb-2">You MUST enable camera permission:</p>
                    <ol className="text-xs text-red-200 space-y-1 ml-4 list-decimal">
                      <li>Look at the top of your browser (address bar)</li>
                      <li>Click the 🔒 LOCK icon or 🎥 CAMERA icon</li>
                      <li>Find "Camera" permission</li>
                      <li>Change from "Block" to "Allow"</li>
                      <li>Click "Refresh Diagnostics" below</li>
                    </ol>
                  </div>
                )}

                {permissionState === 'prompt' && (
                  <div className="bg-yellow-900/30 rounded-lg p-3 mt-2">
                    <p className="text-xs text-yellow-200">
                      Browser will ask for permission when you click "Test Camera Access" below.
                      Make sure to click "Allow"!
                    </p>
                  </div>
                )}

                {permissionState === 'granted' && (
                  <div className="bg-green-900/30 rounded-lg p-3 mt-2">
                    <p className="text-xs text-green-200">
                      ✅ Permission granted! Camera should work. Click "Test Camera Access" to verify.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Camera List */}
          <div className={`p-4 rounded-xl border-2 ${
            cameraList.length > 0 ? 'bg-green-500/10 border-green-500/50' : 'bg-yellow-500/10 border-yellow-500/50'
          }`}>
            <div className="flex items-start gap-3">
              {cameraList.length > 0 ? (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Detected Cameras</h3>
                <p className="text-sm opacity-90 mb-2">Found {cameraList.length} camera(s)</p>
                {cameraList.length > 0 ? (
                  <ul className="space-y-1">
                    {cameraList.map((camera, idx) => (
                      <li key={camera.deviceId} className="text-xs bg-white/5 rounded px-2 py-1">
                        <span className="font-bold">Camera {idx + 1}:</span> {camera.label || 'Unknown camera'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-yellow-200">
                    No cameras detected. Check if camera is connected and enabled.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Test Camera */}
        <div className="bg-white/5 rounded-xl border-2 border-blue-500/30 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Test Camera Access</h2>

          {!testStream && !testError && (
            <button
              onClick={testCamera}
              disabled={isTesting || !isSecure || !hasMediaDevices}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Camera className="w-6 h-6" />
                  Test Camera Access
                </>
              )}
            </button>
          )}

          {testStream && (
            <div>
              <video
                autoPlay
                playsInline
                ref={(video) => {
                  if (video && testStream) {
                    video.srcObject = testStream;
                  }
                }}
                className="w-full rounded-xl bg-black mb-4"
              />
              <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <p className="text-sm font-bold text-green-300">✅ Camera is working! You can now use it in the app.</p>
              </div>
              <button
                onClick={stopTest}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                Stop Camera
              </button>
            </div>
          )}

          {testError && (
            <div>
              <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3 mb-3">
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-red-300 mb-1">❌ Camera Test Failed</p>
                    <p className="text-sm text-red-200 font-mono">{testError}</p>
                  </div>
                </div>

                <div className="bg-red-900/30 rounded-lg p-3 mt-3">
                  <p className="text-sm font-bold text-red-300 mb-2">How to Fix:</p>
                  <ol className="text-xs text-red-200 space-y-1 ml-4 list-decimal">
                    <li><strong>Look at browser address bar</strong> (very top of window)</li>
                    <li><strong>Click the 🔒 lock icon</strong> or 🎥 camera icon</li>
                    <li><strong>Find "Camera"</strong> in the dropdown</li>
                    <li><strong>Change to "Allow"</strong></li>
                    <li><strong>Refresh this page</strong> (F5)</li>
                  </ol>
                </div>
              </div>

              <button
                onClick={testCamera}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                <RefreshCw className="w-5 h-5 inline mr-2" />
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={runDiagnostics}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-all mb-4"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh Diagnostics
        </button>

        {/* Help Section */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-blue-400" />
            Common Issues
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <p className="font-bold text-blue-300">Camera permission denied?</p>
              <p className="text-gray-300">Click the 🔒 or 🎥 icon in your browser's address bar, change Camera to "Allow", then refresh.</p>
            </div>

            <div>
              <p className="font-bold text-blue-300">No cameras detected?</p>
              <p className="text-gray-300">Make sure your camera is connected, enabled, and not being used by another application.</p>
            </div>

            <div>
              <p className="font-bold text-blue-300">Still not working?</p>
              <p className="text-gray-300">Try a different browser (Chrome, Firefox, Edge) or restart your browser completely.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
