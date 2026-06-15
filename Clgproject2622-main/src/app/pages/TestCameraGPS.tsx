import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, MapPin, X } from 'lucide-react';

export function TestCameraGPS() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<string>('');
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const openCamera = async () => {
    setError(null);
    setStep('Opening camera...');

    try {
      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setStep('Camera opened! Click "Capture Photo" below.');

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      // Enumerate devices now that we have permission
      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputs = devices.filter(d => d.kind === 'videoinput');
      setVideoDevices(inputs);
      if (!selectedDeviceId && inputs.length > 0) {
        setSelectedDeviceId(inputs[0].deviceId);
      }
    } catch (err) {
      const error = err as Error;
      if (error.name === 'NotAllowedError') {
        setError('Camera permission denied. Click the 🔒 lock icon in your browser address bar, set Camera to "Allow", then refresh the page.');
      } else if (error.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else if (error.name === 'NotReadableError') {
        setError('Camera is in use by another app. Close other apps using the camera and try again.');
      } else {
        setError(`Camera error: ${error.message}`);
      }
      setStep('');
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setError(null);
    setStep('Capturing photo and GPS...');

    try {
      // Step 1: Capture photo from video
      console.log('📸 Step 2: Capturing photo from camera...');
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        console.log('✅ Photo captured!');

        // Step 2: Get GPS location
        console.log('📍 Step 3: Getting GPS location...');
        setStep('Photo captured! Getting GPS location...');

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        });

        console.log('✅ GPS location captured!');
        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
        console.log('Accuracy:', position.coords.accuracy, 'meters');

        setPhoto(photoData);
        setLocation(position.coords);
        setStep('✅ SUCCESS! Photo captured with GPS!');

        // Stop camera
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }

    } catch (err) {
      console.error('❌ Error:', err);
      const error = err as GeolocationPositionError;
      let errorMessage = 'Failed to capture';

      if (error.code === 1) {
        errorMessage = 'GPS permission denied. Click "Allow" for location.';
      } else if (error.code === 2) {
        errorMessage = 'GPS unavailable. Enable location services.';
      } else if (error.code === 3) {
        errorMessage = 'GPS timeout. Try again.';
      }

      setError(errorMessage);
      setStep('');
    }
  };

  const reset = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setPhoto(null);
    setLocation(null);
    setError(null);
    setStep('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3">📷 Camera + GPS Test</h1>
          <p className="text-xl text-gray-300">Core Feature Test: Camera with GPS Location</p>
        </div>

        {/* CRITICAL: Permission Reset Instructions */}
        {!stream && !photo && (
          <div className="bg-orange-500/20 border-4 border-orange-500 rounded-xl p-6 mb-6 animate-pulse">
            <h2 className="text-3xl font-bold text-orange-300 mb-4">⚠️ BEFORE YOU START</h2>
            <div className="bg-orange-900/40 rounded-lg p-4 space-y-3">
              <p className="text-lg text-orange-100 font-bold">
                If you see "Permission denied" error:
              </p>
              <ol className="text-base text-orange-100 space-y-2 ml-6 list-decimal">
                <li>
                  <strong>Look at the TOP-LEFT of your browser window</strong>
                  <br />
                  <span className="text-orange-200">Find the address bar where the URL is shown</span>
                </li>
                <li>
                  <strong>Click the 🔒 LOCK icon</strong> (or 🎥 camera icon)
                  <br />
                  <span className="text-orange-200">It's at the very LEFT of the address bar</span>
                </li>
                <li>
                  <strong>Find "Camera" in the dropdown menu</strong>
                  <br />
                  <span className="text-orange-200">Change from "Block" to "Allow"</span>
                </li>
                <li>
                  <strong>Find "Location" in the dropdown menu</strong>
                  <br />
                  <span className="text-orange-200">Change from "Block" to "Allow"</span>
                </li>
                <li>
                  <strong>Refresh this page</strong>
                  <br />
                  <span className="text-orange-200">Press F5 or click the refresh button</span>
                </li>
                <li>
                  <strong>Click "Open Camera" below</strong>
                  <br />
                  <span className="text-orange-200">Browser will now ask for permission - Click "Allow"</span>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Current Step */}
        {step && (
          <div className="bg-blue-500/20 border-2 border-blue-500 rounded-xl p-4 mb-6">
            <p className="text-lg font-bold text-blue-300">{step}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-red-300 mb-2">Error</h3>
                <p className="text-lg text-red-200 mb-4">{error}</p>

                {(error.includes('Camera') || error.includes('permission')) && (
                  <div className="bg-red-900/40 rounded-lg p-4 mb-4">
                    <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-3 mb-4">
                      <p className="text-yellow-200 font-mono text-sm">
                        WHERE TO LOOK:<br />
                        ┌────────────────────────────────────────┐<br />
                        │ 🔒 https://yourapp.com/test-camera-gps │ ← TOP of browser<br />
                        │  ↑                                     │<br />
                        │ CLICK HERE!                            │<br />
                        └────────────────────────────────────────┘
                      </p>
                    </div>
                    <p className="font-bold text-red-200 mb-3 text-xl">🔧 How to fix camera permission:</p>
                    <ol className="text-base text-red-100 space-y-2 ml-6 list-decimal">
                      <li>
                        <strong>Look at the TOP-LEFT of your browser window</strong>
                        <br />
                        <span className="text-sm">Find the address bar where the URL is shown</span>
                      </li>
                      <li>
                        <strong>Click the 🔒 LOCK icon</strong>
                        <br />
                        <span className="text-sm">It's at the very LEFT of the address bar (before the URL)</span>
                      </li>
                      <li>
                        <strong>A dropdown menu will appear</strong>
                        <br />
                        <span className="text-sm">Find "Camera" in this menu</span>
                      </li>
                      <li>
                        <strong>Change Camera from "Block" to "Allow"</strong>
                        <br />
                        <span className="text-sm">Click on it and select "Allow"</span>
                      </li>
                      <li>
                        <strong>Refresh this page</strong>
                        <br />
                        <span className="text-sm">Press F5 key or click browser refresh button</span>
                      </li>
                      <li>
                        <strong>Click "Open Camera" button again</strong>
                        <br />
                        <span className="text-sm">Browser will now show permission prompt - Click "Allow"</span>
                      </li>
                    </ol>
                  </div>
                )}

                {error.includes('GPS') && (
                  <div className="bg-red-900/40 rounded-lg p-4 mb-4">
                    <p className="font-bold text-red-200 mb-2">How to fix location permission:</p>
                    <ol className="text-sm text-red-200 space-y-1 ml-4 list-decimal">
                      <li>Click the 🔒 LOCK icon in address bar</li>
                      <li>Find "Location" and change to "Allow"</li>
                      <li>Try capturing photo again</li>
                    </ol>
                  </div>
                )}

                <button
                  onClick={reset}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Camera View */}
        {stream && !photo && (
          <div className="mb-6">
            <div className="bg-black rounded-2xl overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={capturePhoto}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-xl"
              >
                <Camera className="w-6 h-6" />
                Capture Photo + GPS
              </button>
              <button
                onClick={reset}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Camera selector + Open Button */}
        {!stream && !photo && (
          <div className="mb-6 space-y-3">
            {videoDevices.length > 1 && (
              <select
                value={selectedDeviceId}
                onChange={e => setSelectedDeviceId(e.target.value)}
                className="w-full bg-white/10 border border-white/30 text-white rounded-xl px-4 py-3 text-base"
              >
                {videoDevices.map((d, i) => (
                  <option key={d.deviceId} value={d.deviceId} className="text-black">
                    {d.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={openCamera}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-xl flex items-center justify-center gap-3 text-2xl"
            >
              <Camera className="w-8 h-8" />
              Open Camera
            </button>
          </div>
        )}

        {/* Success - Photo with GPS */}
        {photo && location && (
          <div className="space-y-6">
            {/* Success Banner */}
            <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-10 h-10 text-green-400" />
                <div>
                  <h2 className="text-3xl font-bold text-green-300">SUCCESS! ✅</h2>
                  <p className="text-lg text-green-200">Camera photo captured with GPS location!</p>
                </div>
              </div>
            </div>

            {/* Photo */}
            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Camera className="w-6 h-6" />
                Photo from Camera:
              </h3>
              <img src={photo} alt="Captured" className="w-full rounded-xl shadow-2xl" />
            </div>

            {/* GPS Data */}
            <div className="bg-blue-500/20 border-2 border-blue-500 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-400" />
                GPS Location:
              </h3>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Latitude:</p>
                  <p className="text-2xl font-mono text-blue-300">{location.latitude.toFixed(6)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Longitude:</p>
                  <p className="text-2xl font-mono text-blue-300">{location.longitude.toFixed(6)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Accuracy:</p>
                  <p className="text-2xl font-mono text-blue-300">{location.accuracy.toFixed(2)} meters</p>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <a
              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl text-center text-lg"
            >
              View Location on Google Maps
            </a>

            {/* Reset */}
            <button
              onClick={reset}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl"
            >
              Test Again
            </button>
          </div>
        )}

        {/* Canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Instructions */}
        {!stream && !photo && !error && (
          <div className="bg-white/5 border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">📋 What This Tests:</h3>
            <ul className="space-y-2 text-gray-300 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Camera access (browser permission)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Photo capture from live camera</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>GPS location capture (browser permission)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Combining photo + GPS data</span>
              </li>
            </ul>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm text-yellow-200">
                <strong>Note:</strong> Browser will ask for TWO permissions:
              </p>
              <ol className="text-sm text-yellow-200 mt-2 ml-4 list-decimal space-y-1">
                <li>Camera permission - Click "Allow" when asked</li>
                <li>Location permission - Click "Allow" when asked</li>
              </ol>
            </div>
          </div>
        )}

        {/* Console Info */}
        <div className="mt-6 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <p className="text-sm text-gray-400">
            <strong>Debug:</strong> Press F12 to see detailed console logs
          </p>
        </div>
      </div>
    </div>
  );
}
