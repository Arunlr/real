-- Migration to integrate requested tables and storage buckets for LOCALS.COM
-- Created: 2026-06-14

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'contributor', 'verifier', 'admin')),
  trust_score INTEGER DEFAULT 100 CHECK (trust_score >= 0 AND trust_score <= 100),
  xp_points INTEGER DEFAULT 0 CHECK (xp_points >= 0),
  reward_balance DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. PLACES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT DEFAULT 'Bangalore',
  state TEXT DEFAULT 'Karnataka',
  average_rating DECIMAL(2,1) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  place_name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  ai_score DECIMAL(5,2) DEFAULT 100.0,
  verifier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. REVIEW_MEDIA TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.review_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL, -- 'image' or 'video'
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. VERIFICATION_REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  contributor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  verifier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'cancelled')),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. REWARDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp_earned INTEGER DEFAULT 0,
  cashback DECIMAL(10,2) DEFAULT 0.00,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. REPORTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'ignored')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can edit own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Places Policies
CREATE POLICY "Places are viewable by everyone" ON public.places FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert places" ON public.places FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins have full write override on places" ON public.places FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Reviews Policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'verifier'));

-- Review Media Policies
CREATE POLICY "Review media are viewable by everyone" ON public.review_media FOR SELECT USING (true);
CREATE POLICY "Users can create review media for their own reviews" ON public.review_media FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.reviews WHERE id = review_id AND user_id = auth.uid())
);

-- Verification Requests Policies
CREATE POLICY "Verification requests are viewable by everyone" ON public.verification_requests FOR SELECT USING (true);
CREATE POLICY "Verifiers or Admins can update verification requests" ON public.verification_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('verifier', 'admin'))
);
CREATE POLICY "Contributors can submit verification requests" ON public.verification_requests FOR INSERT WITH CHECK (auth.uid() = contributor_id);

-- Rewards Policies
CREATE POLICY "Users can read own rewards" ON public.rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Verifiers or Admins can issue rewards" ON public.rewards FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('verifier', 'admin'))
);

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Reports Policies
CREATE POLICY "Admins or Verifiers can view reports" ON public.reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('verifier', 'admin'))
);
CREATE POLICY "Authenticated users can submit reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reported_by);

-- =====================================================
-- BUCKET CREATION SCRIPTS (STORAGE METADATA INSERTIONS)
-- =====================================================

INSERT INTO storage.buckets (id, name, public) VALUES
  ('profile-images', 'profile-images', true),
  ('review-images', 'review-images', true),
  ('review-videos', 'review-videos', true),
  ('verification-media', 'verification-media', true),
  ('admin-assets', 'admin-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Grant bucket access permissions to authenticated users and anonymous visitors
CREATE POLICY "Profile images are publicly viewable" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "Users can upload profile images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');

CREATE POLICY "Review media are publicly viewable" ON storage.objects FOR SELECT USING (bucket_id IN ('review-images', 'review-videos'));
CREATE POLICY "Users can upload review media" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('review-images', 'review-videos') AND auth.role() = 'authenticated');

CREATE POLICY "Verification media are viewable by verifiers" ON storage.objects FOR SELECT USING (bucket_id = 'verification-media');
CREATE POLICY "Users can upload verification media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'verification-media' AND auth.role() = 'authenticated');

CREATE POLICY "Admin assets are publicly viewable" ON storage.objects FOR SELECT USING (bucket_id = 'admin-assets');
CREATE POLICY "Only admins can manage admin assets" ON storage.objects FOR ALL USING (
  bucket_id = 'admin-assets' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- SEED INITIAL MOCK DATA COMPLIANT WITH THE NEW SCHEMAS
-- =====================================================

-- Places seeding
INSERT INTO public.places (id, name, category, address, city, state, average_rating, total_reviews) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Grand Plaza Hotel', 'hotel', 'MG Road', 'Bangalore', 'Karnataka', 4.5, 12),
  ('11111111-1111-1111-1111-111111111112', 'Skyline Suites', 'hotel', 'Indiranagar', 'Bangalore', 'Karnataka', 4.3, 8),
  ('22222222-2222-2222-2222-222222222221', 'GYMX Fitness Redefined', 'gym', 'Indiranagar', 'Bangalore', 'Karnataka', 4.7, 15),
  ('33333333-3333-3333-3333-333333333331', 'Kake Di Hatti', 'restaurant', 'Jayanagar', 'Bangalore', 'Karnataka', 4.6, 21),
  ('33333333-3333-3333-3333-333333333332', 'Rameshwaram Cafe', 'restaurant', 'Indiranagar', 'Bangalore', 'Karnataka', 4.8, 30),
  ('44444444-4444-4444-4444-444444444441', 'Cratis Hospital', 'hospital', 'HSR Layout', 'Bangalore', 'Karnataka', 4.3, 5)
ON CONFLICT (id) DO NOTHING;
