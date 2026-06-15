# LOCALS.COM - AI-Powered Real-Time Verification Platform

A premium verification platform built with React, TypeScript, Tailwind CSS, and Supabase backend.

---

## 🚨 QUICK START - COMMON ERRORS

### 1. "Invalid login credentials"
→ Create account at `/local/signup` + [disable email confirmation](https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf/auth/providers)

### 2. "Camera error: NotAllowedError: Permission denied"

---

# 🚨 ISSUES? START HERE! 🚨

## 📸 Camera/Location Not Showing on /add-review?

**Read:** [`WHAT_YOU_SHOULD_SEE.md`](./WHAT_YOU_SHOULD_SEE.md) ← **Complete guide with pictures**

**Quick Fix:**
1. Go to `/add-review`
2. Scroll down to "Add Photos" section  
3. You should see green "Upload Photo" + blue "Or Open Camera" buttons
4. If missing: Photo might be uploaded already → Hover and click X to remove

---

# 🚨 CAMERA PERMISSION ERROR? 🚨

## ⚠️ BROWSER NOT ASKING FOR PERMISSION?

### ✅ **I JUST FIXED THIS!** 

**Read:** [`FIXED_BROWSER_PROMPT.md`](./FIXED_BROWSER_PROMPT.md) ← What I changed

---

### 🎯 DO THIS NOW (30 seconds):

1. **Go to:** `/test-camera`
2. **Click:** "Test Camera Now" button
3. **You'll see:**
   - ✅ Browser asks → Click "Allow" → Done!
   - ❌ Error shown → Follow on-screen visual guide → Reset permission → Done!

**The page now shows you EXACTLY what's wrong and how to fix it!**

---

### 📖 Why Browser Doesn't Ask:

You previously clicked "Block" - browser remembers this and won't ask again.

**Fix:** Click 🔒 in address bar → Camera → Allow → Refresh → Browser asks! ✅

---

### 📚 Complete Guides:
- **[`FIXED_BROWSER_PROMPT.md`](./FIXED_BROWSER_PROMPT.md)** ⭐ - What I fixed + how it works now
- **[`HOW_TO_MAKE_BROWSER_ASK.md`](./HOW_TO_MAKE_BROWSER_ASK.md)** - Step-by-step reset guide
- **[`BROWSER_WILL_ASK_NOW.md`](./BROWSER_WILL_ASK_NOW.md)** - Technical details

---

## 🎯 THREE OPTIONS - PICK ONE:

### 1. ⚡ **Ultra Fast Fix** (30 seconds)
**Read:** [`DO_THIS_NOW.md`](./DO_THIS_NOW.md) → Go to `/test-camera` → Click button → Allow → Done!

### 2. 🎬 **Demo Preparation** (5 minutes)
**Read:** [`DEMO_READY_NOW.md`](./DEMO_READY_NOW.md) → Complete setup + checklist + what to say

### 3. 📚 **Complete Solution** (15 minutes)
**Read:** [`FINAL_CAMERA_SOLUTION.md`](./FINAL_CAMERA_SOLUTION.md) → Guaranteed fix + all browsers

### 4. 📦 **See Everything Available**
**Read:** [`EVERYTHING_YOU_NEED.md`](./EVERYTHING_YOU_NEED.md) → All tools, guides, and resources

---

## 🎥 FOR EXTERNAL DEMO - GET CAMERA WORKING NOW

**If you need camera working for a presentation/demo, follow this:**

### STEP 1: Test Camera First (2 minutes)
**Go to: `/test-camera`**

This simple page will:
- ✅ Test if camera works
- ✅ Show you EXACTLY what's wrong if it fails
- ✅ Give you step-by-step fix instructions
- ✅ Verify you're ready for demo

### STEP 2: Fix Permission (1 minute)
If test fails, you'll see:
1. Click **🔒 lock icon** in browser address bar (top-left)
2. Find **"Camera"** 
3. Change to **"Allow"**
4. Refresh page (F5)
5. Click "Try Again"
6. ✅ Camera works!

### STEP 3: Complete Guide
**Read: [`FINAL_CAMERA_SOLUTION.md`](./FINAL_CAMERA_SOLUTION.md)**

This is a complete, foolproof guide for getting camera working:
- Step-by-step instructions
- Browser-specific fixes
- Demo day checklist
- What to say during demo
- Backup plans

---

## 📁 Alternative: Upload Photo

**Don't need camera? Use upload instead:**
1. Go to `/add-review`
2. Click **green "Upload Photo"** button
3. Select photo → Done! ✅

**Resources:**
- [`FINAL_CAMERA_SOLUTION.md`](./FINAL_CAMERA_SOLUTION.md) - Complete camera setup for demo
- `/test-camera` - Simple camera test page
- `/diagnostics-full` - Advanced diagnostics

**Other helpful guides:**
- [`BUGS_FIXED.md`](./BUGS_FIXED.md) - All recent bug fixes
- [`DATABASE_SETUP_GUIDE.md`](./DATABASE_SETUP_GUIDE.md) - Database setup

---

## 🚀 Features

- **Rewards & Levels System**: 6-tier progression from Bronze to Legend Verifier with gamified earning potential
- **Nearby Places**: Discover verified hotels, gyms, restaurants, hospitals, and more with real-time location
- **Restaurant Filtering**: Filter by dietary preferences (vegetarian/non-vegetarian) with color-coded UI
- **Hospital Directory**: Comprehensive multi-speciality hospital listings
- **Real-time Backend**: Full Supabase integration with REST API
- **User Authentication**: Context-based auth system (ready for Supabase Auth)
- **Premium UI**: Dark glassmorphism design with Motion/Framer animations

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Server**: Hono.js on Deno runtime
- **Icons**: Lucide React
- **Routing**: React Router v7

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at the preview URL provided by Figma Make.

