# Database Setup Guide

## Overview

Your LOCALS.COM application now has a complete PostgreSQL database schema with all necessary tables, indexes, Row Level Security (RLS) policies, and seed data.

---

## 📊 Database Schema

### Core Tables

1. **`profiles`** - User profiles extending Supabase auth
   - User information (name, email, phone, city)
   - Stats (XP, trust score, level, streak, earnings)
   - Verification count tracking

2. **`places`** - All locations (hotels, gyms, restaurants, hospitals, etc.)
   - Place information and metadata
   - GPS coordinates
   - Ratings and verification counts
   - Type-specific data (diet type for restaurants, specialities for hospitals)

3. **`verifications`** - User-submitted reviews and verifications
   - Linked to places and users
   - Ratings, photos, GPS location
   - Status tracking (pending/approved/rejected)
   - Trust score

4. **`rewards`** - User rewards and incentives
   - Various reward types (cashback, gift cards, coins, bonuses)
   - Status tracking (pending/claimed/expired)
   - Expiration dates

5. **`credit_transactions`** - All user credit/coin transactions
   - Transaction history
   - Balance tracking
   - Linked to verifications and rewards

6. **`verification_tasks`** - Available verification tasks
   - Task assignments
   - Reward amounts
   - Urgency levels
   - Deadline tracking

7. **`achievements`** - System-wide badges and achievements
   - Achievement definitions
   - Requirements and rewards

8. **`user_achievements`** - User-earned achievements
   - Tracks when users earn badges

9. **`leaderboard`** - Rankings by period
   - Daily, weekly, monthly, all-time rankings
   - Score and verification tracking

---

## 🚀 Setup Instructions

### Step 1: Apply Database Migrations

You have two migration files ready:

1. **Schema Migration**: `/supabase/migrations/20260513000001_initial_schema.sql`
   - Creates all tables, indexes, triggers
   - Sets up Row Level Security
   - Adds functions for auto-updating ratings

2. **Seed Data Migration**: `/supabase/migrations/20260513000002_seed_data.sql`
   - Populates demo places (hotels, gyms, restaurants, hospitals, cafes)
   - Creates sample achievements
   - Adds verification tasks

### Option A: Apply via Supabase Dashboard

1. Go to your Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf
   ```

2. Navigate to **SQL Editor** in the left sidebar

3. Click **New Query**

4. Copy the contents of `/supabase/migrations/20260513000001_initial_schema.sql`

5. Paste into the SQL editor

6. Click **Run** (or press Ctrl+Enter)

7. Wait for completion (should take a few seconds)

8. Repeat steps 3-7 for `/supabase/migrations/20260513000002_seed_data.sql`

9. Verify tables were created:
   - Go to **Database** → **Tables**
   - You should see all tables listed

### Option B: Apply via Supabase CLI (Advanced)

```bash
# If you have Supabase CLI installed
supabase db push

# Or apply migrations directly
supabase db push --db-url "postgresql://postgres:[YOUR_PASSWORD]@db.zbefuotnmdvbqietdhhf.supabase.co:5432/postgres"
```

---

## 🔄 Switch to New Database Hooks

### Old Hooks (KV Store via Edge Function)
Located in: `/src/hooks/useSupabase.ts`
- Uses Edge Function server
- Goes through KV store pattern
- More complex, slower

### New Hooks (Direct Database Access) ✅
Located in: `/src/hooks/useDatabase.ts`
- Direct Supabase client queries
- Faster and simpler
- Better TypeScript support

### Migration Guide

#### Before (Old):
```typescript
import { useUserStats, usePlaces, useVerification } from '@/hooks/useSupabase';

const { stats, loading, error, updateStats } = useUserStats(userId);
const { places, loading, error, savePlace } = usePlaces();
const { submitVerification, submitting, error } = useVerification();
```

#### After (New):
```typescript
import { useProfile, usePlaces, useVerifications } from '@/hooks/useDatabase';

const { profile, loading, error, updateProfile } = useProfile(userId);
const { places, loading, error, createPlace } = usePlaces({ type: 'hotel', city: 'Bangalore' });
const { verifications, loading, error, submitVerification } = useVerifications();
```

### Available New Hooks

1. **`useProfile(userId)`**
   - Fetch user profile with stats
   - Update profile information

2. **`usePlaces(filters?)`**
   - Fetch places with optional filters (type, city, verified, limit)
   - Create new places
   - Update existing places

3. **`usePlace(placeId)`**
   - Fetch single place by ID

4. **`useVerifications(placeId?, userId?)`**
   - Fetch verifications for place or user
   - Submit new verifications
   - Includes joined data (place info, user info)

5. **`useRewards(userId)`**
   - Fetch user rewards
   - Claim rewards

6. **`useCreditTransactions(userId)`**
   - Fetch transaction history
   - Track balance changes

7. **`useVerificationTasks(filters?)`**
   - Fetch available tasks
   - Assign tasks to users
   - Mark tasks as complete

8. **`useUserAchievements(userId)`**
   - Fetch earned achievements with details

9. **`useLeaderboard(period, limit)`**
   - Fetch rankings (daily, weekly, monthly, all_time)
   - User profiles included

---

## 📝 Example Usage

### Fetch User Profile
```typescript
import { useProfile } from '@/hooks/useDatabase';

