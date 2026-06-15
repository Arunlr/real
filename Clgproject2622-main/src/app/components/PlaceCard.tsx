import { motion } from 'motion/react';
import { MapPin, Star, Navigation, TrendingUp, Award, CheckCircle, Clock, Phone, Info } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { forwardRef } from 'react';

interface Place {
  id: string;
  name: string;
  type: 'hotel' | 'gym' | 'neighborhood' | 'school' | 'cafe' | 'amusement' | 'restaurant' | 'hospital' | 'sports' | 'other';
  rating: number;
  verificationCount: number;
  distance: number;
  latitude: number;
  longitude: number;
  address: string;
  price?: string;
  verified: boolean;
  trending: boolean;
  recentlyVerified: boolean;
  image: string;
  amenities: string[];
  description: string;
  hours: string;
  phone: string;
  dietType?: 'veg' | 'non-veg';
}

interface PlaceCardProps {
  place: Place;
  index: number;
  getTypeIcon: (type: string) => any;
  getTypeColor: (type: string) => string;
  onPlaceClick?: (place: Place) => void;
}

export const PlaceCard = forwardRef<HTMLDivElement, PlaceCardProps>(
  ({ place, index, getTypeIcon, getTypeColor, onPlaceClick }, ref) => {
    const TypeIcon = getTypeIcon(place.type);
    
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -8, scale: 1.02 }}
        onClick={() => onPlaceClick?.(place)}
        className="group relative bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {place.trending && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-white text-xs font-bold shadow-lg"
            >
              <TrendingUp className="w-3 h-3" />
              TRENDING
            </motion.div>
          )}
          {place.recentlyVerified && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white text-xs font-bold shadow-lg"
            >
              <Clock className="w-3 h-3" />
              NEW
            </motion.div>
          )}
        </div>

        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
          <ImageWithFallback
            src={place.image}
            alt={place.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"
          />
          
          {/* Type Badge */}
          <div className="absolute bottom-3 left-3 z-20">
            <div className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${getTypeColor(place.type)} rounded-xl text-white font-bold text-sm shadow-lg`}>
              <TypeIcon className="w-4 h-4" />
              <span className="capitalize">{place.type}</span>
            </div>
          </div>

          {/* Distance Badge */}
          <div className="absolute top-3 right-3 z-20">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl font-bold text-sm shadow-lg">
              <Navigation className="w-3 h-3 text-blue-600" />
              <span className="text-gray-900">{place.distance.toFixed(1)} km</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-black text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {place.name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {place.address}
              </p>
            </div>
          </div>

          {/* Rating & Verifications */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{place.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="font-semibold">{place.verificationCount}</span>
              <span>verifications</span>
            </div>
          </div>

          {/* Price */}
          {place.price && (
            <div className="mb-3">
              <span className="text-sm font-bold text-purple-600">{place.price}</span>
            </div>
          )}

          {/* Description */}
          <div className="mb-3">
            <p className="text-xs text-gray-600 line-clamp-2">{place.description}</p>
          </div>

          {/* Hours & Phone */}
          <div className="mb-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Clock className="w-3.5 h-3.5 text-green-600" />
              <span className="font-semibold">{place.hours}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <a 
                href={`tel:${place.phone}`} 
                className="font-semibold hover:text-blue-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {place.phone}
              </a>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {place.amenities.slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg"
              >
                {amenity}
              </span>
            ))}
            {place.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg">
                +{place.amenities.length - 3} more
              </span>
            )}
          </div>

          {/* CTA - Directions Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
              window.open(mapsUrl, '_blank');
            }}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 shadow-purple-500/30 hover:shadow-purple-500/40"
          >
            <Navigation className="w-5 h-5" />
            <span>Get Directions</span>
          </motion.button>
        </div>

        {/* Verified Badge */}
        {place.verified && (
          <div className="absolute top-3 right-3 z-20">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-2 bg-green-500 rounded-full shadow-lg"
            >
              <Award className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        )}
      </motion.div>
    );
  }
);

PlaceCard.displayName = 'PlaceCard';