import { AlertTriangle, Chrome, Lock, Settings, RefreshCw, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface PermissionResetGuideProps {
  onClose: () => void;
  onTryAgain: () => void;
}

export function PermissionResetGuide({ onClose, onTryAgain }: PermissionResetGuideProps) {
  const isHttps = window.location.protocol === 'https:';
  const currentUrl = window.location.href;

  // Detect browser
  const getBrowser = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'chrome';
    if (userAgent.includes('Edg')) return 'edge';
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'safari';
    return 'chrome'; // default
  };

  const browser = getBrowser();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative max-w-4xl w-full my-8 bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-3xl shadow-2xl border-2 border-white/20"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-t-3xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white mb-1">
                  Permission Popup Not Showing?
                </h2>
                <p className="text-white/90">
                  Your browser blocked the permission request. Follow these steps to fix it:
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* HTTPS Warning */}
          {!isHttps && (
            <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Lock className="w-8 h-8 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-red-300 mb-2">
                    🔒 CRITICAL: You're on HTTP (Not Secure)
                  </h3>
                  <p className="text-red-200 mb-4">
                    Camera and location access <strong>ONLY work on HTTPS</strong> (secure connection).
                  </p>
                  <div className="bg-red-600/30 rounded-lg p-4 mb-4">
                    <p className="text-sm text-red-100 font-semibold mb-2">Current URL:</p>
                    <code className="text-xs bg-black/30 text-red-200 px-3 py-2 rounded block break-all">
                      {currentUrl}
                    </code>
                  </div>
                  <p className="text-sm text-red-200">
                    <strong>Solutions:</strong>
                  </p>
                  <ul className="list-disc ml-5 text-sm text-red-200 space-y-1 mt-2">
                    <li>If developing locally, use <code className="bg-black/30 px-2 py-1 rounded">localhost</code> instead of IP address</li>
                    <li>Deploy to a hosting service with HTTPS (Vercel, Netlify, etc.)</li>
                    <li>Use <strong>Demo Mode</strong> to test without camera (see below)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Method 1: Address Bar (Easiest) */}
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-black text-xl">
                1
              </div>
              <h3 className="text-2xl font-black text-blue-300">
                🎯 METHOD 1: Address Bar (EASIEST & FASTEST)
              </h3>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold mb-2">Look at your browser's address bar (where the URL is):</p>
                    <div className="bg-gray-800 rounded-lg p-3 border-2 border-blue-400">
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">or</span>
                        <span className="text-2xl">🎥</span>
                        <span className="text-gray-400">or</span>
                        <span className="text-2xl">⚠️</span>
                        <span className="text-gray-300 ml-2">← Look for these icons on the LEFT side</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold mb-2">Click that icon. You'll see:</p>
                    {browser === 'chrome' || browser === 'edge' ? (
                      <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm text-gray-300">
                        <p>• Camera: <span className="text-red-400 font-bold">Blocked ❌</span></p>
                        <p>• Location: <span className="text-red-400 font-bold">Blocked ❌</span></p>
                        <p className="text-blue-300 font-bold mt-2">→ Click "Site settings"</p>
                      </div>
                    ) : browser === 'firefox' ? (
                      <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm text-gray-300">
                        <p>• Camera: <span className="text-red-400 font-bold">Blocked ❌</span></p>
                        <p>• Location: <span className="text-red-400 font-bold">Blocked ❌</span></p>
                        <p className="text-blue-300 font-bold mt-2">→ Click the "X" or "Clear" button next to each</p>
                      </div>
                    ) : (
                      <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm text-gray-300">
                        <p>• Camera: <span className="text-red-400 font-bold">Denied ❌</span></p>
                        <p>• Location: <span className="text-red-400 font-bold">Denied ❌</span></p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold mb-2">Change permissions to "Allow":</p>
                    <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
                      <p className="text-gray-300">• Camera → <span className="text-green-400 font-bold">Allow ✓</span></p>
                      <p className="text-gray-300">• Location → <span className="text-green-400 font-bold">Allow ✓</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold mb-2">Refresh the page and try again:</p>
                    <button
                      onClick={() => {
                        window.location.reload();
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Refresh Page Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Method 2: Browser Settings */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white font-black text-xl">
                2
              </div>
              <h3 className="text-2xl font-black text-purple-300">
                ⚙️ METHOD 2: Browser Settings (If Method 1 Fails)
              </h3>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
              {browser === 'chrome' || browser === 'edge' ? (
                <div className="space-y-3 text-white">
                  <p className="font-bold text-lg mb-3">For Chrome / Edge / Brave:</p>
                  <ol className="list-decimal ml-5 space-y-2 text-sm">
                    <li>Click the <strong>three dots (⋮)</strong> in top-right corner</li>
                    <li>Go to <strong>Settings</strong></li>
                    <li>Click <strong>Privacy and security</strong> in the left sidebar</li>
                    <li>Click <strong>Site Settings</strong></li>
                    <li>Click <strong>Camera</strong> and find this site in "Blocked" list</li>
                    <li>Click the site and change to <strong>"Allow"</strong></li>
                    <li>Go back and do the same for <strong>Location</strong></li>
                    <li><strong>Refresh this page</strong></li>
                  </ol>
                  <div className="mt-4 p-3 bg-purple-600/30 rounded-lg">
                    <p className="text-xs text-purple-200">
                      💡 <strong>Quick shortcut:</strong> Paste this in address bar: <code className="bg-black/30 px-2 py-1 rounded">chrome://settings/content</code>
                    </p>
                  </div>
                </div>
              ) : browser === 'firefox' ? (
                <div className="space-y-3 text-white">
                  <p className="font-bold text-lg mb-3">For Firefox:</p>
                  <ol className="list-decimal ml-5 space-y-2 text-sm">
                    <li>Click the <strong>hamburger menu (≡)</strong> in top-right corner</li>
                    <li>Go to <strong>Settings</strong></li>
                    <li>Click <strong>Privacy & Security</strong> in the left sidebar</li>
                    <li>Scroll to <strong>Permissions</strong> section</li>
                    <li>Click <strong>Settings</strong> button next to "Camera"</li>
                    <li>Find this website and click <strong>"Allow"</strong></li>
                    <li>Do the same for <strong>Location</strong></li>
                    <li><strong>Refresh this page</strong></li>
                  </ol>
                  <div className="mt-4 p-3 bg-purple-600/30 rounded-lg">
                    <p className="text-xs text-purple-200">
                      💡 <strong>Quick shortcut:</strong> Paste this in address bar: <code className="bg-black/30 px-2 py-1 rounded">about:preferences#privacy</code>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-white">
                  <p className="font-bold text-lg mb-3">For Safari (Mac):</p>
                  <ol className="list-decimal ml-5 space-y-2 text-sm">
                    <li>Click <strong>Safari</strong> menu in top bar</li>
                    <li>Select <strong>Settings for This Website...</strong></li>
                    <li>Change <strong>Camera</strong> to "Allow"</li>
                    <li>Change <strong>Location</strong> to "Allow"</li>
                    <li><strong>Refresh this page</strong></li>
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Method 3: Clear Site Data */}
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-400/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl">
                3
              </div>
              <h3 className="text-2xl font-black text-orange-300">
                🔄 METHOD 3: Clear Site Data & Start Fresh
              </h3>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
              <p className="text-white mb-4">
                This completely resets the site and clears the "denied" permission memory:
              </p>
              <ol className="list-decimal ml-5 space-y-2 text-sm text-white">
                <li><strong>Right-click</strong> anywhere on this page</li>
                <li>Select <strong>"Inspect"</strong> or press <kbd className="bg-gray-700 px-2 py-1 rounded">F12</kbd></li>
                <li>Click the <strong>"Application"</strong> tab (Chrome) or <strong>"Storage"</strong> tab (Firefox)</li>
                <li>Click <strong>"Clear site data"</strong> button</li>
                <li>Close the developer tools</li>
                <li><strong>Refresh the page</strong></li>
                <li>Try accessing camera again - popup should appear!</li>
              </ol>
            </div>
          </div>

          {/* Alternative: Demo Mode */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 border-4 border-white/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl">
                ✨
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-1">
                  Can't Fix Permissions? Use Demo Mode!
                </h3>
                <p className="text-white/90">
                  Test the entire app without needing camera or location permissions
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white font-bold mb-2">✅ Demo Mode includes:</p>
                <ul className="text-sm text-white/90 space-y-1">
                  <li>• Simulated camera photos</li>
                  <li>• Mock GPS coordinates</li>
                  <li>• Full verification flow</li>
                  <li>• No permissions needed!</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white font-bold mb-2">🎮 Perfect for:</p>
                <ul className="text-sm text-white/90 space-y-1">
                  <li>• Testing the app</li>
                  <li>• Development</li>
                  <li>• No camera available</li>
                  <li>• Quick demos</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  onClose();
                  // Demo mode will be triggered by the component
                }}
                className="flex-1 bg-white hover:bg-gray-100 text-purple-600 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg text-lg"
              >
                ✨ Use Demo Mode
              </button>
              <button
                onClick={onTryAgain}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Try Camera Again
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => window.open('/diagnostics', '_blank')}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Settings className="w-5 h-5" />
              Open Full Diagnostics
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
