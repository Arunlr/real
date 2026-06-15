import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Star, Navigation, Filter, TrendingUp, Award, CheckCircle, Hotel, Dumbbell, Home, ChevronDown, X, ArrowUpDown, Clock, Zap, Target, Sparkles, Radio, Phone, Mail, Share2, Heart, Bookmark, GraduationCap, Coffee, Ticket, Utensils, Activity, Trophy, MoreHorizontal, LayoutGrid, Map, Send, MessageSquare, Shield, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Navbar } from '../components/Navbar';
import { PlaceCard } from '../components/PlaceCard';
import { NearbyMap } from '../components/NearbyMap';
import kakeDiHattiImage from '../../imports/image.png';

interface Place {
  id: string;
  name: string;
  type: 'hotel' | 'gym' | 'neighborhood' | 'school' | 'cafe' | 'amusement' | 'restaurant' | 'hospital' | 'sports' | 'other';
  rating: number;
  verificationCount: number;
  distance: number; // in km
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
  dietType?: 'veg' | 'non-veg'; // For restaurants
}

export default function NearbyPlaces() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [baseLatitude, setBaseLatitude] = useState<number>(() => {
    const lat = location.state?.latitude;
    return typeof lat === 'number' && !isNaN(lat) ? lat : 12.9716;
  });
  const [baseLongitude, setBaseLongitude] = useState<number>(() => {
    const lon = location.state?.longitude;
    return typeof lon === 'number' && !isNaN(lon) ? lon : 77.5946;
  });

  const isBangaloreCenter = Math.abs(baseLatitude - 12.9716) < 0.001 && Math.abs(baseLongitude - 77.5946) < 0.001;

  useEffect(() => {
    const lat = location.state?.latitude;
    const lon = location.state?.longitude;
    if (typeof lat === 'number' && !isNaN(lat)) {
      setBaseLatitude(lat);
    }
    if (typeof lon === 'number' && !isNaN(lon)) {
      setBaseLongitude(lon);
    }
  }, [location.state]);
  
  const [selectedType, setSelectedType] = useState<'all' | 'hotel' | 'gym' | 'neighborhood' | 'school' | 'cafe' | 'amusement' | 'restaurant' | 'hospital' | 'sports' | 'other'>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'verifications'>('distance');
  const [showFilters, setShowFilters] = useState(false);
  const [maxDistance, setMaxDistance] = useState(20);
  const [isChangingDistance, setIsChangingDistance] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // Toggle View
  const [isMapView, setIsMapView] = useState(() => {
    return location.state?.mapMode || false;
  });

  useEffect(() => {
    if (location.state?.mapMode !== undefined) {
      setIsMapView(location.state.mapMode);
    }
  }, [location.state]);

  // Dynamic reviews states
  const [reviewsState, setReviewsState] = useState<Record<string, Array<{ author: string, rating: number, comment: string, date: string }>>>({
    'h1': [
      { author: 'Vikram Mehta', rating: 5, comment: 'Incredible clean rooms right in the center! Fully recommended for business trips.', date: '2 hours ago' },
      { author: 'Meera K.', rating: 4, comment: 'Extremely polite staff and perfect high fidelity ambient workspace lobby.', date: '1 day ago' }
    ],
    'h2': [
      { author: 'Anirudh S.', rating: 5, comment: 'Splendid views of the skyline. Checkpoint is physically verified with live stamp!', date: '3 days ago' }
    ],
    'g1': [
      { author: 'Karan Malhotra', rating: 5, comment: 'Clean, huge facilities and great trainers. Real-time proof is accurate!', date: '1 day ago' }
    ]
  });

  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);

  const handlePostComment = (placeId: string) => {
    if (!newCommentText.trim()) return;
    
    const rawUserName = localStorage.getItem('profile_user_name') || 'gamer4life2602';
    const authorName = newCommentName.trim() || rawUserName;
    
    const newCommentObj = {
      author: authorName,
      rating: newCommentRating,
      comment: newCommentText,
      date: 'Just now'
    };

    setReviewsState(prev => ({
      ...prev,
      [placeId]: [newCommentObj, ...(prev[placeId] || [])]
    }));

    setNewCommentText('');
    setNewCommentName('');
    setNewCommentRating(5);
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Mock highly recommended places near user
  const allPlaces: Place[] = useMemo(() => {
    const baseLatitudeVal = baseLatitude;
    const baseLongitudeVal = baseLongitude;
    
    // Generate random coordinates within 10km radius
    const generateNearbyCoords = (distance: number) => {
      const angle = Math.random() * 2 * Math.PI;
      const latOffset = (distance / 111) * Math.cos(angle); // ~111 km per degree latitude
      const lonOffset = (distance / (111 * Math.cos(baseLatitudeVal * Math.PI / 180))) * Math.sin(angle);
      return {
        latitude: baseLatitudeVal + latOffset,
        longitude: baseLongitudeVal + lonOffset
      };
    };

    const places = [
      // Hotels
      {
        id: 'h1',
        name: 'Grand Plaza Hotel',
        type: 'hotel' as const,
        rating: 4.8,
        verificationCount: 156,
        ...generateNearbyCoords(2.3),
        address: 'MG Road, Bangalore',
        price: '₹12,000-20,000/night',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1720540244592-b4124532b318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc3MDYyOTI2NHww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Pool', 'Gym', 'Restaurant', 'WiFi', 'Parking'],
        description: 'Experience luxury and comfort in the heart of Bangalore with our Grand Plaza Hotel. Enjoy a wide range of amenities and services to make your stay unforgettable.',
        hours: '24/7',
        phone: '+91 9876543210'
      },
      {
        id: 'h2',
        name: 'Skyline Suites',
        type: 'hotel' as const,
        rating: 4.6,
        verificationCount: 98,
        ...generateNearbyCoords(5.7),
        address: 'Koramangala, Bangalore',
        price: '₹16,000-28,000/night',
        verified: true,
        trending: false,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1766928210443-0be92ed5884a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHN1aXRlJTIwYmVkcm9vbXxlbnwxfHx8fDE3NzA2OTQxODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Rooftop Bar', 'Spa', 'WiFi', '24/7 Service'],
        description: 'Stay in style at Skyline Suites, offering luxurious suites with stunning views and top-notch amenities. Perfect for both business and leisure travelers.',
        hours: '24/7',
        phone: '+91 9876543210'
      },
      {
        id: 'h3',
        name: 'Comfort Inn Downtown',
        type: 'hotel' as const,
        rating: 4.4,
        verificationCount: 203,
        ...generateNearbyCoords(1.2),
        address: 'Indiranagar, Bangalore',
        price: '₹6,500-9,500/night',
        verified: true,
        trending: true,
        recentlyVerified: false,
        image: 'https://images.unsplash.com/photo-1762420874081-b93a5fb337f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGV4dGVyaW9uJTIwbmlnaHQlMjBsaWdodHN8ZW58MXx8fHwxNzcwNzM1OTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Free Breakfast', 'WiFi', 'Parking'],
        description: 'Comfort Inn Downtown provides a cozy and convenient stay in the heart of Bangalore. Enjoy free breakfast, high-speed WiFi, and ample parking.',
        hours: '24/7',
        phone: '+91 9876543210'
      },
      {
        id: 'h4',
        name: 'The Riverside Hotel',
        type: 'hotel' as const,
        rating: 4.9,
        verificationCount: 187,
        ...generateNearbyCoords(8.4),
        address: 'Whitefield, Bangalore',
        price: '₹24,000-40,000/night',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1761476328661-e9a05bb7fca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwd2F0ZXJmcm9udCUyMHZpZXd8ZW58MXx8fHwxNzcwNzM1OTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['River View', 'Fine Dining', 'Spa', 'Concierge'],
        description: 'Nestled along the picturesque riverside, The Riverside Hotel offers a serene and luxurious stay with stunning river views and exceptional services.',
        hours: '24/7',
        phone: '+91 9876543210'
      },
      
      // Gyms
      {
        id: 'g1',
        name: 'PowerFit Gym',
        type: 'gym' as const,
        rating: 4.7,
        verificationCount: 234,
        ...generateNearbyCoords(3.1),
        address: 'HSR Layout, Bangalore',
        price: '₹4,000/month',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBneW0lMjBlcXVpcG1lbnQlMjB3ZWlnaHRzfGVufDF8fHx8MTc3MDczNTk2NHww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Weights', 'Cardio', 'Classes', 'Showers', 'Lockers'],
        description: 'PowerFit Gym is your go-to fitness destination in Bangalore, offering a wide range of equipment and classes to help you achieve your fitness goals.',
        hours: '6 AM - 10 PM',
        phone: '+91 9876543210'
      },
      {
        id: 'g2',
        name: 'Elite Performance Center',
        type: 'gym' as const,
        rating: 4.9,
        verificationCount: 167,
        ...generateNearbyCoords(6.2),
        address: 'Brigade Road, Bangalore',
        price: '₹6,500/month',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1761971975962-9cc397e2ba2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZml0bmVzcyUyMGNlbnRlciUyMGludGVyaW9yfGVufDF8fHx8MTc3MDczNTk2NHww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Personal Training', 'Pool', 'Sauna', 'Smoothie Bar'],
        description: 'Elite Performance Center is a premier fitness facility in Bangalore, providing personalized training, a pool, sauna, and a smoothie bar to enhance your fitness journey.',
        hours: '6 AM - 10 PM',
        phone: '+91 9876543210'
      },
      {
        id: 'g3',
        name: '24/7 Fitness Hub',
        type: 'gym' as const,
        rating: 4.5,
        verificationCount: 312,
        ...generateNearbyCoords(4.8),
        address: 'Jayanagar, Bangalore',
        price: '₹2,800/month',
        verified: true,
        trending: false,
        recentlyVerified: false,
        image: 'https://images.unsplash.com/photo-1761971975769-97e598bf526b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBpbnRlcmlvciUyMHdvcmtvdXQlMjBzcGFjZXxlbnwxfHx8fDE3NzA3MzU5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['24/7 Access', 'Cardio', 'Weights', 'WiFi'],
        description: '24/7 Fitness Hub is your ultimate fitness solution in Bangalore, offering 24/7 access to cardio equipment, weights, and high-speed WiFi.',
        hours: '24/7',
        phone: '+91 9876543210'
      },
      {
        id: 'g4',
        name: 'Yoga & Wellness Studio',
        type: 'gym' as const,
        rating: 4.8,
        verificationCount: 145,
        ...generateNearbyCoords(2.9),
        address: 'Malleshwaram, Bangalore',
        price: '₹4,900/month',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1767611120077-3697335ec748?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwc3R1ZGlvJTIwcGVhY2VmdWwlMjBtZWRpdGF0aW9ufGVufDF8fHx8MTc3MDczNTk2NXww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Yoga Classes', 'Meditation', 'Spa', 'Wellness Programs'],
        description: 'Yoga & Wellness Studio in Malleshwaram offers a holistic approach to wellness with yoga classes, meditation, spa treatments, and wellness programs.',
        hours: '6 AM - 10 PM',
        phone: '+91 9876543210'
      },
      {
        id: 'g5',
        name: 'GYMX fitness redefined',
        type: 'gym' as const,
        rating: 4.7,
        verificationCount: 189,
        ...generateNearbyCoords(1.8),
        address: 'Available on cult.fit, Bangalore',
        price: '₹5,500/month',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY2VudGVyJTIwbW9kZXJuJTIwZ3ltfGVufDF8fHx8MTc3MDczNTk2NXww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Modern Equipment', 'Group Classes', 'Personal Training', 'Cult.fit App Access', 'Showers'],
        description: 'GYMX fitness redefined offers cutting-edge fitness equipment and training programs. Available on cult.fit platform for seamless booking and workout tracking.',
        hours: '6 AM - 11 PM',
        phone: '+91 9876543211'
      },
      {
        id: 'g6',
        name: 'yoh fitness',
        type: 'gym' as const,
        rating: 4.6,
        verificationCount: 142,
        ...generateNearbyCoords(1.5),
        address: 'Bangalore',
        price: '₹4,200/month',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHRyYWluaW5nJTIwZml0bmVzc3xlbnwxfHx8fDE3NzA3MzU5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Personal Training', 'Fitness Center', 'Customized Programs', 'Nutrition Guidance', 'Cardio Zone'],
        description: 'yoh fitness is a dedicated fitness center and personal training studio offering customized workout programs, expert trainers, and comprehensive fitness solutions.',
        hours: '6 AM - 10 PM',
        phone: '+91 9876543212'
      },
      {
        id: 'g7',
        name: 'cult Kalyan Nagar',
        type: 'gym' as const,
        rating: 4.8,
        verificationCount: 267,
        ...generateNearbyCoords(1.9),
        address: 'Kalyan Nagar, HRBR Layout, Bangalore',
        price: '₹6,000/month',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0JTIwZml0bmVzcyUyMGNlbnRlcnxlbnwxfHx8fDE3NzA3MzU5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Cult.fit Classes', 'Strength Training', 'Cardio', 'Yoga', 'Dance Fitness', 'Steam & Sauna'],
        description: 'cult Kalyan Nagar is the best fitness center in HRBR Layout, offering world-class facilities, expert trainers, and diverse workout options including strength, cardio, yoga, and dance fitness.',
        hours: '5:30 AM - 11 PM',
        phone: '+91 9876543213'
      },
      
      // Neighborhoods
      {
        id: 'n1',
        name: 'Indiranagar Arts District',
        type: 'neighborhood' as const,
        rating: 4.6,
        verificationCount: 421,
        ...generateNearbyCoords(1.5),
        address: 'Indiranagar Area, Bangalore',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1627087823136-a7668a7a06f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGFydHMlMjBkaXN0cmljdCUyMHN0cmVldHxlbnwxfHx8fDE3NzA3MzU5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Galleries', 'Cafes', 'Nightlife', 'Public Transit', 'Parks'],
        description: 'Discover the vibrant arts district in Indiranagar, featuring galleries, cafes, nightlife, public transit, and beautiful parks.',
        hours: '24/7',
        phone: '+91 9876543210'
      },
      {
        id: 'n2',
        name: 'Ulsoor Lake Residential',
        type: 'neighborhood' as const,
        rating: 4.8,
        verificationCount: 289,
        ...generateNearbyCoords(7.3),
        address: 'Ulsoor District, Bangalore',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1761613788675-503cb20ee73e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMG5laWdoYm9yaG9vZCUyMHRyZWVzJTIwaG91c2VzfGVufDF8fHx8MTc3MDczNTk2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Family Friendly', 'Schools', 'Parks', 'Shopping', 'Safe'],
        description: 'Ulsoor Lake Residential offers a family-friendly environment with schools, parks, shopping, and a safe community, nestled around the beautiful Ulsoor Lake.',
        hours: '24/7',
        phone: '+91 9876543210'
      },
      {
        id: 'n3',
        name: 'Electronic City Tech Hub',
        type: 'neighborhood' as const,
        rating: 4.7,
        verificationCount: 356,
        ...generateNearbyCoords(3.6),
        address: 'Electronic City, Bangalore',
        verified: true,
        trending: true,
        recentlyVerified: false,
        image: 'https://images.unsplash.com/photo-1766058481154-02ce7abd670b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1cmJhbiUyMGRldmVsb3BtZW50JTIwYnVpbGRpbmdzfGVufDF8fHx8MTc3MDczNTk2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Co-working Spaces', 'Startups', 'Cafes', 'Fast Internet'],
        description: 'Electronic City Tech Hub is a bustling tech hub in Bangalore, offering co-working spaces, startups, cafes, and fast internet connectivity.',
        hours: '24/7',
        phone: '+91 9876543210'
      },
      {
        id: 'n4',
        name: 'Basavanagudi Heritage',
        type: 'neighborhood' as const,
        rating: 4.9,
        verificationCount: 512,
        ...generateNearbyCoords(9.1),
        address: 'Basavanagudi, Bangalore',
        verified: true,
        trending: false,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1643573759086-20bfa523d40e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpYyUyMGFyY2hpdGVjdHVyZSUyMHN0cmVldCUyMGV1cm9wZXxlbnwxfHx8fDE3NzA3MzU5Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Historic Sites', 'Temples', 'Restaurants', 'Cultural Tours'],
        description: 'Basavanagudi Heritage is a historic neighborhood in Bangalore, featuring historic sites, temples, restaurants, and cultural tours.',
        hours: '24/7',
        phone: '+91 9876543210'
      },
      
      // Real Bangalore Places - Neighborhoods and Landmarks
      {
        id: 'n5',
        name: 'Ulsoor Lake',
        type: 'neighborhood' as const,
        rating: 4.7,
        verificationCount: 324,
        latitude: 12.9855,
        longitude: 77.6211,
        address: 'Ulsoor, Bangalore, Karnataka 560008',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1720767123741-a55f46757949?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVbHNvb3IlMjBMYWtlJTIwQmFuZ2Fsb3JlJTIwd2F0ZXIlMjBwYXJrfGVufDF8fHx8MTc3MzIwOTEyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        amenities: ['Boating', 'Park', 'Jogging Track', 'Peaceful', 'Scenic Views'],
        description: 'Ulsoor Lake is one of the largest lakes in Bangalore, offering boating facilities, peaceful surroundings, and a beautiful jogging track. Perfect for morning walks and evening relaxation.',
        hours: '6 AM - 7 PM',
        phone: '+91 9876543210'
      },
      {
        id: 'n6',
        name: 'Kammanahalli',
        type: 'neighborhood' as const,
        rating: 4.5,
        verificationCount: 267,
        latitude: 13.0127,
        longitude: 77.6384,
        address: 'Kammanahalli, Bangalore, Karnataka 560084',
        verified: true,
        trending: true,
        recentlyVerified: false,
        image: 'https://images.unsplash.com/photo-1764302271351-41bbfe80d327?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMG5laWdoYm9yaG9vZCUyMEluZGlhJTIwc3RyZWV0fGVufDF8fHx8MTc3MzIwOTEyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        amenities: ['Residential', 'Metro Access', 'Shopping', 'Restaurants', 'Schools'],
        description: 'Kammanahalli is a well-connected residential neighborhood in North Bangalore, known for its vibrant local culture, excellent metro connectivity, and numerous educational institutions.',
        hours: '24/7',
        phone: '+91 9876543210'
      },
      
      // Schools and Colleges
      {
        id: 's1',
        name: 'Kristu Jayanti College',
        type: 'school' as const,
        rating: 4.8,
        verificationCount: 421,
        latitude: 13.0583,
        longitude: 77.6425,
        address: 'K.Narayanapura, Kothanur, Bengaluru, Karnataka 560077',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1764943630631-b63aadf86e19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBjb2xsZWdlJTIwY2FtcHVzJTIwbW9kZXJuJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzczMjA5MTIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        amenities: ['UG & PG Programs', 'K-Narayanapura Campus', 'Research Labs', 'Library', 'Sports Complex', 'Wi-Fi Campus', 'Placements'],
        description: 'Kristu Jayanti College, founded in 1999, is managed by Bodhi Niketan Trust and is affiliated to Bengaluru North University. Renowned for its beautiful campus in K. Narayanapura, Kothanur, it offers superlative commerce, arts, and science degrees with top accreditation.',
        hours: '8:30 AM - 5 PM (Mon-Sat)',
        phone: '+91 80 6873 7777'
      },
      {
        id: 's2',
        name: 'Indian Academy Degree College',
        type: 'school' as const,
        rating: 4.5,
        verificationCount: 298,
        latitude: 13.0232,
        longitude: 77.6432,
        address: '230, Hennur Main Rd, Meganahalli, Kalyan Nagar, Bengaluru, Karnataka 560043',
        verified: true,
        trending: false,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1706078355012-f327ce8edeea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwZ3JlZW4lMjBidWlsZGluZ3xlbnwxfHx8fDE3NzMyMDkxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        amenities: ['Hennur Main Road', 'Science & Commerce', 'Modern Biotech Labs', 'Placement Cell', 'Hostels', 'Sports Arena'],
        description: 'Indian Academy Degree College is located on Hennur Main Road in Kalyan Nagar. The college offers outstanding higher education options with specialized life sciences, business administration, commerce, and computer application streams backed by excellent modern labs.',
        hours: '8:30 AM - 4:30 PM (Mon-Sat)',
        phone: '+91 80 6745 8900'
      },
      {
        id: 's3',
        name: 'New Horizon College of Engineering',
        type: 'school' as const,
        rating: 4.7,
        verificationCount: 512,
        latitude: 12.9341,
        longitude: 77.6912,
        address: 'Main Rd, near Marathahalli, Kaverappa Layout, Kadubeesanahalli, Bellandur, Bengaluru, Karnataka 560103',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1665329140125-7f29b6fe01b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOZXclMjBIb3Jpem9uJTIwQ29sbGVnZSUyMEJhbmdhbG9yZSUyMGNhbXB1c3xlbnwxfHx8fDE3NzM4MTIwOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        amenities: ['Bellandur Campus', 'Autonomous Engineering', 'Modern Labs', 'Elite Placement Cell', 'Hostels', 'Sports Complex'],
        description: 'New Horizon College of Engineering (NHCE) is an autonomous engineering college affiliated to Visvesvaraya Technological University (VTU). Positioned near Marathahalli in Kadubeesanahalli/Bellandur, it is globally recognized for industry-linked engineering streams and outstanding placements.',
        hours: '8 AM - 5 PM (Mon-Sat)',
        phone: '+91 80 6629 7777'
      },
      {
        id: 's4',
        name: 'St. Claret College',
        type: 'school' as const,
        rating: 4.7,
        verificationCount: 341,
        latitude: 13.0617,
        longitude: 77.5385,
        address: 'P. O. Box 1355, MES Ring Rd, Sharadhamba Nagar, Jalahalli Village, Jalahalli, Bengaluru, Karnataka 560013',
        verified: true,
        trending: true,
        recentlyVerified: false,
        image: 'https://images.unsplash.com/photo-1751956997639-6ea64aad1cd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb2xsZWdlJTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmUlMjBJbmRpYXxlbnwxfHx8fDE3NzM4MTIxMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        amenities: ['MES Ring Road', 'Degree Programs', 'Commerce & Tech', 'Huge Library', 'Claretine Center', 'Cultural Hub'],
        description: 'St. Claret College, located on the MES Ring Road in Jalahalli, Bengaluru, is established by Claretian Missionaries. Offering rich undergraduate programs in Commerce, Science, Computer Applications, and Management with academic and holistic excellence.',
        hours: '8:15 AM - 4:30 PM (Mon-Sat)',
        phone: '+91 80 2345 4700'
      },
      {
        id: 's5',
        name: 'Atria Institute of Technology',
        type: 'school' as const,
        rating: 4.4,
        verificationCount: 289,
        latitude: 13.0326,
        longitude: 77.5910,
        address: 'ASKB Campus, ATRIA INSTITUTE OF TECHNOLOGY, 1st Main Rd, Ags Colony, Anandnagar, Hebbal, Bengaluru, Karnataka 560032',
        verified: true,
        trending: false,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1695205847178-eb302dcf8382?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMGNvbGxlZ2UlMjBjYW1wdXMlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MzgxMjEwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        amenities: ['Hebbal Campus', 'VTU Affiliated', 'Makerspace Labs', 'Industry Placements', 'Sports Complex', 'Hostels'],
        description: 'Atria Institute of Technology is situated in the heart of academic Hebbal at ASKB Campus, AGS Colony, Anandnagar. Affiliated with VTU, it offers cutting-edge engineering modules, state-of-the-art incubation/design spaces, and stellar industry linkages.',
        hours: '8:30 AM - 5 PM (Mon-Sat)',
        phone: '+91 80 2354 7292'
      },
      
      // Cafes
      {
        id: 'c1',
        name: 'Starbucks',
        type: 'cafe' as const,
        rating: 4.5,
        verificationCount: 342,
        latitude: 12.9698,
        longitude: 77.6053,
        address: 'MG Road, Bangalore, Karnataka 560001',
        price: '₹200-500 per person',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1746045999610-22d2dfa94821?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTdGFyYnVja3MlMjBjYWZlJTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzczMjEwNzg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        amenities: ['WiFi', 'Outdoor Seating', 'Coffee', 'Snacks', 'Air Conditioned'],
        description: 'Starbucks Coffee offers a premium coffee experience with a variety of handcrafted beverages, fresh food, and a comfortable ambiance perfect for meetings or relaxation.',
        hours: '7 AM - 11 PM',
        phone: '+91 9876543211'
      },
      {
        id: 'c2',
        name: 'Cafe Coffee Day',
        type: 'cafe' as const,
        rating: 4.2,
        verificationCount: 278,
        latitude: 12.9352,
        longitude: 77.6245,
        address: 'Koramangala, Bangalore, Karnataka 560034',
        price: '₹100-300 per person',
        verified: true,
        trending: true,
        recentlyVerified: false,
        image: 'https://images.unsplash.com/photo-1728060361464-aa73da809dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYWZlJTIwQ29mZmVlJTIwRGF5JTIwaW50ZXJpb3IlMjBJbmRpYXxlbnwxfHx8fDE3NzMyMTA3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        amenities: ['WiFi', 'Comfortable Seating', 'Coffee', 'Snacks', 'Air Conditioned'],
        description: 'Cafe Coffee Day (CCD) is India\'s favorite coffee chain, offering a wide range of hot and cold beverages, delicious food, and a cozy atmosphere for everyone.',
        hours: '8 AM - 11 PM',
        phone: '+91 9876543212'
      },
      {
        id: 'c3',
        name: 'Open Door Cafe',
        type: 'cafe' as const,
        rating: 4.7,
        verificationCount: 189,
        latitude: 13.0358,
        longitude: 77.5970,
        address: 'Sadashivanagar, Bangalore, Karnataka 560080',
        price: '₹250-600 per person',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1593536488177-1eb3c2d4e3d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY2FmZSUyMGludGVyaW9yJTIwY29mZmVlJTIwc2hvcHxlbnwxfHx8fDE3NzMyMTA3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        amenities: ['Garden Seating', 'Organic Coffee', 'Healthy Menu', 'Pet Friendly', 'Art Gallery'],
        description: 'Open Door Cafe is a charming artisan cafe known for its organic coffee, healthy food options, beautiful garden seating, and a welcoming atmosphere that feels like home.',
        hours: '8 AM - 10 PM',
        phone: '+91 9876543213'
      },
      
      // Amusement Parks
      {
        id: 'a1',
        name: 'Wonderla',
        type: 'amusement' as const,
        rating: 4.6,
        verificationCount: 567,
        latitude: 12.8344,
        longitude: 77.3981,
        address: '28th KM, Mysore Road, Bangalore, Karnataka 562109',
        price: '₹999-1,499 per person',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1762342628328-6c7e3819c747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxXb25kZXJsYSUyMGFtdXNlbWVudCUyMHBhcmslMjByaWRlc3xlbnwxfHx8fDE3NzMyMTA3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        amenities: ['Water Rides', 'Thrill Rides', 'Kids Zone', 'Food Courts', 'Locker Facilities'],
        description: 'Wonderla Bangalore is one of India\'s largest amusement parks, featuring high-thrill rides, water attractions, and family-friendly entertainment spread across 82 acres of fun.',
        hours: '11 AM - 6 PM',
        phone: '+91 80 2220 1000'
      },
      {
        id: 'a2',
        name: 'Fun World',
        type: 'amusement' as const,
        rating: 4.3,
        verificationCount: 423,
        latitude: 13.0067,
        longitude: 77.5545,
        address: 'Jayamahal Road, Palace Guttahalli, Bangalore, Karnataka 560006',
        price: '₹400-700 per person',
        verified: true,
        trending: false,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1765973916041-af78b4193db4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbXVzZW1lbnQlMjBwYXJrJTIwZnVuJTIwcmlkZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzMyMTA3ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        amenities: ['Amusement Rides', 'Water Park', 'Snow Park', 'Food Court', 'Gaming Zone'],
        description: 'Fun World & Water World is Bangalore\'s first amusement park, offering exciting rides, a refreshing water park, unique snow park experience, and endless entertainment for all ages.',
        hours: '10 AM - 7 PM',
        phone: '+91 80 2334 4999'
      },

      // Restaurants - Vegetarian
      {
        id: 'r1',
        name: 'Kake Di Hatti',
        type: 'restaurant' as const,
        dietType: 'veg',
        rating: 4.6,
        verificationCount: 312,
        ...generateNearbyCoords(1.1),
        address: 'Bangalore',
        price: '₹250-500 per person',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: kakeDiHattiImage,
        amenities: ['Pure Veg', 'North Indian', 'Punjabi', 'Naan', 'Casual Dining'],
        description: 'Kake Di Hatti is famous for authentic North Indian and Punjabi vegetarian cuisine, known for their fresh naans, rich gravies, and traditional flavors.',
        hours: '11 AM - 10:30 PM',
        phone: '+91 9876543210'
      },
      {
        id: 'r2',
        name: 'Rameshwaram Cafe',
        type: 'restaurant' as const,
        dietType: 'veg',
        rating: 4.7,
        verificationCount: 456,
        ...generateNearbyCoords(1.4),
        address: 'Bangalore',
        price: '₹200-400 per person',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3V0aCUyMGluZGlhbiUyMGZvb2QlMjBkb3NhfGVufDF8fHx8MTc3MzgxMjEwMXww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Pure Veg', 'South Indian', 'Filter Coffee', 'Dosa', 'Breakfast'],
        description: 'Rameshwaram Cafe serves authentic South Indian vegetarian delicacies, famous for their crispy dosas, filter coffee, and traditional breakfast items.',
        hours: '7 AM - 10 PM',
        phone: '+91 9876543211'
      },
      {
        id: 'r3',
        name: 'Sattva Pure Veg Restaurant',
        type: 'restaurant' as const,
        dietType: 'veg',
        rating: 4.5,
        verificationCount: 234,
        ...generateNearbyCoords(1.8),
        address: 'Bangalore',
        price: '₹300-600 per person',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2ZWdldGFyaWFuJTIwdGhhbGl8ZW58MXx8fHwxNzczODEyMTAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Pure Veg', 'Multi-Cuisine', 'Thali', 'North & South Indian', 'Family Dining'],
        description: 'Sattva Pure Veg Restaurant offers a wide variety of vegetarian multi-cuisine options, featuring traditional thalis and both North & South Indian specialties.',
        hours: '11 AM - 10 PM',
        phone: '+91 9876543212'
      },
      {
        id: 'r4',
        name: 'KAILASH PARBAT',
        type: 'restaurant' as const,
        dietType: 'veg',
        rating: 4.6,
        verificationCount: 298,
        ...generateNearbyCoords(1.6),
        address: 'Pure Vegetarian Restaurant, Bangalore',
        price: '₹350-600 per person',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2ZWdldGFyaWFuJTIwZm9vZCUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzczODEyMTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Pure Veg', 'North Indian', 'Chaat', 'Family Friendly', 'Air Conditioned'],
        description: 'KAILASH PARBAT is a renowned pure vegetarian restaurant serving authentic North Indian cuisine, famous chaat, and traditional snacks in a family-friendly atmosphere.',
        hours: '11 AM - 11 PM',
        phone: '+91 9876543213'
      },
      {
        id: 'r5',
        name: 'Trayam Vegetarian Creations',
        type: 'restaurant' as const,
        dietType: 'veg',
        rating: 4.7,
        verificationCount: 187,
        ...generateNearbyCoords(1.3),
        address: 'Bangalore',
        price: '₹400-700 per person',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFyaWFuJTIwcGxhdHRlciUyMGdvdXJtZXR8ZW58MXx8fHwxNzczODEyMTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Pure Veg', 'Multi-Cuisine', 'Contemporary', 'Fine Dining', 'Rooftop Seating'],
        description: 'Trayam Vegetarian Creations offers innovative vegetarian cuisine with contemporary twists, featuring multi-cuisine options and elegant fine dining experience.',
        hours: '12 PM - 11 PM',
        phone: '+91 9876543214'
      },

      // Restaurants - Non-Vegetarian
      {
        id: 'r6',
        name: 'Meghana Foods',
        type: 'restaurant' as const,
        dietType: 'non-veg',
        rating: 4.7,
        verificationCount: 567,
        ...generateNearbyCoords(1.2),
        address: 'Bangalore',
        price: '₹400-800 per person',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBiaXJ5YW5pJTIwY2hpY2tlbnxlbnwxfHx8fDE3NzM4MTIxMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Biryani', 'Andhra Cuisine', 'South Indian', 'Spicy Food', 'Family Dining'],
        description: 'Meghana Foods is legendary for their authentic Andhra-style biryani and spicy South Indian non-vegetarian delicacies, a must-visit for biryani lovers in Bangalore.',
        hours: '11 AM - 11 PM',
        phone: '+91 9876543215'
      },
      {
        id: 'r7',
        name: 'Hotel Navayuga',
        type: 'restaurant' as const,
        dietType: 'non-veg',
        rating: 4.4,
        verificationCount: 389,
        ...generateNearbyCoords(1.7),
        address: 'Bangalore',
        price: '₹300-600 per person',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjaGlja2VuJTIwY3Vycnl8ZW58MXx8fHwxNzczODEyMTAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['South Indian', 'North Indian', 'Seafood', 'Biriyani', 'Traditional Cooking'],
        description: 'Hotel Navayuga is a traditional restaurant specializing in authentic South and North Indian non-vegetarian cuisine with a focus on fresh seafood and aromatic biriyani.',
        hours: '11 AM - 10:30 PM',
        phone: '+91 9876543216'
      },
      {
        id: 'r8',
        name: 'Empire Restaurant',
        type: 'restaurant' as const,
        dietType: 'non-veg',
        rating: 4.6,
        verificationCount: 645,
        ...generateNearbyCoords(1.5),
        address: 'Bangalore',
        price: '₹350-700 per person',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjByZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3NzM4MTIxMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Multi-Cuisine', 'Kebabs', 'Biryani', 'Continental', 'Quick Service'],
        description: 'Empire Restaurant is a Bangalore institution known for its delicious kebabs, biryani, and multi-cuisine offerings. Quick service and great taste at affordable prices.',
        hours: '10 AM - 11 PM',
        phone: '+91 9876543217'
      },

      // Hospitals
      {
        id: 'hosp1',
        name: 'Cratis Hospital',
        type: 'hospital' as const,
        rating: 4.7,
        verificationCount: 234,
        ...generateNearbyCoords(2.1),
        address: 'Bangalore',
        price: 'Multi-Speciality',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3NwaXRhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MDczNTk2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Emergency Care', '24/7 Service', 'ICU', 'Pharmacy', 'Diagnostics'],
        description: 'Cratis Hospital provides comprehensive healthcare services with state-of-the-art facilities and experienced medical professionals.',
        hours: '24/7',
        phone: '+91 9876543220'
      },
      {
        id: 'hosp2',
        name: 'East Point Hospital - Multi-Speciality Hospital',
        type: 'hospital' as const,
        rating: 4.8,
        verificationCount: 412,
        ...generateNearbyCoords(2.8),
        address: 'Bangalore',
        price: 'Multi-Speciality',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBob3NwaXRhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MDczNTk2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Multi-Speciality', 'Emergency Care', 'Surgery', 'Cardiology', 'Neurology', 'Parking'],
        description: 'East Point Hospital is a leading multi-speciality hospital offering comprehensive medical care across various specialties with advanced technology and expert doctors.',
        hours: '24/7',
        phone: '+91 9876543221'
      },
      {
        id: 'hosp3',
        name: 'New Life Speciality Hospital',
        type: 'hospital' as const,
        rating: 4.6,
        verificationCount: 298,
        ...generateNearbyCoords(3.2),
        address: 'Bangalore',
        price: 'Speciality Hospital',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBob3NwaXRhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MDczNTk2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Laparoscopic Surgery', 'Orthopaedic', 'Neurosurgery', 'Gynaecology', 'General Surgery', 'ICU'],
        description: 'New Life Speciality Hospital specializes in Laparoscopic General Surgery, Orthopaedic care, Neurosurgery, and Gynaecology with experienced specialists and modern facilities.',
        hours: '24/7',
        phone: '+91 9876543222'
      },
      {
        id: 'hosp4',
        name: 'Sunrise Hospital',
        type: 'hospital' as const,
        rating: 4.5,
        verificationCount: 187,
        ...generateNearbyCoords(1.7),
        address: 'Bangalore',
        price: 'General Hospital',
        verified: true,
        trending: false,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBob3NwaXRhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MDczNTk2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Emergency Care', 'Outpatient Services', 'Diagnostics', 'Pharmacy', 'Laboratory'],
        description: 'Sunrise Hospital provides quality healthcare services with a focus on patient care, equipped with modern diagnostic facilities and dedicated medical staff.',
        hours: '24/7',
        phone: '+91 9876543223'
      },
      {
        id: 'hosp5',
        name: 'Trilife Hospital',
        type: 'hospital' as const,
        rating: 4.7,
        verificationCount: 321,
        ...generateNearbyCoords(2.5),
        address: 'Bangalore',
        price: 'Multi-Speciality',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxtb2Rlcm4lMjBob3NwaXRhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MDczNTk2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Multi-Speciality Care', 'Advanced Diagnostics', 'ICU', 'NICU', 'Surgery', 'Rehabilitation'],
        description: 'Trilife Hospital is a comprehensive multi-speciality hospital offering advanced medical care across multiple departments with cutting-edge technology and compassionate care.',
        hours: '24/7',
        phone: '+91 9876543224'
      },
      {
        id: 'hosp6',
        name: 'SURAKSHAA HOSPITAL',
        type: 'hospital' as const,
        rating: 4.6,
        verificationCount: 256,
        ...generateNearbyCoords(1.9),
        address: 'Bangalore',
        price: 'Multi-Speciality',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxtb2Rlcm4lMjBob3NwaXRhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MDczNTk2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Emergency Services', 'Surgery', 'Maternity Care', 'Pediatrics', 'Diagnostics', 'Ambulance'],
        description: 'SURAKSHAA HOSPITAL is dedicated to providing safe and reliable healthcare services with a focus on emergency care, surgery, maternity, and pediatric services.',
        hours: '24/7',
        phone: '+91 9876543225'
      },

      // Sports Academies
      {
        id: 'sp1',
        name: 'Champions Cricket Academy',
        type: 'sports' as const,
        rating: 4.8,
        verificationCount: 187,
        ...generateNearbyCoords(2.3),
        address: 'Bangalore',
        price: '₹5,000-10,000/month',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmlja2V0JTIwYWNhZGVteXxlbnwxfHx8fDE3NzM4MTIxMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Professional Coaching', 'Indoor & Outdoor Nets', 'Fitness Training', 'Match Practice', 'Equipment'],
        description: 'Champions Cricket Academy offers professional cricket coaching for all age groups with experienced coaches, modern facilities, and structured training programs.',
        hours: '6 AM - 9 PM',
        phone: '+91 9876543226'
      },
      {
        id: 'sp2',
        name: 'Elite Football Academy',
        type: 'sports' as const,
        rating: 4.7,
        verificationCount: 156,
        ...generateNearbyCoords(1.8),
        address: 'Bangalore',
        price: '₹4,000-8,000/month',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHRyYWluaW5nfGVufDF8fHx8MTc3MzgxMjEwMXww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Professional Coaches', 'Full-Size Turf', 'Fitness Training', 'Tournament Opportunities', 'Age Group Programs'],
        description: 'Elite Football Academy provides comprehensive football training with UEFA-certified coaches, modern turf facilities, and competitive exposure for aspiring players.',
        hours: '6 AM - 9 PM',
        phone: '+91 9876543227'
      },
      {
        id: 'sp3',
        name: 'Ace Badminton Academy',
        type: 'sports' as const,
        rating: 4.9,
        verificationCount: 203,
        ...generateNearbyCoords(2.1),
        address: 'Bangalore',
        price: '₹3,000-6,000/month',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRtaW50b24lMjBjb3VydHxlbnwxfHx8fDE3NzM4MTIxMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['8 Synthetic Courts', 'National Level Coaches', 'Strength Training', 'Tournament Preparation', 'Group & Private Sessions'],
        description: 'Ace Badminton Academy features world-class facilities with 8 synthetic courts, national-level coaches, and comprehensive training programs for all skill levels.',
        hours: '5:30 AM - 10 PM',
        phone: '+91 9876543228'
      },
      {
        id: 'sp4',
        name: 'Pro Swimming Academy',
        type: 'sports' as const,
        rating: 4.6,
        verificationCount: 145,
        ...generateNearbyCoords(2.7),
        address: 'Bangalore',
        price: '₹5,000-9,000/month',
        verified: true,
        trending: false,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1519315901367-e47050769e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2ltbWluZyUyMHBvb2x8ZW58MXx8fHwxNzczODEyMTAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Olympic-Size Pool', 'Certified Instructors', 'Beginner to Advanced', 'Competitive Training', 'Safety Equipment'],
        description: 'Pro Swimming Academy offers professional swimming coaching in an Olympic-size pool with certified instructors for all ages and skill levels.',
        hours: '6 AM - 8 PM',
        phone: '+91 9876543229'
      },
      {
        id: 'sp5',
        name: 'Tennis Masters Academy',
        type: 'sports' as const,
        rating: 4.8,
        verificationCount: 178,
        ...generateNearbyCoords(3.1),
        address: 'Bangalore',
        price: '₹6,000-12,000/month',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBjb3VydHxlbnwxfHx8fDE3NzM4MTIxMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['6 Synthetic Courts', 'ITF Certified Coaches', 'Video Analysis', 'Tournament Support', 'Fitness Training'],
        description: 'Tennis Masters Academy provides world-class tennis training with ITF-certified coaches, 6 synthetic courts, and advanced training methodologies.',
        hours: '6 AM - 9 PM',
        phone: '+91 9876543230'
      },

      // Other Places
      {
        id: 'o1',
        name: 'City Central Library',
        type: 'other' as const,
        rating: 4.5,
        verificationCount: 234,
        ...generateNearbyCoords(1.5),
        address: 'Bangalore',
        price: 'Free (₹500 membership)',
        verified: true,
        trending: false,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzczODEyMTAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Reading Room', 'Study Area', 'Book Collection', 'WiFi', 'Photocopying'],
        description: 'City Central Library offers a vast collection of books, magazines, and digital resources with comfortable reading spaces and modern amenities.',
        hours: '8 AM - 8 PM',
        phone: '+91 9876543231'
      },
      {
        id: 'o2',
        name: 'Community Center',
        type: 'other' as const,
        rating: 4.3,
        verificationCount: 167,
        ...generateNearbyCoords(2.2),
        address: 'Bangalore',
        price: '₹500-2000/event',
        verified: true,
        trending: false,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjZW50ZXJ8ZW58MXx8fHwxNzczODEyMTAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Event Hall', 'Meeting Rooms', 'Sports Facilities', 'Parking', 'Catering Available'],
        description: 'Community Center provides versatile spaces for events, meetings, and activities with modern facilities and convenient amenities.',
        hours: '6 AM - 10 PM',
        phone: '+91 9876543232'
      },
      {
        id: 'o3',
        name: 'Bangalore Art Gallery',
        type: 'other' as const,
        rating: 4.7,
        verificationCount: 189,
        ...generateNearbyCoords(2.8),
        address: 'Bangalore',
        price: '₹100-300 entry',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5fGVufDF8fHx8MTc3MzgxMjEwMXww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Art Exhibitions', 'Workshops', 'Gift Shop', 'Guided Tours', 'Cafe'],
        description: 'Bangalore Art Gallery showcases contemporary and traditional art with rotating exhibitions, workshops, and cultural events.',
        hours: '10 AM - 6 PM',
        phone: '+91 9876543233'
      },
      {
        id: 'o4',
        name: 'City Museum',
        type: 'other' as const,
        rating: 4.6,
        verificationCount: 212,
        ...generateNearbyCoords(3.3),
        address: 'Bangalore',
        price: '₹50-200 entry',
        verified: true,
        trending: false,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1565301660306-29e08751cc3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBleGhpYml0fGVufDF8fHx8MTc3MzgxMjEwMXww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Historical Exhibits', 'Interactive Displays', 'Audio Guides', 'Souvenir Shop', 'Educational Programs'],
        description: 'City Museum preserves and showcases Bangalore\'s rich history and culture through engaging exhibits and educational programs.',
        hours: '10 AM - 5 PM',
        phone: '+91 9876543234'
      },
      {
        id: 'o5',
        name: 'Tech Innovation Hub',
        type: 'other' as const,
        rating: 4.8,
        verificationCount: 245,
        ...generateNearbyCoords(2.0),
        address: 'Bangalore',
        price: 'Free for members',
        verified: true,
        trending: true,
        recentlyVerified: true,
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwaHViJTIwb2ZmaWNlfGVufDF8fHx8MTc3MzgxMjEwMXww&ixlib=rb-4.1.0&q=80&w=1080',
        amenities: ['Co-working Space', 'Workshops', 'Networking Events', 'Mentorship', 'High-Speed Internet'],
        description: 'Tech Innovation Hub fosters entrepreneurship and innovation with co-working spaces, workshops, and networking opportunities for tech enthusiasts.',
        hours: '9 AM - 9 PM',
        phone: '+91 9876543235'
      },
    ];

    // Calculate actual distances
    return places.map(place => ({
      ...place,
      distance: calculateDistance(baseLatitudeVal, baseLongitudeVal, place.latitude, place.longitude)
    })) as Place[];
  }, [baseLatitude, baseLongitude]);

  // Filter and sort places
  const filteredPlaces = useMemo(() => {
    let filtered = allPlaces.filter(place => place.distance <= maxDistance);

    if (selectedType !== 'all') {
      filtered = filtered.filter(place => place.type === selectedType);
    }

    // Filter by diet type for restaurants
    if (selectedType === 'restaurant' && dietFilter !== 'all') {
      filtered = filtered.filter(place => place.dietType === dietFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'verifications':
          return b.verificationCount - a.verificationCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allPlaces, selectedType, sortBy, maxDistance, dietFilter]);

  // Get categorized places
  const categorizedPlaces = useMemo(() => {
    const filtered = allPlaces.filter(place => place.distance <= maxDistance);
    
    return {
      hotels: filtered.filter(p => p.type === 'hotel').sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.verificationCount - a.verificationCount;
      }),
      gyms: filtered.filter(p => p.type === 'gym').sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.verificationCount - a.verificationCount;
      }),
      neighborhoods: filtered.filter(p => p.type === 'neighborhood').sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.verificationCount - a.verificationCount;
      }),
      schools: filtered.filter(p => p.type === 'school').sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.verificationCount - a.verificationCount;
      }),
      cafes: filtered.filter(p => p.type === 'cafe').sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.verificationCount - a.verificationCount;
      }),
      amusement: filtered.filter(p => p.type === 'amusement').sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.verificationCount - a.verificationCount;
      }),
      restaurants: filtered.filter(p => p.type === 'restaurant').filter(p => {
        if (dietFilter === 'all') return true;
        return p.dietType === dietFilter;
      }).sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.verificationCount - a.verificationCount;
      }),
      hospitals: filtered.filter(p => p.type === 'hospital').sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.verificationCount - a.verificationCount;
      }),
      sports: filtered.filter(p => p.type === 'sports').sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.verificationCount - a.verificationCount;
      }),
      other: filtered.filter(p => p.type === 'other').sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.verificationCount - a.verificationCount;
      })
    };
  }, [allPlaces, sortBy, maxDistance, dietFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return Hotel;
      case 'gym': return Dumbbell;
      case 'neighborhood': return Home;
      case 'school': return GraduationCap;
      case 'cafe': return Coffee;
      case 'amusement': return Ticket;
      case 'restaurant': return Utensils;
      case 'hospital': return Activity;
      case 'sports': return Trophy;
      case 'other': return MoreHorizontal;
      default: return MapPin;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hotel': return 'from-blue-500 to-cyan-500';
      case 'gym': return 'from-orange-500 to-amber-500';
      case 'neighborhood': return 'from-purple-500 to-indigo-500';
      case 'school': return 'from-green-500 to-emerald-500';
      case 'cafe': return 'from-amber-500 to-yellow-500';
      case 'amusement': return 'from-pink-500 to-rose-500';
      case 'restaurant': return 'from-red-500 to-orange-500';
      case 'hospital': return 'from-teal-500 to-cyan-500';
      case 'sports': return 'from-yellow-500 to-orange-500';
      case 'other': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Navbar */}
      <Navbar />
      
      {/* Animated Background - Similar to Homepage */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Dark Gradient Background - Multiple Layers - PURPLE THEME */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950" />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-indigo-900/30 to-violet-900/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(124, 58, 237, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }} />
        
        {/* Spotlight Effects - PURPLE */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-radial from-purple-500/15 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-gradient-radial from-indigo-500/10 via-transparent to-transparent blur-3xl" />
        
        {/* Gradient Orbs - PURPLE THEME */}
        <motion.div
          className="absolute w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '5%' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 80, 0],
            y: [0, 80, -80, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '15%', right: '10%' }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] bg-gradient-to-br from-violet-400/15 to-purple-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, 120, -60, 0],
            y: [0, -60, 100, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '50%', right: '30%' }}
        />

        {/* Floating Particles - PURPLE */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * -200, 0],
              opacity: [0, 1, 0],
              scale: [0, 2 + Math.random() * 3, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Floating Icons - PURPLE */}
        {[MapPin, Star, Navigation, Hotel, Dumbbell, Home].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            <Icon className="w-8 h-8 text-purple-400/20" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header with Radar Effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative"
        >
          <div className="flex items-center gap-4 mb-2">
            {/* Animated Icon Container */}
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-3xl blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <motion.div
                className="relative p-4 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl shadow-2xl border-4 border-white/20"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  y: [0, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="relative">
                  <Navigation className="w-10 h-10 text-white" />
                  {/* Radar Ping Effect */}
                  <motion.div
                    className="absolute inset-0 border-2 border-white/50 rounded-full"
                    animate={{
                      scale: [1, 2.5],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 border-2 border-white/50 rounded-full"
                    animate={{
                      scale: [1, 2.5],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.7,
                    }}
                  />
                </div>
              </motion.div>
              
              {/* Pulsing Rings */}
              <motion.div
                className="absolute inset-0 border-4 border-purple-400/30 rounded-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </div>

            <div className="flex-1">
              <motion.h1 
                className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
              >
                Nearby Places
              </motion.h1>
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-full border border-purple-200/50 shadow-lg"
                  animate={{
                    boxShadow: [
                      '0 4px 20px rgba(168, 85, 247, 0.2)',
                      '0 4px 30px rgba(168, 85, 247, 0.4)',
                      '0 4px 20px rgba(168, 85, 247, 0.2)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Radio className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-gray-700">Scanning {maxDistance} km radius</span>
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
                <motion.div
                  className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-full border border-green-200/50"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <Sparkles className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-bold text-green-700">{filteredPlaces.length} Verified Spots</span>
                </motion.div>
              </div>

              {/* Dynamic Interactive Location Switcher Control */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-black text-slate-200">
                    {isBangaloreCenter ? "Bangalore Demo Area" : `GPS Location Area (${baseLatitude.toFixed(4)}, ${baseLongitude.toFixed(4)})`}
                  </span>
                </div>
                
                {isBangaloreCenter ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setBaseLatitude(pos.coords.latitude);
                            setBaseLongitude(pos.coords.longitude);
                          },
                          (err) => {
                            console.error("GPS retrieval error", err);
                          }
                        );
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider rounded-full border border-purple-500/30 transition-all shadow-md cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Use Device GPS Location
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setBaseLatitude(12.9716);
                      setBaseLongitude(77.5946);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-full border border-indigo-500/30 transition-all shadow-md cursor-pointer animate-pulse"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset to Bangalore Centre
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Places</p>
                <motion.p 
                  key={filteredPlaces.length}
                  initial={{ scale: 1.5, color: '#10b981' }}
                  animate={{ scale: 1, color: '#2563eb' }}
                  transition={{ type: 'spring' }}
                  className="text-2xl font-black text-blue-600"
                >
                  {filteredPlaces.length}
                </motion.p>
              </div>
              <MapPin className="w-10 h-10 text-blue-500/30" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trending</p>
                <p className="text-2xl font-black text-orange-600">
                  {filteredPlaces.filter(p => p.trending).length}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-500/30" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-black text-yellow-600">
                  {filteredPlaces.length > 0
                    ? (filteredPlaces.reduce((sum, p) => sum + p.rating, 0) / filteredPlaces.length).toFixed(1)
                    : "0.0"
                  }
                </p>
              </div>
              <Star className="w-10 h-10 text-yellow-500/30" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-black text-green-600">
                  {filteredPlaces.filter(p => p.verified).length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500/30" />
            </div>
          </motion.div>
        </motion.div>

        {/* Interactive Distance Control - COMPACT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg overflow-hidden"
          >
            {/* Animated Background Gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"
              animate={{
                x: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            <div className="relative z-10 flex items-center gap-4">
              {/* Icon & Title */}
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-md"
                  animate={{
                    scale: isChangingDistance ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Target className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Search Radius</h3>
                  <p className="text-xs text-gray-600">Adjust distance</p>
                </div>
              </div>
              
              {/* Distance Display */}
              <motion.div
                key={maxDistance}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative"
              >
                <div className="flex items-baseline gap-0.5 px-4 py-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-md border border-white/20">
                  <motion.span 
                    className="text-2xl font-black text-white"
                    animate={{
                      scale: isChangingDistance ? [1, 1.15, 1] : 1,
                    }}
                  >
                    {maxDistance}
                  </motion.span>
                  <span className="text-sm font-bold text-white/80">km</span>
                </div>
              </motion.div>

              {/* Slider - Horizontal Compact */}
              <div className="flex-1 relative">
                {/* Slider Track */}
                <div className="relative h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full shadow-inner overflow-hidden">
                  {/* Active Track */}
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-md"
                    animate={{
                      width: `${(maxDistance / 20) * 100}%`,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </motion.div>

                  {/* Slider Input */}
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={maxDistance}
                    onChange={(e) => {
                      setMaxDistance(Number(e.target.value));
                      setIsChangingDistance(true);
                      setTimeout(() => setIsChangingDistance(false), 500);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  {/* Slider Thumb */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-20"
                    animate={{
                      left: `calc(${((maxDistance - 1) / 19) * 100}%)`,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <motion.div
                      className="relative w-6 h-6 bg-white rounded-full shadow-lg border-2 border-blue-500 -ml-3"
                      animate={{
                        scale: isChangingDistance ? [1, 1.2, 1] : 1,
                      }}
                    >
                      {/* Inner Dot */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"
                          animate={{
                            scale: isChangingDistance ? [1, 1.3, 1] : 1,
                          }}
                        />
                      </div>
                      
                      {/* Outer Ring */}
                      <motion.div
                        className="absolute inset-0 border-2 border-blue-400 rounded-full"
                        animate={{
                          scale: [1, 1.8],
                          opacity: [0.5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Quick Distance Markers Below */}
                <div className="flex justify-between mt-1 px-1">
                  {[1, 5, 10, 15, 20].map((km) => (
                    <button
                      key={km}
                      onClick={() => {
                        setMaxDistance(km);
                        setIsChangingDistance(true);
                        setTimeout(() => setIsChangingDistance(false), 500);
                      }}
                      className={`text-xs font-semibold transition-colors ${
                        maxDistance === km ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {km}km
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex gap-2">
                {[
                  { label: '🚶', km: 2, tooltip: 'Walk' },
                  { label: '🚴', km: 5, tooltip: 'Bike' },
                  { label: '🚗', km: 10, tooltip: 'Drive' },
                  { label: '🎓', km: 20, tooltip: 'Explore Academic Hub' }
                ].map((preset) => (
                  <motion.button
                    key={preset.label}
                    onClick={() => {
                      setMaxDistance(preset.km);
                      setIsChangingDistance(true);
                      setTimeout(() => setIsChangingDistance(false), 500);
                    }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    title={preset.tooltip}
                    className={`
                      w-8 h-8 rounded-lg font-semibold text-sm transition-all flex items-center justify-center
                      ${maxDistance === preset.km
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-md scale-110'
                        : 'bg-white/60 hover:bg-white/80'
                      }
                    `}
                  >
                    <span className="text-base">{preset.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-3">
            {[
              { type: 'all', label: 'All Places', icon: MapPin, count: filteredPlaces.length, gradient: 'from-gray-600 to-gray-800' },
              { type: 'hotel', label: 'Hotels', icon: Hotel, count: categorizedPlaces.hotels.length, gradient: 'from-blue-500 to-cyan-500' },
              { type: 'gym', label: 'Gyms & Fitness', icon: Dumbbell, count: categorizedPlaces.gyms.length, gradient: 'from-orange-500 to-amber-500' },
              { type: 'restaurant', label: 'Restaurants', icon: Utensils, count: categorizedPlaces.restaurants.length, gradient: 'from-red-500 to-orange-500' },
              { type: 'hospital', label: 'Hospitals', icon: Activity, count: categorizedPlaces.hospitals.length, gradient: 'from-teal-500 to-cyan-500' },
              { type: 'neighborhood', label: 'Neighborhoods', icon: Home, count: categorizedPlaces.neighborhoods.length, gradient: 'from-purple-500 to-indigo-500' },
              { type: 'school', label: 'Schools & Colleges', icon: GraduationCap, count: categorizedPlaces.schools.length, gradient: 'from-green-500 to-emerald-500' },
              { type: 'cafe', label: 'Cafes', icon: Coffee, count: categorizedPlaces.cafes.length, gradient: 'from-amber-500 to-yellow-500' },
              { type: 'amusement', label: 'Amusement Parks', icon: Ticket, count: categorizedPlaces.amusement.length, gradient: 'from-pink-500 to-rose-500' },
              { type: 'sports', label: 'Sports Academy', icon: Trophy, count: categorizedPlaces.sports.length, gradient: 'from-yellow-500 to-orange-500' },
              { type: 'other', label: 'Other', icon: MoreHorizontal, count: categorizedPlaces.other.length, gradient: 'from-gray-500 to-gray-600' }
            ].map((category, index) => {
              const Icon = category.icon;
              const isActive = selectedType === category.type;
              
              return (
                <motion.button
                  key={category.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(category.type as any)}
                  className={`
                    relative px-6 py-3 rounded-2xl font-bold transition-all overflow-hidden group
                    ${isActive
                      ? `bg-gradient-to-r ${category.gradient} text-white shadow-xl border-2 border-white/30`
                      : 'bg-white/70 text-gray-700 hover:bg-white/90 shadow-md border border-white/20'
                    }
                  `}
                >
                  {!isActive && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                    />
                  )}
                  
                  <div className="relative z-10 flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    <span className="text-sm">{category.label}</span>
                    
                    <motion.div
                      className={`
                        px-2.5 py-0.5 rounded-full text-xs font-black
                        ${isActive
                          ? 'bg-white/30 text-white'
                          : 'bg-gray-200 text-gray-700'
                        }
                      `}
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {category.count}
                    </motion.div>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 border-2 border-white/50 rounded-2xl"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Veg/Non-Veg Switch for Restaurants */}
        {selectedType === 'restaurant' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg overflow-hidden"
            >
              {/* Animated Background based on selection */}
              <motion.div
                className={`absolute inset-0 transition-all duration-500 ${
                  dietFilter === 'veg'
                    ? 'bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10'
                    : dietFilter === 'non-veg'
                    ? 'bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10'
                    : 'bg-gradient-to-r from-gray-500/10 via-gray-600/10 to-gray-500/10'
                }`}
                animate={{
                  x: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`p-3 rounded-xl shadow-md transition-all duration-500 ${
                      dietFilter === 'veg'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                        : dietFilter === 'non-veg'
                        ? 'bg-gradient-to-br from-red-500 to-orange-500'
                        : 'bg-gradient-to-br from-gray-500 to-gray-600'
                    }`}
                    animate={{
                      rotate: dietFilter !== 'all' ? [0, 5, -5, 0] : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Utensils className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Dietary Preference</h3>
                    <p className="text-sm text-gray-600">Choose your food preference</p>
                  </div>
                </div>

                {/* Status Display */}
                <div className="text-right">
                  <motion.p
                    className={`text-2xl font-black transition-colors duration-500 ${
                      dietFilter === 'veg' ? 'text-green-600' : dietFilter === 'non-veg' ? 'text-red-600' : 'text-gray-600'
                    }`}
                    key={dietFilter}
                    initial={{ scale: 1.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    {dietFilter === 'veg' ? '🟢 Vegetarian' : dietFilter === 'non-veg' ? '🔴 Non-Vegetarian' : '🍽️ All Restaurants'}
                  </motion.p>
                  <p className="text-xs text-gray-500 mt-1">
                    {filteredPlaces.length} restaurant{filteredPlaces.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>

              {/* Switch Buttons */}
              <div className="relative z-10 flex items-center gap-3 mt-6">
                {/* VEG Button */}
                <motion.button
                  onClick={() => setDietFilter('veg')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-500 ${
                    dietFilter === 'veg'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl ring-4 ring-green-300'
                      : 'bg-white/60 text-gray-700 hover:bg-white/80 shadow-md'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{
                        scale: dietFilter === 'veg' ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      🥗
                    </motion.span>
                    <span>Vegetarian</span>
                    {dietFilter === 'veg' && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white"
                      >
                        ✓
                      </motion.span>
                    )}
                  </span>
                </motion.button>

                {/* ALL Button */}
                <motion.button
                  onClick={() => setDietFilter('all')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-500 ${
                    dietFilter === 'all'
                      ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-2xl ring-4 ring-gray-300'
                      : 'bg-white/60 text-gray-700 hover:bg-white/80 shadow-md'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{
                        scale: dietFilter === 'all' ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      🍽️
                    </motion.span>
                    <span>All</span>
                    {dietFilter === 'all' && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white"
                      >
                        ✓
                      </motion.span>
                    )}
                  </span>
                </motion.button>

                {/* NON-VEG Button */}
                <motion.button
                  onClick={() => setDietFilter('non-veg')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-500 ${
                    dietFilter === 'non-veg'
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-2xl ring-4 ring-red-300'
                      : 'bg-white/60 text-gray-700 hover:bg-white/80 shadow-md'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{
                        scale: dietFilter === 'non-veg' ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      🍗
                    </motion.span>
                    <span>Non-Vegetarian</span>
                    {dietFilter === 'non-veg' && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white"
                      >
                        ✓
                      </motion.span>
                    )}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Toggle between Grid List View and Map View */}
        <div className="flex justify-between items-center mb-8 bg-white/45 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-sm flex-col sm:flex-row gap-4">
          <div className="text-sm font-bold text-gray-700 pl-3">
            Showing <span className="text-purple-600 font-extrabold">{filteredPlaces.length}</span> verified places in {isBangaloreCenter ? "Bangalore" : "Your Selected Area"}
          </div>
          <div className="flex bg-gray-200/50 p-1.5 rounded-xl gap-1">
            <button
              onClick={() => setIsMapView(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                !isMapView 
                  ? 'bg-white text-gray-950 shadow-md border-b-2 border-purple-500' 
                  : 'text-gray-500 hover:text-gray-900 font-bold'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-purple-600" />
              List View
            </button>
            <button
              onClick={() => setIsMapView(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isMapView 
                  ? 'bg-slate-900 text-white shadow-xl border-b-2 border-indigo-400' 
                  : 'text-gray-500 hover:text-gray-900 font-bold'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-indigo-400" />
              Map View
            </button>
          </div>
        </div>

        {isMapView ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <NearbyMap
              places={filteredPlaces}
              centerLatitude={baseLatitude}
              centerLongitude={baseLongitude}
              maxDistance={maxDistance}
              getTypeIcon={getTypeIcon}
              getTypeColor={getTypeColor}
              onPlaceSelect={setSelectedPlace}
            />
          </motion.div>
        ) : selectedType === 'all' ? (
          <div className="space-y-12">
            {/* Hotels Section */}
            {categorizedPlaces.hotels.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                    <Hotel className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Hotels
                    </h2>
                    <p className="text-sm text-gray-600">{categorizedPlaces.hotels.length} verified properties</p>
                  </div>
                </div>
                
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {categorizedPlaces.hotels.map((place, index) => (
                      <PlaceCard key={place.id} place={place} index={index} getTypeIcon={getTypeIcon} getTypeColor={getTypeColor} onPlaceClick={setSelectedPlace} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {/* Gyms Section */}
            {categorizedPlaces.gyms.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg">
                    <Dumbbell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Gyms & Fitness
                    </h2>
                    <p className="text-sm text-gray-600">{categorizedPlaces.gyms.length} verified centers</p>
                  </div>
                </div>
                
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {categorizedPlaces.gyms.map((place, index) => (
                      <PlaceCard key={place.id} place={place} index={index} getTypeIcon={getTypeIcon} getTypeColor={getTypeColor} onPlaceClick={setSelectedPlace} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {/* Neighborhoods Section */}
            {categorizedPlaces.neighborhoods.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl shadow-lg">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Neighborhoods
                    </h2>
                    <p className="text-sm text-gray-600">{categorizedPlaces.neighborhoods.length} verified areas</p>
                  </div>
                </div>
                
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {categorizedPlaces.neighborhoods.map((place, index) => (
                      <PlaceCard key={place.id} place={place} index={index} getTypeIcon={getTypeIcon} getTypeColor={getTypeColor} onPlaceClick={setSelectedPlace} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {/* Schools Section */}
            {categorizedPlaces.schools.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Schools & Colleges
                    </h2>
                    <p className="text-sm text-gray-600">{categorizedPlaces.schools.length} verified institutions</p>
                  </div>
                </div>
                
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {categorizedPlaces.schools.map((place, index) => (
                      <PlaceCard key={place.id} place={place} index={index} getTypeIcon={getTypeIcon} getTypeColor={getTypeColor} onPlaceClick={setSelectedPlace} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {/* Cafes Section */}
            {categorizedPlaces.cafes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl shadow-lg">
                    <Coffee className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                      Cafes
                    </h2>
                    <p className="text-sm text-gray-600">{categorizedPlaces.cafes.length} verified cafes</p>
                  </div>
                </div>
                
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {categorizedPlaces.cafes.map((place, index) => (
                      <PlaceCard key={place.id} place={place} index={index} getTypeIcon={getTypeIcon} getTypeColor={getTypeColor} onPlaceClick={setSelectedPlace} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {/* Amusement Parks Section */}
            {categorizedPlaces.amusement.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg">
                    <Ticket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      Amusement Parks
                    </h2>
                    <p className="text-sm text-gray-600">{categorizedPlaces.amusement.length} verified parks</p>
                  </div>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {categorizedPlaces.amusement.map((place, index) => (
                      <PlaceCard key={place.id} place={place} index={index} getTypeIcon={getTypeIcon} getTypeColor={getTypeColor} onPlaceClick={setSelectedPlace} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {categorizedPlaces.hospitals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      Hospitals
                    </h2>
                    <p className="text-sm text-gray-600">{categorizedPlaces.hospitals.length} verified hospitals</p>
                  </div>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {categorizedPlaces.hospitals.map((place, index) => (
                      <PlaceCard key={place.id} place={place} index={index} getTypeIcon={getTypeIcon} getTypeColor={getTypeColor} onPlaceClick={setSelectedPlace} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {/* Sports Academy Section */}
            {categorizedPlaces.sports.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      Sports Academy
                    </h2>
                    <p className="text-sm text-gray-600">{categorizedPlaces.sports.length} verified academies</p>
                  </div>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {categorizedPlaces.sports.map((place, index) => (
                      <PlaceCard key={place.id} place={place} index={index} getTypeIcon={getTypeIcon} getTypeColor={getTypeColor} onPlaceClick={setSelectedPlace} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {/* Other Places Section */}
            {categorizedPlaces.other.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl shadow-lg">
                    <MoreHorizontal className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">
                      Other Places
                    </h2>
                    <p className="text-sm text-gray-600">{categorizedPlaces.other.length} verified places</p>
                  </div>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {categorizedPlaces.other.map((place, index) => (
                      <PlaceCard key={place.id} place={place} index={index} getTypeIcon={getTypeIcon} getTypeColor={getTypeColor} onPlaceClick={setSelectedPlace} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {/* Restaurants Section */}
            {categorizedPlaces.restaurants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={`p-3 rounded-2xl shadow-lg transition-all duration-500 ${
                        dietFilter === 'veg'
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                          : dietFilter === 'non-veg'
                          ? 'bg-gradient-to-br from-red-500 to-orange-500'
                          : 'bg-gradient-to-br from-red-500 to-orange-500'
                      }`}
                    >
                      <Utensils className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className={`text-3xl font-black bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
                        dietFilter === 'veg'
                          ? 'from-green-600 to-emerald-600'
                          : dietFilter === 'non-veg'
                          ? 'from-red-600 to-orange-600'
                          : 'from-red-600 to-orange-600'
                      }`}>
                        Restaurants
                      </h2>
                      <p className="text-sm text-gray-600">{categorizedPlaces.restaurants.length} verified restaurants</p>
                    </div>
                  </div>

                  {/* Diet Filter Pills */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => setDietFilter('all')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                        dietFilter === 'all'
                          ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg scale-105'
                          : 'bg-white/60 text-gray-700 hover:bg-white/80'
                      }`}
                    >
                      🍽️ All
                    </motion.button>
                    <motion.button
                      onClick={() => setDietFilter('veg')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                        dietFilter === 'veg'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                          : 'bg-white/60 text-gray-700 hover:bg-white/80'
                      }`}
                    >
                      🥗 Veg
                    </motion.button>
                    <motion.button
                      onClick={() => setDietFilter('non-veg')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                        dietFilter === 'non-veg'
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                          : 'bg-white/60 text-gray-700 hover:bg-white/80'
                      }`}
                    >
                      🍗 Non-Veg
                    </motion.button>
                  </div>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {categorizedPlaces.restaurants.map((place, index) => (
                      <PlaceCard key={place.id} place={place} index={index} getTypeIcon={getTypeIcon} getTypeColor={getTypeColor} onPlaceClick={setSelectedPlace} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </div>
        ) : (
          // Single category view
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPlaces.map((place, index) => (
                <PlaceCard key={place.id} place={place} index={index} getTypeIcon={getTypeIcon} getTypeColor={getTypeColor} onPlaceClick={setSelectedPlace} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No Results */}
        {filteredPlaces.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <MapPin className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No places found</h3>
            <p className="text-gray-500">Try adjusting your filters or increasing the distance</p>
          </motion.div>
        )}
      </div>

      {/* Immersive Place Detail Slide-over Panel */}
      <AnimatePresence>
        {selectedPlace && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlace(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            {/* Slide-over Content Container */}
            <div className="absolute inset-y-0 right-0 max-w-full pl-10 flex sm:pl-16">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col h-full border-l border-gray-100"
              >
                {/* Header */}
                <div className="relative h-72 bg-gray-100 overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={selectedPlace.image}
                    alt={selectedPlace.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent shadow-inner" />
                  
                  {/* Close button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedPlace(null)}
                    className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>

                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow">
                      {selectedPlace.type}
                    </span>
                    <h2 className="text-3xl font-black text-white mt-2 drop-shadow-md">
                      {selectedPlace.name}
                    </h2>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-black text-white">{selectedPlace.rating}</span>
                      </div>
                      <span className="text-white/60 text-sm">•</span>
                      <div className="flex items-center gap-1 text-white/90">
                        <Navigation className="w-3.5 h-3.5" />
                        <span className="text-sm font-bold">{selectedPlace.distance.toFixed(1)} km away</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                  {/* Proof Checkpoint Status (PREMIUM PROTOCOL THEME) */}
                  <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-md">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider block">
                          Protocol Security Layer
                        </span>
                        <h4 className="text-sm font-bold text-emerald-950">
                          Active Proof-of-Presence Guard
                        </h4>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs font-mono text-emerald-800 bg-white/60 rounded-xl p-3 border border-emerald-100/50">
                      <div>
                        <span className="text-[9px] text-emerald-600 block">EXIF GEORADAR LOCK</span>
                        <span className="font-bold">{selectedPlace.latitude.toFixed(5)}° N, {selectedPlace.longitude.toFixed(5)}° E</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-emerald-600 block">AUTHENTICATION WEIGHT</span>
                        <span className="font-bold">Score: 99.4% (Secured)</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Physical verification stamp verified with {selectedPlace.verificationCount} unique cryptographic sign-offs.
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {selectedPlace.description || "No public description provided. This is a fully crowdsourced physical location node verified with absolute proof of presence."}
                    </p>
                  </div>

                  {/* Amenities */}
                  {selectedPlace.amenities && selectedPlace.amenities.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Verified Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlace.amenities.map(amenity => (
                          <span key={amenity} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-xl border border-gray-150 flex items-center gap-1 font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meta Details */}
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4 text-sm">
                    <div>
                      <span className="text-xs text-gray-500 block">Operating Hours</span>
                      <span className="font-semibold text-gray-900">{selectedPlace.hours || "24 Hours"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Contact Carrier</span>
                      <span className="font-semibold text-gray-900">{selectedPlace.phone || "Not Shared"}</span>
                    </div>
                  </div>

                  {/* Write a review tab */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-indigo-500" />
                        Community Audits
                      </h3>
                      <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                        {(reviewsState[selectedPlace.id] || []).length} audit responses
                      </span>
                    </div>

                    {/* Write Audit Response */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 font-sans">
                      <h4 className="text-xs font-black text-gray-700 uppercase tracking-wide mb-3">
                        Submit Audit Response
                      </h4>
                      <div className="space-y-3">
                        <div className="flex gap-4 items-center flex-col sm:flex-row">
                          <input
                            type="text"
                            placeholder="Your Name (Optional)"
                            value={newCommentName}
                            onChange={(e) => setNewCommentName(e.target.value)}
                            className="bg-white px-3 py-2 border border-gray-200 rounded-xl text-xs flex-1 text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          
                          {/* Rating custom slider */}
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-gray-600 mr-1">Rating:</span>
                            {[1, 2, 3, 4, 5].map((starValue) => (
                              <button
                                key={starValue}
                                onClick={() => setNewCommentRating(starValue)}
                                className="focus:outline-none"
                              >
                                <Star 
                                  className={`w-4 h-4 ${
                                    starValue <= newCommentRating 
                                      ? 'text-amber-400 fill-amber-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <textarea
                            rows={2}
                            placeholder="Describe physical conditions, verification validity, queue lines..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="bg-white p-3 border border-gray-200 rounded-xl text-xs flex-1 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                          />
                          <button
                            onClick={() => handlePostComment(selectedPlace.id)}
                            className="px-4 bg-gradient-to-br from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer shadow shadow-indigo-600/30 font-bold text-xs"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Previous user audits logs */}
                    <div className="space-y-4">
                      {((reviewsState[selectedPlace.id] || [])).length === 0 ? (
                        <p className="text-xs text-gray-500 text-center py-4 bg-gray-50 rounded-xl font-sans">
                          No previous audit comments. Be the first to verify!
                        </p>
                      ) : (
                        (reviewsState[selectedPlace.id] || []).map((rev, ri) => (
                          <motion.div 
                            key={ri}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-150/50 font-sans"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-black text-gray-800 font-mono">
                                @{rev.author}
                              </span>
                              <span className="text-[10px] text-gray-500 font-medium">{rev.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {Array.from({ length: 5 }).map((_, si) => (
                                <Star 
                                  key={si}
                                  className={`w-3 h-3 ${
                                    si < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed font-sans">
                              {rev.comment}
                            </p>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}