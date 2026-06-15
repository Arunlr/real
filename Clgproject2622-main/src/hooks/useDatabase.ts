import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';

/**
 * Hook to fetch and manage user profile data
 */
export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (fetchError) throw fetchError;
        setProfile(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: any) => {
    if (!userId) return;

    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  return { profile, loading, error, updateProfile };
}

/**
 * Hook to fetch places with optional filters
 */
export function usePlaces(filters?: {
  type?: string;
  city?: string;
  verified?: boolean;
  limit?: number;
}) {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        let query = supabase.from('places').select('*');

        if (filters?.type) {
          query = query.eq('type', filters.type);
        }
        if (filters?.city) {
          query = query.eq('city', filters.city);
        }
        if (filters?.verified !== undefined) {
          query = query.eq('verified', filters.verified);
        }
        if (filters?.limit) {
          query = query.limit(filters.limit);
        }

        query = query.order('rating', { ascending: false });

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setPlaces(data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching places:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [filters?.type, filters?.city, filters?.verified, filters?.limit]);

  const createPlace = async (place: any) => {
    try {
      const { data, error: insertError } = await supabase
        .from('places')
        .insert([place])
        .select()
        .single();

      if (insertError) throw insertError;
      setPlaces([...places, data]);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating place:', err);
      throw err;
    }
  };

  const updatePlace = async (placeId: string, updates: any) => {
    try {
      const { data, error: updateError } = await supabase
        .from('places')
        .update(updates)
        .eq('id', placeId)
        .select()
        .single();

      if (updateError) throw updateError;
      setPlaces(places.map(p => p.id === placeId ? data : p));
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating place:', err);
      throw err;
    }
  };

  return { places, loading, error, createPlace, updatePlace };
}

/**
 * Hook to fetch a single place by ID
 */
export function usePlace(placeId: string | null) {
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placeId) {
      setLoading(false);
      return;
    }

    const fetchPlace = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('places')
          .select('*')
          .eq('id', placeId)
          .single();

        if (fetchError) throw fetchError;
        setPlace(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching place:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [placeId]);

  return { place, loading, error };
}

/**
 * Hook to submit and manage verifications
 */
export function useVerifications(placeId?: string, userId?: string) {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        setLoading(true);
        let query = supabase.from('verifications').select(`
          *,
          place:places(*),
          user:profiles(*)
        `);

        if (placeId) {
          query = query.eq('place_id', placeId);
        }
        if (userId) {
          query = query.eq('user_id', userId);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setVerifications(data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching verifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifications();
  }, [placeId, userId]);

  const submitVerification = async (verification: {
    place_id: string;
    user_id: string;
    rating: number;
    review_text?: string;
    photos?: any[];
    gps_location?: any;
  }) => {
    try {
      const { data, error: insertError } = await supabase
        .from('verifications')
        .insert([verification])
        .select()
        .single();

      if (insertError) throw insertError;
      setVerifications([data, ...verifications]);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error submitting verification:', err);
      throw err;
    }
  };

  return { verifications, loading, error, submitVerification };
}

/**
 * Hook to fetch and manage user rewards
 */
export function useRewards(userId: string | null) {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchRewards = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('rewards')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setRewards(data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching rewards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [userId]);

  const claimReward = async (rewardId: string) => {
    try {
      const { data, error: updateError } = await supabase
        .from('rewards')
        .update({ status: 'claimed', claimed_at: new Date().toISOString() })
        .eq('id', rewardId)
        .select()
        .single();

      if (updateError) throw updateError;
      setRewards(rewards.map(r => r.id === rewardId ? data : r));
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error claiming reward:', err);
      throw err;
    }
  };

  return { rewards, loading, error, claimReward };
}

/**
 * Hook to fetch credit transactions
 */
export function useCreditTransactions(userId: string | null) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (fetchError) throw fetchError;
        setTransactions(data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  return { transactions, loading, error };
}

/**
 * Hook to fetch verification tasks
 */
export function useVerificationTasks(filters?: {
  status?: string;
  assigned_to?: string;
  limit?: number;
}) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        let query = supabase.from('verification_tasks').select(`
          *,
          place:places(*)
        `);

        if (filters?.status) {
          query = query.eq('status', filters.status);
        }
        if (filters?.assigned_to) {
          query = query.eq('assigned_to', filters.assigned_to);
        }
        if (filters?.limit) {
          query = query.limit(filters.limit);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setTasks(data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filters?.status, filters?.assigned_to, filters?.limit]);

  const assignTask = async (taskId: string, userId: string) => {
    try {
      const { data, error: updateError } = await supabase
        .from('verification_tasks')
        .update({ assigned_to: userId, status: 'assigned' })
        .eq('id', taskId)
        .select()
        .single();

      if (updateError) throw updateError;
      setTasks(tasks.map(t => t.id === taskId ? data : t));
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error assigning task:', err);
      throw err;
    }
  };

  const completeTask = async (taskId: string, verificationId: string) => {
    try {
      const { data, error: updateError } = await supabase
        .from('verification_tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          verification_id: verificationId
        })
        .eq('id', taskId)
        .select()
        .single();

      if (updateError) throw updateError;
      setTasks(tasks.map(t => t.id === taskId ? data : t));
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error completing task:', err);
      throw err;
    }
  };

  return { tasks, loading, error, assignTask, completeTask };
}

/**
 * Hook to fetch user achievements
 */
export function useUserAchievements(userId: string | null) {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('user_achievements')
          .select(`
            *,
            achievement:achievements(*)
          `)
          .eq('user_id', userId)
          .order('earned_at', { ascending: false });

        if (fetchError) throw fetchError;
        setAchievements(data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [userId]);

  return { achievements, loading, error };
}

/**
 * Hook to fetch leaderboard
 */
export function useLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'monthly', limit = 10) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('leaderboard')
          .select(`
            *,
            user:profiles(*)
          `)
          .eq('period', period)
          .order('rank', { ascending: true })
          .limit(limit);

        if (fetchError) throw fetchError;
        setLeaderboard(data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [period, limit]);

  return { leaderboard, loading, error };
}
