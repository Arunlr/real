-- Seed Data for LOCALS.COM
-- Created: 2026-05-13

-- =====================================================
-- SEED DEMO PLACES
-- =====================================================

-- Hotels
INSERT INTO public.places (id, name, type, address, city, latitude, longitude, rating, verified, verification_count, amenities, metadata) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Grand Plaza Hotel', 'hotel', 'MG Road, Bangalore', 'Bangalore', 12.9756, 77.6048, 4.5, true, 23,
   '["WiFi", "Pool", "Gym", "Restaurant", "Parking"]'::jsonb,
   '{"price_range": "₹₹₹", "stars": 4}'::jsonb),
  ('11111111-1111-1111-1111-111111111112', 'Skyline Suites', 'hotel', 'Indiranagar, Bangalore', 'Bangalore', 12.9716, 77.6412, 4.3, true, 18,
   '["WiFi", "Restaurant", "Room Service"]'::jsonb,
   '{"price_range": "₹₹", "stars": 3}'::jsonb),
  ('11111111-1111-1111-1111-111111111113', 'Business Inn Express', 'hotel', 'Koramangala, Bangalore', 'Bangalore', 12.9352, 77.6245, 4.0, true, 12,
   '["WiFi", "Breakfast", "Parking"]'::jsonb,
   '{"price_range": "₹", "stars": 2}'::jsonb);

-- Gyms
INSERT INTO public.places (id, name, type, address, city, latitude, longitude, rating, verified, verification_count, amenities, metadata) VALUES
  ('22222222-2222-2222-2222-222222222221', 'GYMX fitness redefined', 'gym', 'Indiranagar, Bangalore', 'Bangalore', 12.9784, 77.6408, 4.7, true, 45,
   '["Cardio", "Weights", "Personal Training", "Steam Bath"]'::jsonb,
   '{"membership_plans": ["Monthly", "Quarterly", "Yearly"]}'::jsonb),
  ('22222222-2222-2222-2222-222222222222', 'yoh fitness', 'gym', 'Koramangala, Bangalore', 'Bangalore', 12.9279, 77.6271, 4.4, true, 32,
   '["Cardio", "Yoga", "Zumba"]'::jsonb,
   '{"membership_plans": ["Monthly", "Yearly"]}'::jsonb),
  ('22222222-2222-2222-2222-222222222223', 'cult Kalyan Nagar', 'gym', 'Kalyan Nagar, Bangalore', 'Bangalore', 13.0280, 77.6390, 4.6, true, 38,
   '["Cardio", "Weights", "CrossFit", "Yoga"]'::jsonb,
   '{"membership_plans": ["Monthly", "Quarterly", "Yearly"]}'::jsonb);

-- Restaurants
INSERT INTO public.places (id, name, type, address, city, latitude, longitude, rating, verified, verification_count, diet_type, amenities, metadata) VALUES
  ('33333333-3333-3333-3333-333333333331', 'Kake Di Hatti', 'restaurant', 'Jayanagar, Bangalore', 'Bangalore', 12.9250, 77.5937, 4.6, true, 67, 'veg',
   '["Dine-in", "Takeaway", "Home Delivery"]'::jsonb,
   '{"cuisine": "North Indian", "price_range": "₹₹"}'::jsonb),
  ('33333333-3333-3333-3333-333333333332', 'Rameshwaram Cafe', 'restaurant', 'Indiranagar, Bangalore', 'Bangalore', 12.9716, 77.6412, 4.8, true, 89, 'veg',
   '["Dine-in", "Takeaway"]'::jsonb,
   '{"cuisine": "South Indian", "price_range": "₹"}'::jsonb),
  ('33333333-3333-3333-3333-333333333333', 'Meghana Foods', 'restaurant', 'Koramangala, Bangalore', 'Bangalore', 12.9352, 77.6245, 4.5, true, 54, 'non-veg',
   '["Dine-in", "Takeaway", "Home Delivery"]'::jsonb,
   '{"cuisine": "Biryani", "price_range": "₹₹"}'::jsonb),
  ('33333333-3333-3333-3333-333333333334', 'Empire Restaurant', 'restaurant', 'Church Street, Bangalore', 'Bangalore', 12.9719, 77.6037, 4.4, true, 43, 'non-veg',
   '["Dine-in", "Takeaway"]'::jsonb,
   '{"cuisine": "Biryani", "price_range": "₹₹"}'::jsonb);

-- Hospitals
INSERT INTO public.places (id, name, type, address, city, latitude, longitude, rating, verified, verification_count, specialities, amenities, metadata) VALUES
  ('44444444-4444-4444-4444-444444444441', 'Cratis Hospital', 'hospital', 'HSR Layout, Bangalore', 'Bangalore', 12.9121, 77.6446, 4.3, true, 28,
   '["Cardiology", "Orthopedics", "General Medicine"]'::jsonb,
   '["24/7 Emergency", "Pharmacy", "Lab", "Parking"]'::jsonb,
   '{"beds": 150, "specialization": "Multi-Speciality"}'::jsonb),
  ('44444444-4444-4444-4444-444444444442', 'East Point Hospital', 'hospital', 'Marathahalli, Bangalore', 'Bangalore', 12.9591, 77.7011, 4.5, true, 34,
   '["Emergency", "Surgery", "ICU"]'::jsonb,
   '["24/7 Emergency", "ICU", "Ambulance"]'::jsonb,
   '{"beds": 200, "specialization": "Multi-Speciality"}'::jsonb),
  ('44444444-4444-4444-4444-444444444443', 'Sunrise Hospital', 'hospital', 'Indiranagar, Bangalore', 'Bangalore', 12.9716, 77.6412, 4.2, true, 19,
   '["Pediatrics", "Gynecology", "General Medicine"]'::jsonb,
   '["Pharmacy", "Lab", "Parking"]'::jsonb,
   '{"beds": 80, "specialization": "General"}'::jsonb);

