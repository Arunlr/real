import { useState, useEffect } from 'react';
import { callServer } from '../utils/supabase/client';

/**
 * Hook to fetch user stats from the backend
 */
export function useUserStats(userId: string | null) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await callServer(`/users/${userId}/stats`);
        setStats(data.stats);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching user stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  const updateStats = async (newStats: any) => {
    if (!userId) return;

    try {
      await callServer(`/users/${userId}/stats`, {
        method: 'POST',
        body: JSON.stringify(newStats),
      });
      setStats(newStats);
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating user stats:', err);
    }
  };

  return { stats, loading, error, updateStats };
}

/**
 * Hook to fetch places from the backend
 */
export function usePlaces() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const data = await callServer('/places');
        setPlaces(data.places);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching places:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const savePlace = async (place: any) => {
    try {
      await callServer('/places', {
        method: 'POST',
        body: JSON.stringify(place),
      });
      // Refresh places list
      const data = await callServer('/places');
      setPlaces(data.places);
    } catch (err: any) {
      setError(err.message);
      console.error('Error saving place:', err);
    }
  };

  return { places, loading, error, savePlace };
}

/**
 * Hook to submit a verification
 */
export function useVerification() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitVerification = async (verification: {
    placeId: string;
    userId: string;
    photos?: string[];
    rating?: number;
    comments?: string;
    gpsLocation?: { latitude: number; longitude: number };
  }) => {
    try {
      setSubmitting(true);
      setError(null);
      const data = await callServer('/verifications', {
        method: 'POST',
        body: JSON.stringify(verification),
      });
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error submitting verification:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitVerification, submitting, error };
}

/**
 * Hook to fetch user rewards
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
        const data = await callServer(`/users/${userId}/rewards`);
        setRewards(data.rewards);
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

  const addReward = async (reward: any) => {
    if (!userId) return;

    try {
      await callServer(`/users/${userId}/rewards`, {
        method: 'POST',
        body: JSON.stringify(reward),
      });
      // Refresh rewards list
      const data = await callServer(`/users/${userId}/rewards`);
      setRewards(data.rewards);
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding reward:', err);
    }
  };

  return { rewards, loading, error, addReward };
}

/**
 * Hook to fetch leaderboard
 */
export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await callServer('/leaderboard');
        setLeaderboard(data.leaderboard);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return { leaderboard, loading, error };
}
