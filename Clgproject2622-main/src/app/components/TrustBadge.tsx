import { motion } from 'motion/react';
import { Shield, Star, Award, Crown, Sparkles } from 'lucide-react';

export type TrustLevel = 'new' | 'verified' | 'trusted' | 'elite';

interface TrustBadgeProps {
  level: TrustLevel;
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  animated?: boolean;
}

const trustLevelConfig = {
  new: {
    label: 'New Local',
    icon: Shield,
    gradient: 'from-gray-400 to-gray-500',
    bgGradient: 'from-gray-50 to-gray-100',
    textColor: 'text-gray-700',
    iconColor: 'text-gray-600',
    range: '0-20',
  },
  verified: {
    label: 'Verified Local',
    icon: Star,
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-600',
    range: '21-50',
  },
  trusted: {
    label: 'Trusted Local',
    icon: Award,
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
    textColor: 'text-purple-700',
    iconColor: 'text-purple-600',
    range: '51-80',
  },
  elite: {
    label: 'Elite Local',
    icon: Crown,
    gradient: 'from-amber-500 to-amber-600',
    bgGradient: 'from-amber-50 to-amber-100',
    textColor: 'text-amber-700',
    iconColor: 'text-amber-600',
    range: '81-100',
  },
};

export function TrustBadge({ level, score, size = 'md', showScore = true, animated = true }: TrustBadgeProps) {
  const config = trustLevelConfig[level];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const badge = (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${config.bgGradient} border border-opacity-20 ${sizeClasses[size]}`}
    >
      <Icon className={`${iconSizes[size]} ${config.iconColor}`} />
      <span className={`font-medium ${config.textColor}`}>{config.label}</span>
      {showScore && (
        <span className={`${config.textColor} font-bold opacity-75`}>{score}</span>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {badge}
      </motion.div>
    );
  }

  return badge;
}

export function getTrustLevel(score: number): TrustLevel {
  if (score >= 81) return 'elite';
  if (score >= 51) return 'trusted';
  if (score >= 21) return 'verified';
  return 'new';
}
