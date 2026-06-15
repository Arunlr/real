import { useState, useEffect } from 'react';
import { Camera, Image, MessageSquare, CheckCircle, XCircle, AlertTriangle, Shield, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Permission {
  name: string;
  key: 'camera' | 'media' | 'notifications';
  icon: typeof Camera;
  description: string;
  status: 'granted' | 'denied' | 'pending';
  required: boolean;
}

interface PermissionsManagerProps {
  onComplete: (allGranted: boolean) => void;
  autoShow?: boolean;
}

export function PermissionsManager({ onComplete, autoShow = true }: PermissionsManagerProps) {
  const [isOpen, setIsOpen] = useState(autoShow);
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      name: 'Camera Access',
      key: 'camera',
      icon: Camera,
      description: 'Required to capture photos with GPS location and timestamp for verification',
      status: 'pending',
      required: true,
    },
    {
      name: 'Media Library',
      key: 'media',
      icon: Image,
      description: 'Access your photo library to upload images with EXIF metadata',
      status: 'pending',
      required: true,
    },
    {
      name: 'Notifications',
      key: 'notifications',
      icon: MessageSquare,
      description: 'Receive alerts for verification tasks and reward notifications',
      status: 'pending',
      required: false,
    },
  ]);

  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check existing permissions on mount
    checkExistingPermissions();
  }, []);

  const checkExistingPermissions = async () => {
    const updatedPermissions = [...permissions];

    // Check camera permission
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        updatedPermissions[0].status = 'denied';
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        updatedPermissions[0].status = 'granted';
      }
    } catch (error) {
      // Silently fail - camera might not be available or permission not granted
      updatedPermissions[0].status = 'pending';
    }

    // Check notification permission
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        updatedPermissions[2].status = 'granted';
      } else if (Notification.permission === 'denied') {
        updatedPermissions[2].status = 'denied';
      }
    }

    setPermissions(updatedPermissions);

    // Auto-complete if all required permissions are granted
    const allRequiredGranted = updatedPermissions
      .filter(p => p.required)
      .every(p => p.status === 'granted');
    
    if (allRequiredGranted && !autoShow) {
      onComplete(true);
    }
  };

  const requestCameraPermission = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.info('Camera API not supported in this browser');
        updatePermissionStatus('camera', 'denied');
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false 
      });
      stream.getTracks().forEach(track => track.stop());
      
      updatePermissionStatus('camera', 'granted');
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          console.info('No camera device found');
        } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          console.info('Camera permission denied by user');
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          console.info('Camera is currently in use');
        } else {
          console.info('Camera access error:', error.name);
        }
      }
      updatePermissionStatus('camera', 'denied');
      return false;
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      updatePermissionStatus('notifications', 'denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      updatePermissionStatus('notifications', permission === 'granted' ? 'granted' : 'denied');
      return permission === 'granted';
    } catch {
      updatePermissionStatus('notifications', 'denied');
      return false;
    }
  };

  const updatePermissionStatus = (key: string, status: 'granted' | 'denied' | 'pending') => {
    setPermissions(prev =>
      prev.map(p => (p.key === key ? { ...p, status } : p))
    );
  };

  const requestAllPermissions = async () => {
    setIsCheckingPermissions(true);
    
    // Request camera
    setCurrentStep(0);
    await new Promise(resolve => setTimeout(resolve, 500));
    await requestCameraPermission();
    
    // Media library is automatically granted (browser handles file picker)
    setCurrentStep(1);
    await new Promise(resolve => setTimeout(resolve, 500));
    updatePermissionStatus('media', 'granted');
    
    // Request notifications
    setCurrentStep(2);
    await new Promise(resolve => setTimeout(resolve, 500));
    await requestNotificationPermission();
    
    setIsCheckingPermissions(false);
    
    // Check if all required permissions granted
    const allRequiredGranted = permissions
      .filter(p => p.required)
      .every(p => p.status === 'granted');
    
    if (allRequiredGranted) {
      setTimeout(() => {
        setIsOpen(false);
        onComplete(true);
      }, 1000);
    }
  };

  const handleSkipOptional = () => {
    const allRequiredGranted = permissions
      .filter(p => p.required)
      .every(p => p.status === 'granted');
    
    if (allRequiredGranted) {
      setIsOpen(false);
      onComplete(true);
    }
  };

  const allRequiredGranted = permissions
    .filter(p => p.required)
    .every(p => p.status === 'granted');

  const anyDenied = permissions.some(p => p.required && p.status === 'denied');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative max-w-2xl w-full"
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 blur-3xl rounded-3xl"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />

            <div className="relative bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 border-2 border-white/20 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-600 to-red-600 rounded-2xl mb-4 shadow-xl"
                >
                  <Shield className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-3xl font-black text-white mb-3">
                  <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Verification Permissions
                  </span>
                </h2>
                <p className="text-gray-300 text-lg">
                  To ensure authentic verification, we need access to:
                </p>
              </div>

              {/* Security Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-200 font-semibold mb-1">
                      🔒 Your Privacy is Protected
                    </p>
                    <p className="text-xs text-blue-300 leading-relaxed">
                      We only access metadata (GPS & timestamp) from your photos. Your images are processed locally and we never access other files without your explicit consent.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Permissions List */}
              <div className="space-y-4 mb-8">
                {permissions.map((permission, index) => {
                  const Icon = permission.icon;
                  const isActive = isCheckingPermissions && currentStep === index;

                  return (
                    <motion.div
                      key={permission.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`
                        relative bg-white/5 backdrop-blur-sm border rounded-xl p-5 transition-all
                        ${isActive ? 'border-pink-500/50 bg-pink-500/10' : 'border-white/10'}
                        ${permission.status === 'granted' ? 'border-green-500/50 bg-green-500/10' : ''}
                        ${permission.status === 'denied' ? 'border-red-500/50 bg-red-500/10' : ''}
                      `}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                          ${permission.status === 'granted' ? 'bg-green-500/20' : ''}
                          ${permission.status === 'denied' ? 'bg-red-500/20' : ''}
                          ${permission.status === 'pending' ? 'bg-gray-500/20' : ''}
                        `}>
                          <Icon className={`w-6 h-6 ${
                            permission.status === 'granted' ? 'text-green-400' : 
                            permission.status === 'denied' ? 'text-red-400' : 
                            'text-gray-400'
                          }`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-white">
                              {permission.name}
                            </h3>
                            {permission.required && (
                              <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs font-bold rounded-full">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {permission.description}
                          </p>
                        </div>

                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {permission.status === 'granted' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring" }}
                            >
                              <CheckCircle className="w-8 h-8 text-green-400" />
                            </motion.div>
                          )}
                          {permission.status === 'denied' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring" }}
                            >
                              <XCircle className="w-8 h-8 text-red-400" />
                            </motion.div>
                          )}
                          {permission.status === 'pending' && isActive && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Warning if denied */}
              {anyDenied && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-200 font-semibold mb-1">
                        Permission Denied
                      </p>
                      <p className="text-xs text-red-300 leading-relaxed mb-2">
                        Some required permissions were denied. To enable verification features, please allow these permissions in your browser settings.
                      </p>
                      <button
                        onClick={requestAllPermissions}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!allRequiredGranted ? (
                  <button
                    onClick={requestAllPermissions}
                    disabled={isCheckingPermissions}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-bold shadow-lg shadow-pink-600/30 hover:shadow-xl hover:shadow-pink-600/50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {isCheckingPermissions ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Requesting Permissions...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Grant Permissions
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleSkipOptional}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/50 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Continue to Verification
                  </button>
                )}
              </div>

              {/* Help Text */}
              <p className="text-xs text-gray-400 text-center mt-4">
                By granting these permissions, you agree to share location and timestamp data for verification purposes only.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}