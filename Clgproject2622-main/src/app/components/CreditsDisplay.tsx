import { motion } from 'motion/react';
import { Coins, TrendingUp, Gift, Sparkles } from 'lucide-react';

interface CreditsDisplayProps {
  credits: number;
  earnedToday?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function CreditsDisplay({ credits, earnedToday = 0, size = 'md', showDetails = true }: CreditsDisplayProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Available Credits</p>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent`}
            >
              {credits.toLocaleString()}
            </motion.div>
          </div>
        </div>
        
        {earnedToday > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full"
          >
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">+{earnedToday} today</span>
          </motion.div>
        )}
      </div>

      {showDetails && (
        <div className="space-y-3 mt-4 pt-4 border-t border-purple-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-600" />
              Ways to use credits:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-3 border border-purple-100">
              <div className="text-xs text-gray-500">Request Verification</div>
              <div className="text-sm font-medium text-gray-700">50-100 credits</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-100">
              <div className="text-xs text-gray-500">Premium Insights</div>
              <div className="text-sm font-medium text-gray-700">30 credits</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-100">
              <div className="text-xs text-gray-500">Priority Listing</div>
              <div className="text-sm font-medium text-gray-700">25 credits/day</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-100">
              <div className="text-xs text-gray-500">Cash Voucher</div>
              <div className="text-sm font-medium text-gray-700">500+ credits</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CreditEarnedNotificationProps {
  amount: number;
  reason: string;
}

export function CreditEarnedNotification({ amount, reason }: CreditEarnedNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed top-20 right-6 z-50 bg-white rounded-xl shadow-2xl p-4 border-2 border-green-200 max-w-sm"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">+{amount}</span>
            <span className="text-sm text-gray-600">Credits Earned!</span>
          </div>
          <p className="text-xs text-gray-500">{reason}</p>
        </div>
      </div>
    </motion.div>
  );
}
