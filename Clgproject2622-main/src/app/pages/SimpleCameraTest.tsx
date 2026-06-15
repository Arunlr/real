import { useState, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Camera, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function SimpleCameraTest() {
  const [step, setStep] = useState(1);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    setError('');
    setStep(2);
    
    try {
      console.log('Requesting camera access...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      console.log('Camera access granted!');
      setStream(mediaStream);
      setStep(3);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      
      let errorMsg = '';
      
      if (err.name === 'NotAllowedError') {
        errorMsg = `❌ You clicked "Block" or "Deny"\n\n📍 SOLUTION:\n1. Look at the address bar (top of browser)\n2. Click the 🔒 lock icon or 🎥 camera icon\n3. Find "Camera" permission\n4. Change from "Block" to "Allow"\n5. Click the button below to try again`;
      } else if (err.name === 'NotFoundError') {
        errorMsg = `❌ No camera found on this device\n\n📍 SOLUTION:\nUse "Upload File" button instead, or try Demo Mode`;
      } else if (err.name === 'NotReadableError') {
        errorMsg = `❌ Camera is being used by another app\n\n📍 SOLUTION:\n1. Close other apps (Zoom, Skype, etc.)\n2. Close other browser tabs\n3. Try again`;
      } else if (err.name === 'SecurityError' || err.name === 'NotSupportedError') {
        errorMsg = `❌ Browser blocks camera (not HTTPS)\n\n📍 SOLUTION:\nUse Demo Mode - camera won't work without HTTPS`;
      } else {
        errorMsg = `❌ Error: ${err.name}\n${err.message}\n\n📍 SOLUTION:\nTry Demo Mode instead`;
      }

      setError(errorMsg);
      setStep(4);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setStep(1);
  };

  const resetAndRetry = () => {
    stopCamera();
    setError('');
    setStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <div className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Camera className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">
              Simple Camera Test
            </h1>
            <p className="text-xl text-blue-200">
              Let's get your camera working in 3 simple steps
            </p>
          </div>

          {/* Step 1: Ready */}
          {step === 1 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">1️⃣</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ready to Test Camera
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  When you click the button below, your browser will ask for camera permission.
                </p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
                <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important: What to do when browser asks
                </h3>
                <div className="space-y-3 text-sm text-yellow-800">
                  <div className="flex items-start gap-2">
                    <span className="font-bold">✅</span>
                    <span>A popup will appear at the top of your browser</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold">✅</span>
                    <span>Click <strong>"Allow"</strong> or <strong>"Yes"</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold">❌</span>
                    <span>Do NOT click "Block" or "Deny"</span>
                  </div>
                </div>
              </div>

              <button
                onClick={startCamera}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 rounded-2xl text-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
              >
                <Camera className="w-8 h-8" />
                Start Camera Test
              </button>

              <div className="text-center pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">
                  Camera not working? Don't worry!
                </p>
                <a
                  href="/demo/location-upload"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-all"
                >
                  ✨ Use Demo Mode Instead
                </a>
              </div>
            </div>
          )}

          {/* Step 2: Waiting for Permission */}
          {step === 2 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-4xl">⏳</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Waiting for Your Response...
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Look at the <strong>top of your browser</strong> for the permission popup
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 mb-4 text-center text-lg">
                  👆 Click "Allow" in the popup above 👆
                </h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <p><strong>Chrome/Edge:</strong> "Allow app-...makeproxy...figma.site to use your camera? [Block] [Allow]"</p>
                  <p><strong>Firefox:</strong> "Share your camera? [Don't Allow] [Allow]"</p>
                  <p><strong>Safari:</strong> "Allow camera access? [Don't Allow] [Allow]"</p>
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-red-900 mb-2">
                  Don't see a popup?
                </p>
                <p className="text-sm text-red-700">
                  Look for a 🔒 or 🎥 icon in the address bar and click it
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && stream && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-green-600 mb-4">
                  🎉 Camera Working!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Your camera is now active. You can see yourself below:
                </p>
              </div>

              <div className="bg-black rounded-2xl overflow-hidden shadow-xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-video"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={stopCamera}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all"
                >
                  Stop Camera
                </button>
                <a
                  href="/demo/location-upload"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all text-center"
                >
                  Use in App →
                </a>
              </div>

              <div className="bg-green-50 border border-green-300 rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-green-900">
                  ✅ Perfect! Your camera is working. Now you can use photo upload features.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Error */}
          {step === 4 && error && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-red-600 mb-4">
                  Camera Access Failed
                </h2>
              </div>

              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
                <pre className="whitespace-pre-wrap text-sm text-red-900 font-semibold">
                  {error}
                </pre>
              </div>

              {error.includes('You clicked "Block"') && (
                <div className="bg-orange-100 border-2 border-orange-400 rounded-xl p-6">
                  <h3 className="font-bold text-orange-900 mb-3 text-lg">
                    🔧 Step-by-Step Fix:
                  </h3>
                  <ol className="list-decimal ml-5 space-y-2 text-sm text-orange-900">
                    <li>Look at the very top of your browser (the address bar)</li>
                    <li>Find the <strong>🔒 lock icon</strong> or <strong>🎥 camera icon</strong></li>
                    <li>Click on it</li>
                    <li>You'll see "Camera: Blocked" or similar</li>
                    <li>Click on it and change to <strong>"Allow"</strong></li>
                    <li>Close that popup</li>
                    <li>Click "Try Again" button below</li>
                  </ol>
                </div>
              )}

              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
                <h3 className="font-bold mb-4 text-xl text-center">
                  🎯 EXACT STEPS TO UNBLOCK CAMERA:
                </h3>
                
                <div className="space-y-4 bg-white/10 rounded-lg p-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="font-bold mb-2">CHROME / EDGE / BRAVE:</p>
                    <ol className="list-decimal ml-5 space-y-1 text-sm">
                      <li>Look at the TOP LEFT of your browser (where the URL is)</li>
                      <li>Click the 🔒 lock icon (or 🎥 camera icon with X on it)</li>
                      <li>Click "Site settings" button</li>
                      <li>Find "Camera" in the list</li>
                      <li>Change dropdown from "Block" to "Allow"</li>
                      <li>Close that tab</li>
                      <li>Click "Try Again" below</li>
                    </ol>
                  </div>

                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="font-bold mb-2">FIREFOX:</p>
                    <ol className="list-decimal ml-5 space-y-1 text-sm">
                      <li>Look at the TOP LEFT of your browser (in the address bar)</li>
                      <li>Click the 🔒 lock icon or ⓘ info icon</li>
                      <li>Click the {">"} arrow next to "Permissions" or "Blocked Temporary"</li>
                      <li>Find "Use the Camera"</li>
                      <li>Click "X" to remove the block, or select "Allow"</li>
                      <li>Close that panel</li>
                      <li>Click "Try Again" below</li>
                    </ol>
                  </div>

                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="font-bold mb-2">SAFARI:</p>
                    <ol className="list-decimal ml-5 space-y-1 text-sm">
                      <li>Click "Safari" in the top menu bar</li>
                      <li>Select "Settings for This Website"</li>
                      <li>Find "Camera" dropdown</li>
                      <li>Change from "Deny" to "Allow"</li>
                      <li>Close that menu</li>
                      <li>Click "Try Again" below</li>
                    </ol>
                  </div>
                </div>

                <div className="mt-4 bg-yellow-400 text-yellow-900 rounded-lg p-4 text-center font-bold">
                  ⚠️ After changing settings, you MUST click "Try Again" button!
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={resetAndRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all"
                >
                  🔄 Try Again
                </button>
                
                <a
                  href="/diagnostics"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all text-center"
                >
                  🔍 Full Diagnostics
                </a>

                <a
                  href="/demo/location-upload"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all text-center"
                >
                  ✨ Use Demo Mode (No Camera Needed)
                </a>
              </div>

              <div className="bg-purple-50 border border-purple-300 rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-purple-900">
                  💡 Tip: Demo Mode works perfectly without any camera - try it!
                </p>
              </div>
            </div>
          )}

          {/* Always show quick links */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/diagnostics"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-4 rounded-xl text-center transition-all"
            >
              🔍 Diagnostics
            </a>
            <a
              href="/demo/location-upload"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-4 rounded-xl text-center transition-all"
            >
              🎮 Demo Mode
            </a>
            <a
              href="/"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-4 rounded-xl text-center transition-all"
            >
              🏠 Home
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}