function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading, error, updateProfile } = useProfile(user?.id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{profile.full_name}</h1>
      <p>Level: {profile.level}</p>
      <p>XP: {profile.xp}</p>
      <p>Trust Score: {profile.trust_score}%</p>
      <p>Total Earnings: ₹{profile.total_earnings}</p>
    </div>
  );
}
```

### Fetch Places with Filters
```typescript
import { usePlaces } from '@/hooks/useDatabase';

function HotelsList() {
  const { places, loading, error } = usePlaces({
    type: 'hotel',
    city: 'Bangalore',
    verified: true,
    limit: 10
  });

  if (loading) return <div>Loading hotels...</div>;

  return (
    <div>
      {places.map(place => (
        <div key={place.id}>
          <h3>{place.name}</h3>
          <p>{place.address}</p>
          <p>Rating: {place.rating}/5</p>
          <p>{place.verification_count} verifications</p>
        </div>
      ))}
    </div>
  );
}
```

### Submit Verification
```typescript
import { useVerifications } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';

function VerifyPlace({ placeId }: { placeId: string }) {
  const { user } = useAuth();
  const { submitVerification } = useVerifications();

  const handleSubmit = async () => {
    try {
      const result = await submitVerification({
        place_id: placeId,
        user_id: user!.id,
        rating: 5,
        review_text: 'Great place!',
        photos: ['photo1.jpg', 'photo2.jpg'],
        gps_location: {
          latitude: 12.9716,
          longitude: 77.5946,
          accuracy: 10,
          timestamp: Date.now()
        }
      });
      console.log('Verification submitted:', result);
    } catch (err) {
      console.error('Failed to submit:', err);
    }
  };

  return <button onClick={handleSubmit}>Submit Verification</button>;
}
```

### Fetch Leaderboard
```typescript
import { useLeaderboard } from '@/hooks/useDatabase';

function LeaderboardPage() {
  const { leaderboard, loading, error } = useLeaderboard('monthly', 10);

  return (
    <div>
      <h2>Top Verifiers This Month</h2>
      {leaderboard.map((entry, index) => (
        <div key={entry.id}>
          <span>#{entry.rank}</span>
          <span>{entry.user.full_name}</span>
          <span>{entry.score} points</span>
          <span>{entry.verifications_count} verifications</span>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Public Read Access
- `profiles` - Everyone can view profiles
- `places` - Everyone can view places
- `verifications` - Everyone can view verifications
- `achievements` - Everyone can view achievements
- `leaderboard` - Everyone can view rankings

### User-Specific Access
- `profiles` - Users can only update their own profile
- `user_stats` - Users can only view/insert their own stats
- `verifications` - Users can create and update their own verifications
- `rewards` - Users can only view/update their own rewards
- `credit_transactions` - Users can only view their own transactions
- `verification_tasks` - Assigned users can update their tasks

---

## 🎯 Next Steps

1. **Apply Migrations** (see Step 1 above)

2. **Update Components** to use new hooks:
   ```typescript
   // Update RewardsLevelsDashboard.tsx
   import { useProfile } from '@/hooks/useDatabase';
   
   // Update NearbyPlaces.tsx
   import { usePlaces } from '@/hooks/useDatabase';
   
   // Update AddReviewPage.tsx
   import { useVerifications } from '@/hooks/useDatabase';
   ```

3. **Test Database Connections**:
   - Navigate to `/admin` panel
   - Check if data loads correctly
   - Try creating a test verification

4. **Verify Seed Data**:
   - Check places table has hotels, gyms, restaurants
   - Check achievements table has badges
   - Check verification_tasks table has sample tasks

5. **Configure RLS (Optional)**:
   - Review RLS policies in dashboard
   - Add custom policies if needed
   - Test with different users

---

## 🗃️ Database Tables Reference

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `profiles` | User info | id, email, full_name, level, xp, trust_score |
| `places` | Locations | id, name, type, address, latitude, longitude, rating |
| `verifications` | Reviews | id, place_id, user_id, rating, review_text, photos |
| `rewards` | Incentives | id, user_id, type, amount, status |
| `credit_transactions` | History | id, user_id, type, amount, balance_after |
| `verification_tasks` | Tasks | id, place_id, assigned_to, status, reward_amount |
| `achievements` | Badges | id, name, description, requirement, reward_xp |
| `user_achievements` | Earned | id, user_id, achievement_id, earned_at |
| `leaderboard` | Rankings | id, user_id, period, rank, score |

---

## 🐛 Troubleshooting

### Tables Not Created
- Check SQL editor for errors
- Verify you're running migrations in correct order
- Check Supabase project has sufficient resources

### RLS Blocking Queries
- Check if user is authenticated
- Verify RLS policies in dashboard
- Test with different user roles

### Data Not Showing
- Check if migrations completed successfully
- Verify seed data was applied
- Check browser console for errors

### Connection Issues
- Verify Supabase URL and keys in `/utils/supabase/info.tsx`
- Check internet connection
- Verify project is not paused in Supabase dashboard

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security
- **Your Project Dashboard**: https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf

---

**🎉 Your database is now ready to use!**

All tables, indexes, triggers, and seed data are configured. Start using the new hooks to build amazing features!