-- Cafes
INSERT INTO public.places (id, name, type, address, city, latitude, longitude, rating, verified, verification_count, amenities, metadata) VALUES
  ('55555555-5555-5555-5555-555555555551', 'Third Wave Coffee', 'cafe', 'Koramangala, Bangalore', 'Bangalore', 12.9352, 77.6245, 4.6, true, 52,
   '["WiFi", "Outdoor Seating", "Pet Friendly"]'::jsonb,
   '{"vibe": "Modern", "price_range": "₹₹"}'::jsonb),
  ('55555555-5555-5555-5555-555555555552', 'Blue Tokai Coffee', 'cafe', 'Indiranagar, Bangalore', 'Bangalore', 12.9716, 77.6412, 4.7, true, 61,
   '["WiFi", "Laptop Friendly"]'::jsonb,
   '{"vibe": "Work Friendly", "price_range": "₹₹"}'::jsonb);

-- =====================================================
-- SEED ACHIEVEMENTS
-- =====================================================

INSERT INTO public.achievements (id, name, description, icon, requirement, reward_xp, reward_coins, tier) VALUES
  ('aa111111-1111-1111-1111-111111111111', 'First Verification', 'Complete your first verification', '🎯', '{"type": "verification_count", "threshold": 1}'::jsonb, 50, 10, 'bronze'),
  ('aa111111-1111-1111-1111-111111111112', 'Explorer', 'Verify 10 different places', '🗺️', '{"type": "verification_count", "threshold": 10}'::jsonb, 200, 50, 'silver'),
  ('aa111111-1111-1111-1111-111111111113', 'Trusted Verifier', 'Reach 50 verified places', '🛡️', '{"type": "verification_count", "threshold": 50}'::jsonb, 500, 150, 'gold'),
  ('aa111111-1111-1111-1111-111111111114', '100% Verified', 'Get 100% accuracy on 25+ verifications', '✅', '{"type": "accuracy", "threshold": 100, "min_verifications": 25}'::jsonb, 750, 250, 'platinum'),
  ('aa111111-1111-1111-1111-111111111115', 'Legend', 'Complete 100+ verifications', '👑', '{"type": "verification_count", "threshold": 100}'::jsonb, 1000, 500, 'legend'),
  ('aa111111-1111-1111-1111-111111111116', 'Rising Star', 'Top 10 verifier this month', '⭐', '{"type": "leaderboard", "rank": 10, "period": "monthly"}'::jsonb, 300, 100, 'gold'),
  ('aa111111-1111-1111-1111-111111111117', 'Fast Responder', 'Complete 5 verifications in 24 hours', '⚡', '{"type": "speed", "count": 5, "hours": 24}'::jsonb, 150, 40, 'silver'),
  ('aa111111-1111-1111-1111-111111111118', 'Photo Pro', 'Upload 100+ verification photos', '📸', '{"type": "photo_count", "threshold": 100}'::jsonb, 400, 120, 'gold');

-- =====================================================
-- SEED VERIFICATION TASKS
-- =====================================================

INSERT INTO public.verification_tasks (id, place_id, title, description, reward_amount, urgency, status, deadline) VALUES
  ('tt111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Verify Grand Plaza Hotel amenities', 'Check and verify all hotel amenities including pool, gym, and restaurant', 250.00, 'high', 'open', NOW() + INTERVAL '3 days'),
  ('tt111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222221', 'GYMX equipment verification', 'Verify equipment quality and availability', 200.00, 'normal', 'open', NOW() + INTERVAL '5 days'),
  ('tt111111-1111-1111-1111-111111111113', '33333333-3333-3333-3333-333333333331', 'Restaurant hygiene check', 'Verify cleanliness and food safety standards', 300.00, 'urgent', 'open', NOW() + INTERVAL '2 days'),
  ('tt111111-1111-1111-1111-111111111114', '44444444-4444-4444-4444-444444444441', 'Hospital facilities check', 'Verify emergency services and patient facilities', 350.00, 'high', 'open', NOW() + INTERVAL '4 days');

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.places IS 'All verified and unverified places (hotels, gyms, restaurants, etc.)';
COMMENT ON TABLE public.verifications IS 'User-submitted verifications and reviews for places';
COMMENT ON TABLE public.rewards IS 'User rewards and incentives';
COMMENT ON TABLE public.credit_transactions IS 'All credit/coin transactions for users';
COMMENT ON TABLE public.verification_tasks IS 'Available verification tasks for users to complete';
COMMENT ON TABLE public.achievements IS 'System-wide achievements and badges';
COMMENT ON TABLE public.user_achievements IS 'User-earned achievements';
COMMENT ON TABLE public.leaderboard IS 'Leaderboard rankings by period';
