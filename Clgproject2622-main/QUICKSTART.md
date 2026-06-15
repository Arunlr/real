# 🚀 Quick Start Guide

Get your LOCALS.COM verification platform up and running with Supabase in 5 minutes!

## Step 1: Verify Backend Connection (30 seconds)

Open your browser and visit:
```
https://zbefuotnmdvbqietdhhf.supabase.co/functions/v1/make-server-5bf721dd/health
```

You should see:
```json
{"status":"ok"}
```

✅ If you see this, your backend is live!

## Step 2: Seed Demo Data (1 minute)

1. Navigate to the **Admin Panel** in your app:
   ```
   /admin
   ```

2. Click the **"Seed Data"** button

3. Wait for the success message: "Demo data seeded successfully! 🎉"

This creates:
- ✅ Demo user with stats (XP: 450, Trust Score: 87%)
- ✅ 3 sample places (hotel, hospital, restaurant)
- ✅ 2 sample verifications
- ✅ 3 sample rewards

## Step 3: View Your Dashboard (30 seconds)

Navigate to:
```
/rewards-levels
```

You should now see:
- 📊 Your XP progress (450/1500 XP)
- 🛡️ Trust Score: 87%
- 💰 Monthly Earnings: ₹3,200
- 🔥 Streak: 12 days

All data is now coming from **Supabase backend**!

## Step 4: Test the Admin Panel (1 minute)

On the `/admin` page:

1. Click **"Test Backend"** button
2. View the test results showing:
   - Health check status
   - User stats from database

## Step 5: Explore Nearby Places (1 minute)

Navigate to:
```
/nearby
```

Features to try:
- 📍 Filter by location distance
- 🏨 Filter by place type (Hotels, Gyms, Restaurants, Hospitals)
- 🥗 Filter restaurants by diet (Veg/Non-veg)
- ⭐ Sort by rating or verification count

## 🎉 You're Done!

Your app is now fully integrated with Supabase!

## Next Steps

### Add More Data

Use the hooks to add more places:

```typescript
import { usePlaces } from '@/hooks/useSupabase';

const { savePlace } = usePlaces();

await savePlace({
  id: 'my-place-123',
  name: 'Amazing Hotel',
  type: 'hotel',
  rating: 4.8,
  address: 'Bangalore',
  verified: true,
});
```

### Update User Stats

```typescript
import { useUserStats } from '@/hooks/useSupabase';

const { updateStats } = useUserStats('demo-user-123');

await updateStats({
  xp: 500,
  trustScore: 90,
  monthlyEarnings: 4000,
});
```

### Submit Verifications

```typescript
import { useVerification } from '@/hooks/useSupabase';

const { submitVerification } = useVerification();

await submitVerification({
  placeId: 'place-123',
  userId: 'demo-user-123',
  rating: 5,
  comments: 'Verified!',
  gpsLocation: { latitude: 12.9716, longitude: 77.5946 }
});
```

## 🔍 View Data in Supabase

Visit your Supabase dashboard:
```
https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf/database/tables
```

Navigate to the `kv_store_5bf721dd` table to see all your data:
- Keys like `user:demo-user-123:stats`
- Keys like `place:place-grand-plaza`
- Keys like `verification:...`
- Keys like `reward:...`

## 🐛 Troubleshooting

### Backend not responding?
- Check the health endpoint: `/make-server-5bf721dd/health`
- View Supabase logs in dashboard
- Check browser console for errors

### No data showing?
- Run "Seed Data" from `/admin`
- Check that userId matches in hooks
- Verify network requests in browser DevTools

### Stats not updating?
- Make sure you're using `updateStats()` method
- Check that the backend returned success
- Refresh the page to see changes

## 📖 Learn More

- Read `SUPABASE_INTEGRATION.md` for complete API docs
- Check `SUPABASE_EXAMPLES.md` for code examples
- Visit `/admin` for testing tools

## 🆘 Need Help?

1. Check browser console for errors
2. Test backend with `/admin` → "Test Backend"
3. View Supabase logs in dashboard
4. Check network tab for failed requests

---

**🎊 Congratulations!** You've successfully set up a full-stack verification platform with React frontend and Supabase backend!
