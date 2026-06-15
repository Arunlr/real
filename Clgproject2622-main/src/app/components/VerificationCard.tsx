import { motion } from 'motion/react';
import { TrustBadge, getTrustLevel } from './TrustBadge';
import { MapPin, Calendar, Camera, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface VerificationCardProps {
  verifier: {
    name: string;
    trustScore: number;
    totalVerifications: number;
  };
  location: {
    name: string;
    coordinates: string;
  };
  timestamp: Date;
  media: {
    photos: number;
    videos: number;
  };
  status: 'verified' | 'pending' | 'rejected';
  completeness: number; // 0-100
  freshness: 'fresh' | 'recent' | 'old';
}

export function VerificationCard({ verifier, location, timestamp, media, status, completeness, freshness }: VerificationCardProps) {
  const trustLevel = getTrustLevel(verifier.trustScore);

  const freshnessConfig = {
    fresh: { label: 'Fresh', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    recent: { label: 'Recent', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    old: { label: 'Old', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  };

  const statusConfig = {
    verified: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    rejected: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  };

  const StatusIcon = statusConfig[status].icon;
  const freshnessStyle = freshnessConfig[freshness];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-pink-300 transition-all"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-pink-50 to-red-50 border-b border-pink-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-red-600 flex items-center justify-center text-white font-bold">
              {verifier.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{verifier.name}</p>
              <p className="text-xs text-gray-500">{verifier.totalVerifications} verifications</p>
            </div>
          </div>
          <TrustBadge level={trustLevel} score={verifier.trustScore} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Location */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{location.name}</p>
            <p className="text-xs text-gray-500">{location.coordinates}</p>
          </div>
        </div>

        {/* Timestamp & Freshness */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{timestamp.toLocaleDateString()}</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${freshnessStyle.bg} ${freshnessStyle.color} border ${freshnessStyle.border}`}>
            {freshnessStyle.label}
          </div>
        </div>

        {/* Media Count */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Camera className="w-4 h-4 text-pink-600" />
            <span>{media.photos} photos</span>
          </div>
          {media.videos > 0 && (
            <div className="flex items-center gap-1 text-gray-600">
              <span>📹</span>
              <span>{media.videos} videos</span>
            </div>
          )}
        </div>

        {/* Completeness Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Completeness</span>
            <span className="font-medium text-gray-900">{completeness}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completeness}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full ${
                completeness >= 80
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : completeness >= 50
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600'
                  : 'bg-gradient-to-r from-red-500 to-orange-600'
              }`}
            />
          </div>
        </div>

        {/* Status */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statusConfig[status].bg}`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig[status].color}`} />
          <span className={`text-sm font-medium ${statusConfig[status].color} capitalize`}>
            {status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
