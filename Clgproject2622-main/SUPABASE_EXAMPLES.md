# Supabase Integration Examples

## Example 1: Update RewardsLevelsDashboard with Backend Data

Replace mock state in `src/app/pages/RewardsLevelsDashboard.tsx`:

```typescript
// BEFORE (Mock data)
const [currentLevel, setCurrentLevel] = useState(2);
const [xp, setXp] = useState(450);
const [trustScore, setTrustScore] = useState(87);

// AFTER (Real backend data)
import { useUserStats } from '../../hooks/useSupabase';

export default function RewardsLevelsDashboard() {
  const userId = 'current-user-id'; // Get from auth context
  const { stats, loading, error, updateStats } = useUserStats(userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const currentLevel = stats?.level || 1;
  const xp = stats?.xp || 0;
  const trustScore = stats?.trustScore || 0;
  // ... rest of component
}
```

## Example 2: Save Place Verification

```typescript
import { useVerification } from '@/hooks/useSupabase';

function VerifyPlaceButton({ placeId }: { placeId: string }) {
  const { submitVerification, submitting } = useVerification();

  const handleVerify = async () => {
    try {
      await submitVerification({
        placeId,
        userId: 'current-user-id',
        rating: 5,
        comments: 'Verified location',
        gpsLocation: {
          latitude: 12.9716,
          longitude: 77.5946
        }
      });
      alert('Verification submitted successfully!');
    } catch (err) {
      alert('Failed to submit verification');
    }
  };

  return (
    <button onClick={handleVerify} disabled={submitting}>
      {submitting ? 'Submitting...' : 'Verify This Place'}
    </button>
  );
}
```

## Example 3: Display User Rewards

```typescript
import { useRewards } from '@/hooks/useSupabase';

function RewardsList({ userId }: { userId: string }) {
  const { rewards, loading, error, addReward } = useRewards(userId);

  if (loading) return <div>Loading rewards...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Rewards ({rewards.length})</h2>
      {rewards.map((reward: any) => (
        <div key={reward.id}>
          <h3>{reward.type}</h3>
          <p>{reward.amount}</p>
        </div>
      ))}
    </div>
  );
}
```

## Example 4: Leaderboard with Live Data

```typescript
import { useLeaderboard } from '@/hooks/useSupabase';

function LeaderboardSection() {
  const { leaderboard, loading, error } = useLeaderboard();

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div>Error loading leaderboard</div>;

  return (
    <div>
      {leaderboard.map((user: any, index: number) => (
        <div key={user.id} className="leaderboard-item">
          <span>#{index + 1}</span>
          <span>{user.name}</span>
          <span>{user.xp} XP</span>
        </div>
      ))}
    </div>
  );
}
```

## Example 5: Direct Server Call

```typescript
import { callServer } from '@/utils/supabase/client';

async function customOperation() {
  try {
    // GET request
    const places = await callServer('/places');
    console.log('Places:', places);

    // POST request
    const result = await callServer('/places', {
      method: 'POST',
      body: JSON.stringify({
        id: 'place-123',
        name: 'New Hotel',
        type: 'hotel',
        rating: 4.5
      })
    });
    console.log('Saved:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Example 6: Save Nearby Places to Backend

```typescript
// In NearbyPlaces.tsx
import { usePlaces } from '@/hooks/useSupabase';

export default function NearbyPlaces() {
  const { places, savePlace } = usePlaces();
  
  const handleSavePlace = async (place: any) => {
    try {
      await savePlace({
        id: place.id,
        name: place.name,
        type: place.type,
        rating: place.rating,
        address: place.address,
        verified: true,
        latitude: place.latitude,
        longitude: place.longitude
      });
      console.log('Place saved to backend!');
    } catch (error) {
      console.error('Failed to save place:', error);
    }
  };

  return (
    // ... your component
  );
}
```

## Example 7: Update User Stats After Action

```typescript
import { useUserStats } from '@/hooks/useSupabase';

function CompleteTask({ userId }: { userId: string }) {
  const { stats, updateStats } = useUserStats(userId);

  const handleTaskComplete = async () => {
    // Update stats
    const newStats = {
      ...stats,
      xp: (stats?.xp || 0) + 50,
      verificationCount: (stats?.verificationCount || 0) + 1,
      monthlyEarnings: (stats?.monthlyEarnings || 0) + 500
    };

    await updateStats(newStats);
    console.log('Stats updated!');
  };

  return (
    <button onClick={handleTaskComplete}>
      Complete Task (+50 XP, +₹500)
    </button>
  );
}
```

## Example 8: Authentication Context (Optional)

Create a user context to manage authentication:

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

Then wrap your app:

```typescript
// src/app/App.tsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
        <Chatbot />
      </ErrorBoundary>
    </AuthProvider>
  );
}
```

And use it in components:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();

  if (!user) {
    return <LoginForm onSubmit={signIn} />;
  }

  return <div>Welcome, {user.email}!</div>;
}
```
