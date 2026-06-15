import { callServer } from './supabase/client';

/**
 * Seed demo data to Supabase backend
 * This populates the database with sample places, users, and stats
 */
export async function seedDemoData() {
  try {
    console.log('🌱 Seeding demo data to Supabase...');

    // 1. Create demo user stats
    await callServer('/users/demo-user-123/stats', {
      method: 'POST',
      body: JSON.stringify({
        level: 2,
        xp: 450,
        trustScore: 87,
        totalEarnings: 12450,
        monthlyEarnings: 3200,
        verificationCount: 8,
        streak: 12,
      }),
    });
    console.log('✅ User stats created');

    // 2. Create some sample places
    const samplePlaces = [
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
        price: '₹200-400 per person',
        verified: true,
        trending: true,
      },
    ];

    for (const place of samplePlaces) {
      await callServer('/places', {
        method: 'POST',
        body: JSON.stringify(place),
      });
    }
    console.log('✅ Sample places created');

    // 3. Create sample verifications
    const sampleVerifications = [
      {
        placeId: 'place-grand-plaza',
        userId: 'demo-user-123',
        rating: 5,
        comments: 'Excellent hotel with great amenities!',
        gpsLocation: { latitude: 12.9716, longitude: 77.5946 },
        photos: [],
      },
      {
        placeId: 'place-cratis-hospital',
        userId: 'demo-user-123',
        rating: 5,
        comments: 'Clean and professional medical facility.',
        gpsLocation: { latitude: 12.9616, longitude: 77.6046 },
        photos: [],
      },
    ];

    for (const verification of sampleVerifications) {
      await callServer('/verifications', {
        method: 'POST',
        body: JSON.stringify(verification),
      });
    }
    console.log('✅ Sample verifications created');

    // 4. Create sample rewards
    const sampleRewards = [
      {
        type: 'Cashback',
        amount: '₹500',
        description: 'Earned from hotel verification',
        status: 'claimed',
      },
      {
        type: 'Gift Card',
        amount: '₹1000 Amazon',
        description: 'Monthly achievement reward',
        status: 'pending',
      },
      {
        type: 'Coins',
        amount: '250 coins',
        description: 'Streak bonus',
        status: 'claimed',
      },
    ];

    for (const reward of sampleRewards) {
      await callServer('/users/demo-user-123/rewards', {
        method: 'POST',
        body: JSON.stringify(reward),
      });
    }
    console.log('✅ Sample rewards created');

    console.log('🎉 Demo data seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    return { success: false, error };
  }
}

/**
 * Clear all demo data from backend
 */
export async function clearDemoData() {
  console.log('🗑️  Clearing demo data not implemented yet');
  console.log('You can manually clear data from Supabase dashboard:');
  console.log('https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf/database/tables');
}
