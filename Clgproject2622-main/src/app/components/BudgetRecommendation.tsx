import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Info, DollarSign, MapPin, Calendar, Users } from 'lucide-react';

interface BudgetRecommendationProps {
  city: string;
  placeType: 'hotel' | 'school' | 'neighborhood' | 'pg' | 'restaurant' | 'other';
  duration?: number; // in days for hotels, months for rent
  occupancy?: number; // number of people
  onChange?: (recommendedBudget: number) => void;
}

// Mock AI pricing data - In production, this would come from an API
const pricingData: Record<string, Record<string, { min: number; avg: number; max: number; trend: 'up' | 'down' | 'stable' }>> = {
  Mumbai: {
    hotel: { min: 2000, avg: 4500, max: 15000, trend: 'up' },
    school: { min: 50000, avg: 150000, max: 500000, trend: 'stable' },
    pg: { min: 8000, avg: 15000, max: 35000, trend: 'up' },
    restaurant: { min: 300, avg: 800, max: 3000, trend: 'stable' },
    neighborhood: { min: 15000, avg: 35000, max: 100000, trend: 'up' },
  },
  Delhi: {
    hotel: { min: 1500, avg: 3500, max: 12000, trend: 'stable' },
    school: { min: 40000, avg: 120000, max: 400000, trend: 'up' },
    pg: { min: 7000, avg: 12000, max: 28000, trend: 'stable' },
    restaurant: { min: 250, avg: 600, max: 2500, trend: 'down' },
    neighborhood: { min: 12000, avg: 28000, max: 80000, trend: 'stable' },
  },
  Bangalore: {
    hotel: { min: 1800, avg: 4000, max: 14000, trend: 'up' },
    school: { min: 60000, avg: 180000, max: 600000, trend: 'up' },
    pg: { min: 9000, avg: 16000, max: 38000, trend: 'up' },
    restaurant: { min: 300, avg: 750, max: 2800, trend: 'stable' },
    neighborhood: { min: 18000, avg: 40000, max: 120000, trend: 'up' },
  },
  Pune: {
    hotel: { min: 1200, avg: 2800, max: 9000, trend: 'stable' },
    school: { min: 35000, avg: 100000, max: 300000, trend: 'stable' },
    pg: { min: 6000, avg: 10000, max: 22000, trend: 'up' },
    restaurant: { min: 200, avg: 500, max: 2000, trend: 'stable' },
    neighborhood: { min: 10000, avg: 22000, max: 60000, trend: 'stable' },
  },
};

