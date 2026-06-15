import { motion } from 'motion/react';
import { TrustLevel, getTrustLevel } from './TrustBadge';
import { Shield, TrendingUp, TrendingDown } from 'lucide-react';

interface TrustScoreMeterProps {
  score: number;
  previousScore?: number;
  showDetails?: boolean;
}

export function TrustScoreMeter({ score, previousScore, showDetails = true }: TrustScoreMeterProps) {
  const level = getTrustLevel(score);
  const change = previousScore ? score - previousScore : 0;

  const getLevelColor = (lvl: TrustLevel) => {
    switch (lvl) {
      case 'new':
        return 'from-gray-400 to-gray-500';
      case 'verified':
        return 'from-blue-500 to-blue-600';
      case 'trusted':
        return 'from-purple-500 to-purple-600';
      case 'elite':
        return 'from-amber-500 to-amber-600';
    }
  };

  const getNextLevelThreshold = () => {
    if (score < 21) return 21;
    if (score < 51) return 51;
    if (score < 81) return 81;
    return 100;
  };

  const nextThreshold = getNextLevelThreshold();
  const previousThreshold = score < 21 ? 0 : score < 51 ? 21 : score < 81 ? 51 : 81;
  const progressInLevel = ((score - previousThreshold) / (nextThreshold - previousThreshold)) * 100;

  return (
    <div className="space-y-3">
      {/* Score Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className={`w-8 h-8 bg-gradient-to-r ${getLevelColor(level)} bg-clip-text text-transparent`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{score}</span>
              <span className="text-sm text-gray-500">/ 100</span>
              {change !== 0 && (
                <span
                  className={`text-xs flex items-center gap-1 ${
                    change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(change)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">Trust Score</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Current Level Progress</span>
          {score < 100 && <span>{nextThreshold - score} points to next level</span>}
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressInLevel}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${getLevelColor(level)} relative`}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-30"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Level Milestones */}
      {showDetails && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { level: 'new', min: 0, max: 20, label: 'New' },
            { level: 'verified', min: 21, max: 50, label: 'Verified' },
            { level: 'trusted', min: 51, max: 80, label: 'Trusted' },
            { level: 'elite', min: 81, max: 100, label: 'Elite' },
          ].map((milestone) => {
            const isActive = score >= milestone.min;
            const isCurrent = score >= milestone.min && score <= milestone.max;
            const milestoneLevel = milestone.level as TrustLevel;

            return (
              <div
                key={milestone.level}
                className={`text-center p-2 rounded-lg border-2 transition-all ${
                  isCurrent
                    ? `border-gradient-to-r ${getLevelColor(milestoneLevel)} bg-gradient-to-r ${getLevelColor(milestoneLevel)} bg-opacity-10`
                    : isActive
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-gray-200 bg-white opacity-50'
                }`}
              >
                <div className={`text-xs font-medium ${isCurrent ? 'text-purple-600' : 'text-gray-600'}`}>
                  {milestone.label}
                </div>
                <div className="text-xs text-gray-500">
                  {milestone.min}-{milestone.max}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
