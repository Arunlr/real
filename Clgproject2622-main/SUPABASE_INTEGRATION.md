# Supabase Backend Integration

This project is integrated with Supabase as the backend database and API server.

## Configuration

- **Project URL**: https://zbefuotnmdvbqietdhhf.supabase.co
- **Project ID**: zbefuotnmdvbqietdhhf
- **Dashboard**: https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf

## Architecture

The backend uses a three-tier architecture:

```
Frontend (React) → Supabase Edge Function (Hono Server) → Supabase Database (PostgreSQL)
```

### Backend Server

The Hono web server is located at `/supabase/functions/server/index.tsx` and provides REST API endpoints:

#### Health Check
- `GET /make-server-5bf721dd/health` - Server health check

#### Places
- `GET /make-server-5bf721dd/places` - Get all verified places
- `GET /make-server-5bf721dd/places/:id` - Get specific place by ID
- `POST /make-server-5bf721dd/places` - Save or update a place

#### Verifications
- `GET /make-server-5bf721dd/verifications/:placeId` - Get verifications for a place
- `POST /make-server-5bf721dd/verifications` - Submit a new verification

#### Users
- `GET /make-server-5bf721dd/users/:userId` - Get user profile
- `POST /make-server-5bf721dd/users/:userId` - Update user profile
- `GET /make-server-5bf721dd/users/:userId/stats` - Get user stats (XP, trust score, earnings, etc.)
- `POST /make-server-5bf721dd/users/:userId/stats` - Update user stats

#### Rewards
- `GET /make-server-5bf721dd/users/:userId/rewards` - Get user rewards
- `POST /make-server-5bf721dd/users/:userId/rewards` - Add reward to user

#### Leaderboard
- `GET /make-server-5bf721dd/leaderboard` - Get leaderboard data

### Database

The database uses a key-value store table called `kv_store_5bf721dd` for flexible data storage.

**Table Schema:**
```sql
CREATE TABLE kv_store_5bf721dd (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

View the database at: https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf/database/tables

## Frontend Usage

### Supabase Client

The Supabase client is available at `src/utils/supabase/client.ts`:

```typescript
import { supabase, callServer } from '@/utils/supabase/client';

// Call backend API
const data = await callServer('/places');

// Direct Supabase usage (if needed)
const { data, error } = await supabase.from('table_name').select('*');
```

### React Hooks

Pre-built hooks are available in `src/hooks/useSupabase.ts`:

#### useUserStats
```typescript
import { useUserStats } from '@/hooks/useSupabase';

function MyComponent() {
  const { stats, loading, error, updateStats } = useUserStats('user-123');

  // stats contains: { xp, trustScore, totalEarnings, monthlyEarnings, verificationCount, streak, level }
}
```

#### usePlaces
```typescript
import { usePlaces } from '@/hooks/useSupabase';

function MyComponent() {
  const { places, loading, error, savePlace } = usePlaces();

  const handleSave = async () => {
    await savePlace({ id: 'place-1', name: 'Grand Hotel', ... });
  };
}
```

#### useVerification
```typescript
import { useVerification } from '@/hooks/useSupabase';

function MyComponent() {
  const { submitVerification, submitting, error } = useVerification();

  const handleSubmit = async () => {
    await submitVerification({
      placeId: 'place-1',
      userId: 'user-123',
      rating: 5,
      comments: 'Great place!',
      gpsLocation: { latitude: 12.9716, longitude: 77.5946 }
    });
  };
}
```

#### useRewards
```typescript
import { useRewards } from '@/hooks/useSupabase';

function MyComponent() {
  const { rewards, loading, error, addReward } = useRewards('user-123');
}
```

#### useLeaderboard
```typescript
import { useLeaderboard } from '@/hooks/useSupabase';

function MyComponent() {
  const { leaderboard, loading, error } = useLeaderboard();
}
```

## Key-Value Store Helper

The server provides a KV store interface in `/supabase/functions/server/kv_store.tsx`:

```typescript
import * as kv from "./kv_store.tsx";

// Set a value
await kv.set("user:123", { name: "John", email: "john@example.com" });

// Get a value
const user = await kv.get("user:123");

// Delete a value
await kv.del("user:123");

// Multiple operations
await kv.mset(["key1", "key2"], [value1, value2]);
const values = await kv.mget(["key1", "key2"]);
await kv.mdel(["key1", "key2"]);

// Get all keys with prefix
const users = await kv.getByPrefix("user:");
```

## Environment Variables

The server automatically uses these environment variables (managed by Figma Make):
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side key with admin privileges
- `SUPABASE_ANON_KEY` - Public anonymous key (used in frontend)

## Important Notes

1. **DO NOT** create migration files or DDL statements - the KV store is flexible enough for most use cases
2. **DO NOT** leak `SUPABASE_SERVICE_ROLE_KEY` to the frontend - it has admin privileges
3. **ALWAYS** use the `publicAnonKey` in frontend code
4. **Server routes** are prefixed with `/make-server-5bf721dd/`
5. **Error handling** is important - always log detailed error messages for debugging

## Adding Custom Endpoints

To add new endpoints, edit `/supabase/functions/server/index.tsx`:

```typescript
app.get("/make-server-5bf721dd/my-endpoint", async (c) => {
  try {
    // Your logic here
    const data = await kv.get("some:key");
    return c.json({ data });
  } catch (error) {
    console.log('Error in my-endpoint:', error);
    return c.json({ error: error.message }, 500);
  }
});
```

## Testing

Test the health endpoint:
```bash
curl https://zbefuotnmdvbqietdhhf.supabase.co/functions/v1/make-server-5bf721dd/health
```

Expected response:
```json
{"status":"ok"}
```