export function BudgetRecommendation({ 
  city, 
  placeType, 
  duration = 1, 
  occupancy = 1,
  onChange 
}: BudgetRecommendationProps) {
  const [selectedRange, setSelectedRange] = useState<'budget' | 'mid' | 'premium'>('mid');
  const [isCalculating, setIsCalculating] = useState(true);
  const [recommendedBudget, setRecommendedBudget] = useState(0);

  // Get pricing data for the selected city and place type
  const cityData = pricingData[city] || pricingData['Mumbai'];
  const priceData = cityData[placeType] || cityData['hotel'];

  useEffect(() => {
    // Simulate AI calculation
    setIsCalculating(true);
    setTimeout(() => {
      let baseBudget = 0;
      
      switch (selectedRange) {
        case 'budget':
          baseBudget = priceData.min * 1.2; // 20% above minimum
          break;
        case 'mid':
          baseBudget = priceData.avg;
          break;
        case 'premium':
          baseBudget = priceData.max * 0.8; // 80% of maximum
          break;
      }

      // Adjust for duration and occupancy
      if (placeType === 'hotel' || placeType === 'restaurant') {
        baseBudget *= duration;
      }
      baseBudget *= Math.sqrt(occupancy); // Non-linear scaling for occupancy

      setRecommendedBudget(Math.round(baseBudget));
      onChange?.(Math.round(baseBudget));
      setIsCalculating(false);
    }, 800);
  }, [city, placeType, selectedRange, duration, occupancy]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = () => {
    switch (priceData.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      default:
        return <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />;
    }
  };

  const getTrendText = () => {
    switch (priceData.trend) {
      case 'up':
        return 'Prices trending up';
      case 'down':
        return 'Prices trending down';
      default:
        return 'Prices stable';
    }
  };

  const getPlaceTypeIcon = () => {
    switch (placeType) {
      case 'hotel':
        return '🏨';
      case 'school':
        return '🏫';
      case 'pg':
        return '🏢';
      case 'restaurant':
        return '🍽️';
      case 'neighborhood':
        return '🏘️';
      default:
        return '📍';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg shadow-blue-600/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              AI Budget Recommendation
            </h3>
            <p className="text-sm text-gray-600">Powered by local pricing data</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200">
          {getTrendIcon()}
          <span className="text-xs font-medium text-gray-700">{getTrendText()}</span>
        </div>
      </div>

      {/* Location & Type Info */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">{city}</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
          <span className="text-base">{getPlaceTypeIcon()}</span>
          <span className="text-sm font-medium text-gray-700 capitalize">{placeType}</span>
        </div>
        {(placeType === 'hotel' || placeType === 'restaurant') && duration > 1 && (
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">{duration} days</span>
          </div>
        )}
        {occupancy > 1 && (
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">{occupancy} people</span>
          </div>
        )}
      </div>

      {/* Budget Range Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Your Budget Range
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedRange('budget')}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedRange === 'budget'
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(priceData.min * 1.2)}
            </div>
            <div className="text-xs font-medium text-gray-600">Budget</div>
          </button>

          <button
            onClick={() => setSelectedRange('mid')}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedRange === 'mid'
                ? 'border-purple-600 bg-purple-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-purple-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(priceData.avg)}
            </div>
            <div className="text-xs font-medium text-gray-600">Mid-Range</div>
            <div className="mt-1 inline-block bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              POPULAR
            </div>
          </button>

          <button
            onClick={() => setSelectedRange('premium')}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedRange === 'premium'
                ? 'border-orange-600 bg-orange-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-orange-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(priceData.max * 0.8)}
            </div>
            <div className="text-xs font-medium text-gray-600">Premium</div>
          </button>
        </div>
      </div>

      {/* AI Recommendation Result */}
      <div className="bg-white rounded-xl p-5 border-2 border-blue-300 shadow-md mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Recommended Budget</span>
          </div>
          {isCalculating && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Calculating...
            </div>
          )}
        </div>
        
        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {formatCurrency(recommendedBudget)}
        </div>
        
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
          <p className="leading-relaxed">
            Based on {placeType === 'hotel' ? 'per night' : placeType === 'restaurant' ? 'per meal' : 'monthly'} rates 
            in {city}, this budget gives you access to quality verified options in the {selectedRange === 'budget' ? 'economy' : selectedRange === 'mid' ? 'mid-range' : 'premium'} segment.
          </p>
        </div>
      </div>

      {/* Price Range Visualization */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
          <span>Min: {formatCurrency(priceData.min)}</span>
          <span>Avg: {formatCurrency(priceData.avg)}</span>
          <span>Max: {formatCurrency(priceData.max)}</span>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-3 bg-gradient-to-r from-green-200 via-blue-200 to-orange-200 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 h-full w-1 bg-gray-900 shadow-lg"
            style={{ 
              left: `${((recommendedBudget - priceData.min) / (priceData.max - priceData.min)) * 100}%`,
              transition: 'left 0.5s ease-out'
            }}
          />
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Your budget is positioned in the market range
        </p>
      </div>

      {/* Market Insights */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <div className="text-xs font-medium text-blue-700 mb-1">Verified Options</div>
          <div className="text-xl font-bold text-blue-900">
            {Math.floor(Math.random() * 50) + 30}+
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
          <div className="text-xs font-medium text-green-700 mb-1">Avg Trust Score</div>
          <div className="text-xl font-bold text-green-900">
            {(4.2 + Math.random() * 0.6).toFixed(1)} ★
          </div>
        </div>
      </div>
    </div>
  );
}
