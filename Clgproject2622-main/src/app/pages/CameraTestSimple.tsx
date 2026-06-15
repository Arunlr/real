import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export function CameraTestSimple() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const testCamera = async () => {
    setTesting(true);
    setError(null);
    setStatusMessage('');

    // Stop any existing stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    try {
      setStatusMessage('Checking permission state...');
      console.log('🎥 Checking permission state...');

      // Check permission state first
      let permissionState = 'prompt';
      try {
        if (navigator.permissions) {
          const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
          permissionState = result.state;
          console.log('📊 Permission state:', permissionState);

          if (permissionState === 'granted') {
            setStatusMessage('Permission already granted! Opening camera...');
          } else if (permissionState === 'prompt') {
            setStatusMessage('Permission will be requested. Browser will show prompt...');
          } else if (permissionState === 'denied') {
            setStatusMessage('Permission denied. You must reset it manually.');
          }
        }
      } catch (permErr) {
        console.log('⚠️ Permission API not supported, will try direct access');
        setStatusMessage('Checking camera access...');
      }

      // If permission is denied, we can't request it - user must manually reset
      if (permissionState === 'denied') {
        console.log('🚫 Permission is DENIED. Browser will NOT show prompt.');
        console.log('👉 You must click the 🔒 lock icon in address bar and change Camera to "Allow"');
        setError('PERMISSION_DENIED_PREVIOUSLY');
        setStatusMessage('');
        setTesting(false);
        return;
      }

      setStatusMessage('Requesting camera access... LOOK FOR BROWSER PROMPT!');
      console.log('🎥 Requesting camera access...');
      console.log('⏳ Browser should show permission prompt NOW...');
      console.log('👀 LOOK at top of browser window for permission prompt!');

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setStatusMessage('Camera access granted! Setting up video...');
      console.log('✅ Camera access granted!', mediaStream);
      console.log('📹 Video tracks:', mediaStream.getVideoTracks());

      setStream(mediaStream);
      setError(null);

      // Set video source
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        console.log('🎬 Video playback started!');
      }

      setStatusMessage('');

    } catch (err) {
      console.error('❌ Camera access failed:', err);
      console.log('📍 Check the error message above for details');
      const error = err as Error;
      setError(`${error.name}: ${error.message}`);
      setStream(null);
      setStatusMessage('');
    } finally {
      setTesting(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Visual Indicator Pointing Up */}
        <div className="mb-6 bg-gradient-to-r from-orange-500/30 to-red-500/30 border-2 border-orange-500 rounded-xl p-6 animate-pulse">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="text-6xl">👆</div>
            <div className="text-left">
              <p className="text-2xl font-bold text-orange-200">LOOK UP ↑ AT TOP-LEFT OF BROWSER</p>
              <p className="text-lg text-orange-100">Find the 🔒 Lock Icon or 🎥 Camera Icon</p>
            </div>
            <div className="text-6xl">👆</div>
          </div>
          <p className="text-center text-base text-orange-200">
            If browser doesn't ask for permission, click that icon to reset camera permission!
          </p>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3 flex items-center justify-center gap-4">
            <Camera className="w-12 h-12 text-blue-400" />
            Simple Camera Test
          </h1>
          <p className="text-xl text-gray-300">Test if your camera works - nothing else</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/20 border-2 border-blue-500/50 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-3">📋 What Will Happen:</h2>
          <div className="space-y-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-xl font-bold mb-2 text-green-300">✅ EXPECTED (Browser will ask):</p>
              <ol className="space-y-2 text-lg list-decimal list-inside ml-2">
                <li>You click "Test Camera Now" button below</li>
                <li>Browser shows a permission prompt asking to use camera</li>
                <li>You click <strong>"Allow"</strong> in the prompt</li>
                <li>Live camera video appears below ✅</li>
              </ol>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-xl font-bold mb-2 text-red-300">❌ IF BROWSER DOESN'T ASK:</p>
              <ol className="space-y-2 text-lg list-decimal list-inside ml-2">
                <li>You previously clicked "Block" - browser remembers</li>
                <li>Look at <strong>TOP-LEFT</strong> of browser for 🔒 icon</li>
                <li>Click it → Find "Camera" → Change to "Allow"</li>
                <li>Refresh page and try again</li>
                <li>NOW browser will ask for permission ✅</li>
              </ol>
            </div>
            <div className="bg-yellow-900/30 rounded-lg p-4">
              <p className="text-lg">
                <strong>⚠️ Important:</strong> Close Zoom, Teams, Skype, or any other apps using your camera before testing.
              </p>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && testing && (
          <div className="mb-6 bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-2 border-purple-500 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <RefreshCw className="w-8 h-8 text-purple-300 animate-spin flex-shrink-0" />
              <div>
                <p className="text-2xl font-bold text-purple-200">{statusMessage}</p>
                {statusMessage.includes('LOOK FOR BROWSER PROMPT') && (
                  <p className="text-lg text-purple-100 mt-2">
                    👀 A popup should appear asking to use your camera - click "Allow"!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Test Button */}
        {!stream && !error && (
          <div className="space-y-4">
            <button
              onClick={testCamera}
              disabled={testing}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-8 px-8 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-2xl hover:shadow-blue-500/50 text-2xl"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-10 h-10 animate-spin" />
                  Testing Camera...
                </>
              ) : (
                <>
                  <Camera className="w-10 h-10" />
                  Test Camera Now
                </>
              )}
            </button>

            {!testing && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-300 text-center">
                  💡 <strong>Tip:</strong> Press <code className="bg-black/30 px-2 py-1 rounded">F12</code> to open Developer Console and see detailed logs
                </p>
              </div>
            )}
          </div>
        )}

        {/* Video Preview */}
        {stream && (
          <div className="space-y-6">
            <div className="bg-green-500/20 border-2 border-green-500/50 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
                <div>
                  <h2 className="text-3xl font-bold text-green-300">✅ SUCCESS!</h2>
                  <p className="text-lg text-green-200">Your camera is working perfectly!</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black shadow-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full"
              />
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3">🎉 What This Means:</h3>
              <ul className="space-y-2 text-lg">
                <li>✅ Your camera hardware works</li>
                <li>✅ Browser permissions are granted</li>
                <li>✅ Camera will work in the main app</li>
                <li>✅ You're ready for the demo!</li>
              </ul>
            </div>

            <button
              onClick={stopCamera}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl text-xl transition-all"
            >
              Stop Camera
            </button>

            <div className="bg-blue-500/20 border border-blue-500/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3">📱 Next Steps:</h3>
              <ol className="space-y-2 text-lg list-decimal list-inside">
                <li>Go to <code className="bg-black/30 px-2 py-1 rounded">/add-review</code></li>
                <li>Click "Open Camera" button</li>
                <li>Camera will work the same way!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="space-y-6">
            <div className="bg-red-500/20 border-2 border-red-500/50 rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <XCircle className="w-10 h-10 text-red-400 flex-shrink-0" />
                <div>
                  <h2 className="text-3xl font-bold text-red-300 mb-2">❌ Camera Blocked</h2>
                  {error === 'PERMISSION_DENIED_PREVIOUSLY' ? (
                    <p className="text-lg text-red-200">
                      Camera permission was previously denied. Browser will NOT ask again until you reset it.
                    </p>
                  ) : (
                    <p className="text-lg font-mono text-red-200 bg-red-900/30 p-3 rounded">{error}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4">🔧 Reset Permission to Get Browser Prompt:</h3>

              {(error.includes('NotAllowedError') || error.includes('Permission denied') || error === 'PERMISSION_DENIED_PREVIOUSLY') ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-2 border-orange-500 rounded-xl p-6">
                    <p className="text-2xl font-bold mb-4 text-orange-200">⚠️ BROWSER WILL NOT ASK FOR PERMISSION</p>
                    <p className="text-lg mb-4 text-orange-100">
                      You previously clicked "Block" or denied camera access.
                      Browser remembers this and will NOT show the permission prompt again.
                    </p>
                    <p className="text-xl font-bold text-orange-200">
                      You MUST manually reset the permission to make browser ask again:
                    </p>
                  </div>

                  <div className="bg-blue-900/50 border-2 border-blue-400 rounded-xl p-6">
                    <p className="text-2xl font-bold mb-4 text-blue-200">📍 LOOK HERE → TOP-LEFT OF BROWSER</p>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <p className="text-xl font-bold mb-3 text-white">Step 1: Find the Icon in Address Bar</p>
                      <p className="text-lg text-gray-200 mb-2">At the VERY TOP of your browser window, in the address bar, you'll see ONE of these icons on the LEFT side:</p>
                      <div className="flex gap-4 justify-center my-4">
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-5xl mb-2">🔒</div>
                          <p className="text-sm">Lock Icon</p>
                          <p className="text-xs text-gray-400">(Most Common)</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-5xl mb-2">🎥</div>
                          <p className="text-sm">Camera Icon</p>
                          <p className="text-xs text-gray-400">(Sometimes)</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-5xl mb-2">⚠️</div>
                          <p className="text-sm">Warning Icon</p>
                          <p className="text-xs text-gray-400">(If Blocked)</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-xl font-bold mb-3 text-white">Step 2: Click the Icon</p>
                      <ol className="space-y-3 text-lg list-decimal list-inside text-gray-200">
                        <li><strong>CLICK</strong> the 🔒 or 🎥 or ⚠️ icon</li>
                        <li>A dropdown menu will appear</li>
                        <li>Find <strong>"Camera"</strong> in the list</li>
                        <li>It probably says <span className="bg-red-600 px-2 py-1 rounded">Block</span> or <span className="bg-red-600 px-2 py-1 rounded">Deny</span></li>
                        <li><strong>CLICK on it</strong> and select <span className="bg-green-600 px-2 py-1 rounded font-bold">Allow</span></li>
                        <li>The dropdown will close automatically</li>
                        <li>Click <strong>"Try Again"</strong> button below</li>
                      </ol>
                    </div>
                  </div>

                  <div className="bg-purple-900/50 border-2 border-purple-400 rounded-xl p-6">
                    <p className="text-xl font-bold mb-3 text-purple-200">🔍 Can't Find the Icon?</p>
                    <div className="space-y-3 text-base text-purple-100">
                      <p><strong>Chrome/Edge:</strong> Look at the LEFT side of the address bar, before the URL</p>
                      <p><strong>Firefox:</strong> Look at the LEFT side of the address bar, click the 🔒 icon, then click &quot;&gt;&quot; arrow</p>
                      <p><strong>Safari:</strong> Go to Safari menu → Settings → Websites → Camera → Allow this site</p>
                      <p className="text-lg font-bold text-purple-200 mt-4">Still can't find it? Press F12, look at Console tab, it might show you where to click.</p>
                    </div>
                  </div>
                </div>
              ) : error.includes('NotFoundError') ? (
                <div className="space-y-3">
                  <p className="text-xl font-bold">No camera detected on your device.</p>
                  <p className="text-lg">Make sure:</p>
                  <ul className="space-y-2 text-lg list-disc list-inside">
                    <li>Camera is connected (if external USB camera)</li>
                    <li>Camera is enabled in device manager</li>
                    <li>No other app is using the camera</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-lg">Unexpected error. Try:</p>
                  <ul className="space-y-2 text-lg list-disc list-inside">
                    <li>Closing other apps using camera</li>
                    <li>Refreshing this page</li>
                    <li>Using a different browser</li>
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={testCamera}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-6 rounded-xl flex items-center justify-center gap-3 text-2xl transition-all"
            >
              <RefreshCw className="w-8 h-8" />
              Try Again
            </button>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <p className="text-lg text-gray-300 text-center">
                Read the full guide: <code className="bg-black/30 px-2 py-1 rounded">FINAL_CAMERA_SOLUTION.md</code>
              </p>
            </div>
          </div>
        )}

        {/* Info */}
        {!stream && !error && !testing && (
          <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-3">ℹ️ What This Page Does:</h3>
            <p className="text-lg text-gray-300">
              This page tests ONLY camera access - nothing else. If camera works here,
              it will work in the main application. This helps you verify everything
              is set up correctly before your demo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
