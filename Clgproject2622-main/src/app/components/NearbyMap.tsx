import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Navigation, Plus, Minus, RefreshCw, 
  Compass, Sparkles, Star, Shield, CheckCircle, 
  Award, Eye, Info
} from 'lucide-react';

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
}

interface NearbyMapProps {
  places: Place[];
  centerLatitude: number;
  centerLongitude: number;
  maxDistance: number;
  getTypeIcon: (type: string) => any;
  getTypeColor: (type: string) => string;
  onPlaceSelect: (place: Place) => void;
}

export function NearbyMap({
  places,
  centerLatitude,
  centerLongitude,
  maxDistance,
  getTypeIcon,
  getTypeColor,
  onPlaceSelect
}: NearbyMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredPlace, setHoveredPlace] = useState<Place | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Reset Map View
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  // Pan interaction helper
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Compute position for each place on our map relative to center
  const positionedPlaces = useMemo(() => {
    return places.map(place => {
      const latDiff = place.latitude - centerLatitude;
      const lonDiff = place.longitude - centerLongitude;
      const angle = Math.atan2(latDiff, lonDiff);
      
      // Scale distance proportionally so everything stays on screen within maxDistance limits
      // Distance is in km. maxRadiusPercent determines the farthest layout bound of the map.
      const maxRadiusPercent = 40; 
      const radiusPercent = maxDistance > 0 
        ? Math.min((place.distance / maxDistance) * maxRadiusPercent, maxRadiusPercent)
        : 0;

      // Calculate final target coordinates on the grid center (50%, 50%)
      const x = 50 + radiusPercent * Math.cos(angle);
      const y = 50 - radiusPercent * Math.sin(angle); // subtract because browser grid matches Y going down

      return {
        ...place,
        mapX: x,
        mapY: y
      };
    });
  }, [places, centerLatitude, centerLongitude, maxDistance]);

  return (
    <div className="relative w-full h-[600px] bg-slate-950 rounded-3xl border border-white/10 shadow-2xl overflow-hidden select-none">
      {/* Background Animated Map Radial Glow & Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950" />
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `scale(${zoom}) translate(${pan.x / 10}px, ${pan.y / 10}px)`,
            transition: isPanning ? 'none' : 'transform 0.15s ease-out',
          }}
        />
        {/* Animated Radar Sweeping Effect */}
        <motion.div 
          className="absolute translate-x-[-1/2] translate-y-[-1/2] rounded-full border border-violet-500/30 bg-violet-500/5"
          style={{
            left: '50%',
            top: '50%',
            width: '80%',
            height: '80%',
            maxWidth: '480px',
            maxHeight: '480px',
            transform: `translate(-50%, -50%) scale(${zoom})`,
          }}
          animate={{
            boxShadow: [
              'inset 0 0 40px rgba(139, 92, 246, 0.05)',
              'inset 0 0 80px rgba(139, 92, 246, 0.15)',
              'inset 0 0 40px rgba(139, 92, 246, 0.05)'
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        {/* Radar Line Sweep */}
        <motion.div
          className="absolute w-[2px] h-[40%] bg-gradient-to-t from-violet-500 to-transparent origin-bottom"
          style={{
            left: '50%',
            bottom: '50%',
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      {/* Interactive Map Surface */}
      <div 
        id="nearby-map-surface"
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing flex items-center justify-center p-8 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="relative w-full h-full max-w-[500px] max-h-[500px]"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transition: isPanning ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          {/* Mock Landmark Circles on grid */}
          <div className="absolute top-[20%] left-[15%] text-[10px] font-black text-white/30 tracking-wider">MG ROAD</div>
          <div className="absolute bottom-[20%] left-[25%] text-[10px] font-black text-white/30 tracking-wider">KORAMANGALA</div>
          <div className="absolute top-[35%] right-[20%] text-[10px] font-black text-white/30 tracking-wider font-mono">INDIRANAGAR</div>
          <div className="absolute bottom-[25%] right-[15%] text-[10px] font-black text-white/30 tracking-wider">HSR LAYOUT</div>

          {/* User Blue Pulsing Center Location Marker */}
          <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-20 pointer-events-none">
            <div className="relative flex items-center justify-center w-8 h-8">
              <motion.div 
                className="absolute w-8 h-8 bg-blue-500/40 rounded-full"
                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow-lg shadow-blue-500/50" />
            </div>
          </div>

          {/* Place Pin Markers */}
          {positionedPlaces.map((place) => {
            const TypeIcon = getTypeIcon(place.type);
            const isHovered = hoveredPlace?.id === place.id;
            
            return (
              <div
                key={place.id}
                className="absolute z-20"
                style={{
                  left: `${place.mapX}%`,
                  top: `${place.mapY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Pin Container */}
                <motion.div
                  onMouseEnter={() => setHoveredPlace(place)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlaceSelect(place);
                  }}
                  whileHover={{ scale: 1.25, zIndex: 40 }}
                  className="relative cursor-pointer group"
                >
                  {/* Glowing Pulse Ring for Verified/Trending Items */}
                  {place.trending && (
                    <div className="absolute -inset-2 bg-radial from-orange-500/40 to-transparent rounded-full animate-ping opacity-75" />
                  )}
                  {place.verified && (
                    <div className="absolute -inset-1.5 bg-radial from-emerald-400/40 to-transparent rounded-full animate-pulse" />
                  )}

                  {/* Aesthetic Pointer Pin */}
                  <div className={`p-2 bg-gradient-to-r ${getTypeColor(place.type)} text-white rounded-2xl shadow-xl transition-all duration-300 border border-white/20 hover:border-white`}>
                    <TypeIcon className="w-4 h-4 text-white" />
                  </div>

                  {/* Mini Hover Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -8, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        style={{ x: '-40%' }}
                        className="absolute bottom-full left-1/2 z-50 bg-slate-900 border border-white/10 rounded-xl p-3 shadow-2xl w-56 text-left pointer-events-none"
                      >
                        <div className="relative h-20 rounded-lg overflow-hidden bg-slate-800 mb-2">
                          <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 right-1 bg-white/95 text-xs text-gray-900 font-bold px-1.5 py-0.5 rounded shadow">
                            {place.distance.toFixed(1)} km
                          </div>
                          {place.verified && (
                            <div className="absolute top-1 left-1 bg-emerald-500 text-[10px] text-white font-black px-1.5 py-0.5 rounded shadow-lg flex items-center gap-1">
                              <CheckCircle className="w-2.5 h-2.5" />
                              VERIFIED
                            </div>
                          )}
                        </div>
                        <h4 className="text-xs font-black text-white truncate mb-0.5">{place.name}</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-[10px] font-bold text-white/90">{place.rating}</span>
                          </div>
                          <span className="text-[9px] text-zinc-400 uppercase font-black tracking-wider">{place.type}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Interactive Controls Overlay */}
      <div className="absolute bottom-6 left-6 z-30 flex flex-col gap-2">
        {/* Reset / Center Location */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="p-3 bg-slate-900/90 backdrop-blur-md border border-white/10 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center"
          title="Re-center Map"
        >
          <Compass className="w-5 h-5 text-indigo-400" />
        </motion.button>
      </div>

      <div className="absolute bottom-6 right-6 z-30 flex gap-2 font-mono">
        {/* Zoom Controls */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          className="p-3 bg-slate-900/90 backdrop-blur-md border border-white/10 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          className="p-3 bg-slate-900/90 backdrop-blur-md border border-white/10 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Active Legend / Info Overlay */}
      <div className="absolute top-6 left-6 z-30 pointer-events-none bg-slate-900/90 border border-white/10 rounded-2xl p-4 max-w-xs shadow-2xl backdrop-blur-md">
        <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 select-none">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          Radar Scanner (GPS Verified)
        </h3>
        <p className="text-[10px] text-zinc-400 leading-relaxed mb-3">
          Each pin represents a physical, coordinates-locked asset verified by local photography.
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[9px] font-semibold text-zinc-400">
          <div className="flex items-center gap-1 select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Presence
          </div>
          <div className="flex items-center gap-1 select-none">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            Trending Hotspot
          </div>
          <div className="flex items-center gap-1 select-none font-sans">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            You
          </div>
        </div>
      </div>

      {/* Interactive Helper Hint */}
      <div className="absolute top-6 right-6 z-30 bg-slate-900/80 border border-white/5 rounded-full px-3 py-1.5 shadow-xl text-[10px] font-bold text-zinc-400 backdrop-blur-sm pointer-events-none flex items-center gap-1">
        <Info className="w-3 w-3 text-indigo-400" />
        Drag to Pan • Click Pin to View Details
      </div>
    </div>
  );
}
