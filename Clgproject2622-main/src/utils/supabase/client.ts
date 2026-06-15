import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey as defaultAnonKey } from '../../../utils/supabase/info';

const defaultUrl = `https://${projectId}.supabase.co`;

// Load credentials safely from localStorage or fallback to defaults
const getActiveCredentials = () => {
  try {
    const savedUrl = localStorage.getItem('localz_supabase_url');
    const savedKey = localStorage.getItem('localz_supabase_anon_key');
    if (savedUrl && savedKey) {
      return {
        url: savedUrl,
        key: savedKey,
        isCustom: true
      };
    }
  } catch (e) {
    console.error('Failed to read custom Supabase credentials:', e);
  }
  return {
    url: defaultUrl,
    key: defaultAnonKey,
    isCustom: false
  };
};

const creds = getActiveCredentials();

export const supabaseUrl = creds.url;
export const supabaseKey = creds.key;
export const isCustomSupabase = creds.isCustom;

// Singleton Supabase client for frontend use
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to get local storage data
const getLocalData = (key: string, defaultVal: any) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

// Helper to save local storage data
const setLocalData = (key: string, val: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('localStorage set item failed:', e);
  }
};

// Simulation layer for local-first database state when Supabase server is offline
const simulateAPIResponse = (path: string, options?: RequestInit) => {
  console.log('📡 [OFFLINE CLIENT FALLBACK] Intercepted path:', path, 'method:', options?.method || 'GET');

  // 1. Health check
  if (path === '/health') {
    return { status: 'ok', offline: true };
  }

  // 2. Auth Sign Up
  if (path === '/auth/signup') {
    let body: any = {};
    try {
      body = JSON.parse(options?.body as string || '{}');
    } catch (_) {}
    return {
      success: true,
      error: null,
      user: {
        id: 'demo-user-123',
        email: body.email || 'demo@localz.com',
        user_metadata: {
          name: body.name || 'Test User',
          phone: body.phone || '9876543210',
          role: 'user'
        }
      }
    };
  }

  // 3. User Stats
  const statsMatch = path.match(/\/users\/([^/]+)\/stats/);
  if (statsMatch) {
    const userId = statsMatch[1];
    const key = `stats_${userId}`;
    const defaultStats = {
      level: 2,
      xp: 450,
      trustScore: 87,
      totalEarnings: 12450,
      monthlyEarnings: 3200,
      verificationCount: 8,
      streak: 12,
    };

    if (options?.method === 'POST') {
      let body: any = {};
      try {
        body = JSON.parse(options?.body as string || '{}');
      } catch (_) {}
      const current = getLocalData(key, defaultStats);
      const updated = { ...current, ...body };
      setLocalData(key, updated);
      return { success: true, stats: updated };
    } else {
      const stats = getLocalData(key, defaultStats);
      return { success: true, stats };
    }
  }

  // 4. Places list
  if (path === '/places') {
    const key = 'places';
    const defaultPlaces = [
      {
        id: 'place-grand-plaza',
        name: 'Grand Plaza Hotel',
        type: 'hotel',
        rating: 4.8,
        verificationCount: 156,
        latitude: 12.9716,
        longitude: 77.5946,
        address: 'MG Road, Bangalore',
        price: '₹12,000-20,000/night',
        verified: true,
        trending: true,
      },
      {
        id: 'place-cratis-hospital',
        name: 'Cratis Hospital',
        type: 'hospital',
        rating: 4.7,
        verificationCount: 234,
        latitude: 12.9616,
        longitude: 77.6046,
        address: 'Bangalore',
        price: 'Multi-Speciality',
        verified: true,
        trending: true,
      },
      {
        id: 'place-kake-di-hatti',
        name: 'Kake Di Hatti',
        type: 'restaurant',
        dietType: 'veg',
        rating: 4.5,
        verificationCount: 432,
        latitude: 12.9516,
        longitude: 77.5846,
        address: 'Bangalore',
        price: '₹200-405 per person',
        verified: true,
        trending: true,
      }
    ];

    if (options?.method === 'POST') {
      let body: any = {};
      try {
        body = JSON.parse(options?.body as string || '{}');
      } catch (_) {}
      const current = getLocalData(key, defaultPlaces);
      const newPlace = {
        id: body.id || `place-${Date.now()}`,
        name: body.name || 'Sample Place',
        type: body.type || 'restaurant',
        rating: body.rating || 4.2,
        verificationCount: body.verificationCount || 1,
        latitude: body.latitude || 12.97,
        longitude: body.longitude || 77.59,
        address: body.address || 'Bangalore',
        price: body.price || 'Reasonable',
        verified: body.verified !== undefined ? body.verified : true,
        trending: body.trending !== undefined ? body.trending : false,
      };
      const updated = [...current, newPlace];
      setLocalData(key, updated);
      return { success: true, places: updated };
    } else {
      const places = getLocalData(key, defaultPlaces);
      return { success: true, places };
    }
  }

  // 5. Submit verifications
  if (path === '/verifications') {
    let body: any = {};
    try {
      body = JSON.parse(options?.body as string || '{}');
    } catch (_) {}
    const verifKey = 'verifications';
    const currentVerifs = getLocalData(verifKey, []);
    const newVerif = {
      id: `verif-${Date.now()}`,
      ...body,
      timestamp: new Date().toISOString()
    };
    setLocalData(verifKey, [...currentVerifs, newVerif]);

    // Update user statistics as part of verification
    const userId = body.userId || 'demo-user-123';
    const statsKey = `stats_${userId}`;
    const defaultStats = {
      level: 2,
      xp: 450,
      trustScore: 87,
      totalEarnings: 12450,
      monthlyEarnings: 3200,
      verificationCount: 8,
      streak: 12,
    };
    const userStats = getLocalData(statsKey, defaultStats);
    userStats.verificationCount = (userStats.verificationCount || 0) + 1;
    userStats.xp = (userStats.xp || 0) + 100;
    userStats.totalEarnings = (userStats.totalEarnings || 0) + 250;
    userStats.monthlyEarnings = (userStats.monthlyEarnings || 0) + 250;
    if (userStats.xp >= 1000) {
      userStats.level = (userStats.level || 1) + 1;
      userStats.xp = userStats.xp % 1000;
    }
    setLocalData(statsKey, userStats);

    // Mark place verified in localStorage places list
    if (body.placeId) {
      const placesKey = 'places';
      const defaultPlaces = [
        { id: 'place-grand-plaza', name: 'Grand Plaza Hotel', type: 'hotel', rating: 4.8, verificationCount: 156, latitude: 12.9716, longitude: 77.5946, address: 'MG Road, Bangalore', price: '₹12,000-20,000/night', verified: true, trending: true },
        { id: 'place-cratis-hospital', name: 'Cratis Hospital', type: 'hospital', rating: 4.7, verificationCount: 234, latitude: 12.9616, longitude: 77.6046, address: 'Bangalore', price: 'Multi-Speciality', verified: true, trending: true },
        { id: 'place-kake-di-hatti', name: 'Kake Di Hatti', type: 'restaurant', dietType: 'veg', rating: 4.5, verificationCount: 432, latitude: 12.9516, longitude: 77.5846, address: 'Bangalore', price: '₹200-405 per person', verified: true, trending: true }
      ];
      const places = getLocalData(placesKey, defaultPlaces);
      const updatedPlaces = places.map((p: any) => {
        if (p.id === body.placeId) {
          return { ...p, verified: true, verificationCount: (p.verificationCount || 0) + 1 };
        }
        return p;
      });
      setLocalData(placesKey, updatedPlaces);
    }

    return { success: true, verification: newVerif };
  }

  // 6. User Rewards
  const rewardsMatch = path.match(/\/users\/([^/]+)\/rewards/);
  if (rewardsMatch) {
    const userId = rewardsMatch[1];
    const key = `rewards_${userId}`;
    const defaultRewards = [
      {
        id: 'reward-1',
        type: 'Cashback',
        amount: '₹500',
        description: 'Earned from hotel verification',
        status: 'claimed',
      },
      {
        id: 'reward-2',
        type: 'Gift Card',
        amount: '₹1000 Amazon',
        description: 'Monthly achievement reward',
        status: 'pending',
      },
      {
        id: 'reward-3',
        type: 'Coins',
        amount: '250 coins',
        description: 'Streak bonus',
        status: 'claimed',
      }
    ];

    if (options?.method === 'POST') {
      let body: any = {};
      try {
        body = JSON.parse(options?.body as string || '{}');
      } catch (_) {}
      const current = getLocalData(key, defaultRewards);
      const newReward = {
        id: `reward-${Date.now()}`,
        ...body,
        status: body.status || 'pending'
      };
      const updated = [...current, newReward];
      setLocalData(key, updated);
      return { success: true, rewards: updated };
    } else {
      const rewards = getLocalData(key, defaultRewards);
      return { success: true, rewards };
    }
  }

  // 7. Leaderboard
  if (path === '/leaderboard') {
    return {
      success: true,
      leaderboard: [
        { id: '1', name: 'Rahul S.', points: 2450, verifications: 18, avatar: '👨‍💻', rank: 1, trustScore: 98, isMe: false },
        { id: '2', name: 'Priya M.', points: 1890, verifications: 14, avatar: '👩‍⚕️', rank: 2, trustScore: 95, isMe: false },
        { id: 'demo-user-123', name: 'You (Demo Contributor)', points: 1450, verifications: 8, avatar: '🌟', rank: 3, trustScore: 87, isMe: true },
        { id: '3', name: 'Amit K.', points: 1200, verifications: 9, avatar: '👨‍🍳', rank: 4, trustScore: 91, isMe: false },
        { id: '4', name: 'Ananya R.', points: 950, verifications: 7, avatar: '👩‍🎨', rank: 5, trustScore: 89, isMe: false }
      ]
    };
  }

  return { success: true };
};

// Helper to call the backend edge function server with automatic local-first fallback
export const callServer = async (path: string, options?: RequestInit) => {
  try {
    const session = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
    const token = session.data.session?.access_token || supabaseKey;

    const url = `${supabaseUrl}/functions/v1/make-server-5bf721dd${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      console.warn(`Server responded with non-200. Falling back to local database simulation for: ${path}`);
      return simulateAPIResponse(path, options);
    }

    return response.json();
  } catch (err) {
    console.warn(`Network error fetching from server. Falling back to local database simulation for: ${path}`, err);
    return simulateAPIResponse(path, options);
  }
};
