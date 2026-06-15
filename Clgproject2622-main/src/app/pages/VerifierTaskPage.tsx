import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PhotoUploadWithLocation } from '../components/PhotoUploadWithLocation';
import { PermissionsManager } from '../components/PermissionsManager';
import { 
  ArrowLeft, CheckCircle, Camera, MapPin, Clock, AlertCircle, 
  Zap, Award, Shield, ChevronRight, Info, Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  photoFile: File | null;
  photoLocation: GeolocationCoordinates | null;
}

export function VerifierTaskPage() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Mock task data
  const taskData = {
    id: taskId,
    placeName: 'The Grand Bangalore Hotel',
    type: 'Hotel',
    address: 'MG Road, Bangalore, Karnataka 560001',
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      name: 'The Grand Bangalore Hotel',
    },
    credits: 150,
    deadline: '2 hours',
    requesterName: 'Arjun Sharma',
    requesterNote: 'Looking to relocate to Bangalore for work. Need detailed photos of hotel rooms and amenities.',
  };

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: '1',
      label: 'Hotel Exterior',
      description: 'Front view of the hotel building showing signage',
      completed: false,
      photoFile: null,
      photoLocation: null,
    },
    {
      id: '2',
      label: 'Reception Area',
      description: 'Clear view of lobby and reception desk',
      completed: false,
      photoFile: null,
      photoLocation: null,
    },
    {
      id: '3',
      label: 'Sample Room',
      description: 'Inside view of a standard room',
      completed: false,
      photoFile: null,
      photoLocation: null,
    },
    {
      id: '4',
      label: 'Amenities',
      description: 'Gym, pool, or other facilities',
      completed: false,
      photoFile: null,
      photoLocation: null,
    },
    {
      id: '5',
      label: 'Parking Area',
      description: 'Parking availability and security',
      completed: false,
      photoFile: null,
      photoLocation: null,
    },
  ]);

  const [notes, setNotes] = useState('');

  const handlePhotoChange = (
    itemId: string,
    file: File | null,
    coordinates: GeolocationCoordinates | null
  ) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              completed: file !== null && coordinates !== null,
              photoFile: file,
              photoLocation: coordinates,
            }
          : item
      )
    );
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progress = (completedCount / totalCount) * 100;
  const canSubmit = completedCount === totalCount && notes.length >= 20;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      // Provide specific feedback about what's missing
      const missingItems = checklist.filter(item => !item.completed);
      if (missingItems.length > 0) {
        toast.error(`Please complete ${missingItems.length} more checklist item(s)`, {
          description: missingItems.map(item => item.label).join(', ')
        });
      } else if (notes.length < 20) {
        toast.error('Additional notes required', {
          description: `Please add at least ${20 - notes.length} more character(s) to your notes`
        });
      }
      return;
    }

    // Check permissions before submitting
    if (!permissionsGranted) {
      setShowPermissionsModal(true);
      return;
    }

    // Proceed with submission
    proceedWithSubmission();
  };

  const proceedWithSubmission = () => {
    setIsSubmitting(true);
    toast.success('Submitting verification...');

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const handlePermissionsComplete = (allGranted: boolean) => {
    setPermissionsGranted(allGranted);
    setShowPermissionsModal(false);
    
    if (allGranted) {
      // Permissions granted, proceed with submission
      proceedWithSubmission();
    } else {
      // Permissions denied
      toast.error('Permissions Required', {
        description: 'Camera and location access are required to submit task verification'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate('/verifier/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </button>

            {/* Task Header Card */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg text-2xl">
                      🏨
                    </div>
                    <div>
                      <h1 className="text-2xl font-black text-white">{taskData.placeName}</h1>
                      <p className="text-emerald-300 font-semibold">{taskData.type} Verification</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      {taskData.address}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Clock className="w-4 h-4 text-amber-400" />
                      Deadline: {taskData.deadline}
                    </div>
                  </div>

                  {/* Requester Info */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                    <p className="text-xs text-blue-300 font-semibold mb-1">
                      📋 Requester: {taskData.requesterName}
                    </p>
                    <p className="text-xs text-gray-300">{taskData.requesterNote}</p>
                  </div>
                </div>

                {/* Credits Badge */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl px-4 py-3 text-center shadow-lg">
                  <div className="text-3xl font-black text-white">₹{taskData.credits}</div>
                  <div className="text-xs text-emerald-100 font-semibold">Credits</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">
                    Progress: {completedCount}/{totalCount} completed
                  </span>
                  <span className="text-sm font-bold text-emerald-400">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* GPS Verification Notice */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/40 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-300 mb-2">🛡️ GPS & Timestamp Verification Active</h3>
                <p className="text-sm text-amber-100 leading-relaxed mb-2">
                  All photos must be taken at the location with GPS coordinates and timestamp metadata enabled. Our AI will automatically verify:
                </p>
                <ul className="space-y-1.5 text-xs text-amber-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>You are within 100 meters of the target location</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Photos contain EXIF GPS tags and timestamps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Images were taken recently (within 24 hours)</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Verification Form */}
          <form onSubmit={handleSubmit}>
            {/* Checklist */}
            <div className="space-y-4 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Camera className="w-6 h-6 text-emerald-400" />
                Verification Checklist
              </h2>

              {checklist.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border rounded-2xl p-6 transition-all ${
                    item.completed
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    {/* Status Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        item.completed
                          ? 'bg-emerald-500/20 border-2 border-emerald-500'
                          : 'bg-white/10 border-2 border-white/20'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <span className="text-white font-bold">{index + 1}</span>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{item.label}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <PhotoUploadWithLocation
                    label="Upload Photo"
                    helperText="Photo will be verified with GPS location"
                    size="lg"
                    required={true}
                    expectedLocation={taskData.location}
                    maxDistance={100}
                    onImageChange={(file, coordinates) =>
                      handlePhotoChange(item.id, file, coordinates)
                    }
                  />
                </motion.div>
              ))}
            </div>

            {/* Additional Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-400" />
                Additional Notes
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share any additional observations about the location, condition, or special features..."
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-white placeholder-gray-400"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-gray-400">Minimum 20 characters</p>
                <p
                  className={`text-sm font-semibold ${
                    notes.length >= 20 ? 'text-emerald-400' : 'text-gray-400'
                  }`}
                >
                  {notes.length}/20
                </p>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <button
                type="button"
                onClick={() => navigate('/verifier/dashboard')}
                className="px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
              >
                Save Draft
              </button>

              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Submit Verification
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>

            {!canSubmit && (
              <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                <p className="text-sm text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Complete all checklist items and add notes (min 20 characters) to submit
                </p>
              </div>
            )}
          </form>
        </div>
      </div>

      <Footer />

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/verifier/dashboard');
            }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="relative max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-green-500/30 blur-3xl rounded-3xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              <div className="relative bg-gradient-to-br from-gray-900/95 via-emerald-900/95 to-gray-900/95 backdrop-blur-2xl border-2 border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 blur-2xl rounded-full opacity-50"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl">
                      <CheckCircle className="w-14 h-14 text-white" strokeWidth={3} />
                    </div>
                  </div>
                </motion.div>

                {/* Success Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-4xl font-black text-white mb-3">
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
                      Verification Complete!
                    </span>
                  </h2>
                  <p className="text-lg text-gray-300 mb-2">
                    Task submitted successfully with GPS & timestamp verification
                  </p>
                  <p className="text-sm text-gray-400">
                    Your submission is being reviewed and credits will be awarded shortly
                  </p>
                </motion.div>

                {/* Credits Earned */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border-2 border-emerald-500/40 rounded-2xl p-6 mb-6"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
                      className="text-6xl font-black mb-2"
                    >
                      <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300 bg-clip-text text-transparent">
                        +₹{taskData.credits}
                      </span>
                    </motion.div>
                    <p className="text-lg font-bold text-emerald-300">Credits Earned!</p>
                  </div>
                </motion.div>

                {/* Action Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/verifier/dashboard');
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/50 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Back to Dashboard
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permissions Modal */}
      {showPermissionsModal && (
        <PermissionsManager
          onComplete={handlePermissionsComplete}
          autoShow={true}
        />
      )}
    </div>
  );
}