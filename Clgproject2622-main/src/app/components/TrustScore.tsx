import { Shield, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface TrustScoreProps {
  score: number; // 0-100
}

export function TrustScore({ score }: TrustScoreProps) {
  const getLevel = () => {
    if (score >= 80) return { label: 'High Trust', color: 'green', icon: CheckCircle };
    if (score >= 60) return { label: 'Medium Trust', color: 'yellow', icon: AlertCircle };
    return { label: 'Low Trust', color: 'red', icon: XCircle };
  };

  const level = getLevel();
  const Icon = level.icon;

  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
      progress: 'bg-green-600',
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600',
      progress: 'bg-yellow-600',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      progress: 'bg-red-600',
    },
  };

  const colors = colorClasses[level.color];

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Shield className={`w-8 h-8 ${colors.icon} mr-3`} />
          <div>
            <h3 className="font-bold text-lg text-gray-900">Trust Score</h3>
            <p className="text-sm text-gray-600">AI-powered verification analysis</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${colors.text}`}>{score}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${colors.progress} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-center">
        <div className={`flex items-center ${colors.text} font-semibold`}>
          <Icon className={`w-5 h-5 mr-2 ${colors.icon}`} />
          {level.label}
        </div>
      </div>
    </div>
  );
}