## 🗄️ Supabase Integration

### Project Information
- **Project URL**: https://zbefuotnmdvbqietdhhf.supabase.co
- **Project ID**: zbefuotnmdvbqietdhhf
- **Dashboard**: https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf

### Backend Architecture

```
Frontend (React) → Edge Function (Hono Server) → PostgreSQL (KV Store)
```

### Available Endpoints

**Health Check**
```
GET /make-server-5bf721dd/health
```

**Places**
```
GET  /make-server-5bf721dd/places
GET  /make-server-5bf721dd/places/:id
POST /make-server-5bf721dd/places
```

**Verifications**
```
GET  /make-server-5bf721dd/verifications/:placeId
POST /make-server-5bf721dd/verifications
```

**Users**
```
GET  /make-server-5bf721dd/users/:userId
POST /make-server-5bf721dd/users/:userId
GET  /make-server-5bf721dd/users/:userId/stats
POST /make-server-5bf721dd/users/:userId/stats
```

**Rewards**
```
GET  /make-server-5bf721dd/users/:userId/rewards
POST /make-server-5bf721dd/users/:userId/rewards
```

**Leaderboard**
```
GET  /make-server-5bf721dd/leaderboard
```

### Testing the Backend

Visit the **Admin Panel** at `/admin` to:
- ✅ Seed demo data
- ✅ Test backend connectivity
- ✅ View API responses
- ✅ Clear data

Or test manually:
```bash
curl https://zbefuotnmdvbqietdhhf.supabase.co/functions/v1/make-server-5bf721dd/health
```

## 📱 Key Pages

- `/` - Login page
- `/home` - Landing page with map
- `/nearby` - Nearby places with filters (hotels, gyms, restaurants, hospitals)
- `/rewards-levels` - Comprehensive rewards dashboard
- `/admin` - Supabase admin panel for testing
- `/account` - User account settings

## 🎨 UI Components

### Rewards & Levels Dashboard
- Hero section with XP, trust score, earnings, streak
- 6 progression levels with unique gradients
- 8 reward types (cashback, gift cards, coins, etc.)
- AI trust score analytics with weekly performance
- Top verifiers leaderboard
- Task marketplace with urgency multipliers
- Future ecosystem vision (blockchain, AI, government)

### Nearby Places
- Real-time geolocation
- 7 place categories: hotels, gyms, restaurants, hospitals, neighborhoods, schools, cafes
- Diet filter for restaurants (veg/non-veg with color switching)
- Distance-based filtering (up to 10km)
- Sort by distance, rating, or verification count

## 🔧 Using Supabase Hooks

### Fetch User Stats
```typescript
import { useUserStats } from '@/hooks/useSupabase';

function MyComponent() {
  const { stats, loading, error, updateStats } = useUserStats('user-id');
  
  // stats: { xp, trustScore, totalEarnings, monthlyEarnings, verificationCount, streak, level }
}
```

### Submit Verification
```typescript
import { useVerification } from '@/hooks/useSupabase';

function VerifyButton() {
  const { submitVerification, submitting } = useVerification();
  
  await submitVerification({
    placeId: 'place-123',
    userId: 'user-123',
    rating: 5,
    comments: 'Great place!',
    gpsLocation: { latitude: 12.9716, longitude: 77.5946 }
  });
}
```

### Get Places
```typescript
import { usePlaces } from '@/hooks/useSupabase';

function PlacesList() {
  const { places, loading, error, savePlace } = usePlaces();
}
```

### Get Rewards
```typescript
import { useRewards } from '@/hooks/useSupabase';

function RewardsList() {
  const { rewards, loading, error, addReward } = useRewards('user-id');
}
```

### Get Leaderboard
```typescript
import { useLeaderboard } from '@/hooks/useSupabase';

function Leaderboard() {
  const { leaderboard, loading, error } = useLeaderboard();
}
```

## 🔐 Authentication

The app uses a React Context for authentication:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth();
  
  // user: { id, email, name }
}
```

Currently configured with a demo user. To enable real auth:
1. Configure Supabase Auth in the dashboard
2. Update AuthContext to use real signIn/signUp methods
3. Remove mock user fallback

## 📚 Documentation

- `SUPABASE_INTEGRATION.md` - Complete backend integration guide
- `SUPABASE_EXAMPLES.md` - 8 practical code examples
- Server code: `/supabase/functions/server/index.tsx`
- KV Store: `/supabase/functions/server/kv_store.tsx`

## 🎯 Next Steps

1. **Seed Demo Data**: Visit `/admin` and click "Seed Data"
2. **Test Backend**: Click "Test Backend" to verify connectivity
3. **View Dashboard**: Navigate to `/rewards-levels` to see rewards with real data
4. **Add Places**: Submit place verifications with GPS location
5. **Track Progress**: Watch XP and earnings update in real-time

## 🌟 Featured Places

### Hotels
- Grand Plaza Hotel
- Skyline Suites
- Business Inn Express

### Gyms
- GYMX fitness redefined (cult.fit)
- yoh fitness
- cult Kalyan Nagar

### Restaurants
- Kake Di Hatti (Veg)
- Rameshwaram Cafe (Veg)
- Meghana Foods (Non-veg)
- Empire Restaurant (Non-veg)

### Hospitals
- Cratis Hospital
- East Point Hospital
- New Life Speciality Hospital
- Sunrise Hospital
- Trilife Hospital
- SURAKSHAA HOSPITAL

## 🔗 Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf
- **Database Tables**: https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf/database/tables
- **Health Endpoint**: https://zbefuotnmdvbqietdhhf.supabase.co/functions/v1/make-server-5bf721dd/health

## 📄 License

Built with ❤️ using Figma Make and Claude Code
