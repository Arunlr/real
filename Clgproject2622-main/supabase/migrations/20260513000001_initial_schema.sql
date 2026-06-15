-- Initial Database Schema for LOCALS.COM
-- Created: 2026-05-13

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & PROFILES
-- =====================================================

-- User Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  phone TEXT,
  city TEXT DEFAULT 'Bangalore',
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'verifier', 'admin')),
  verified BOOLEAN DEFAULT false,
  trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 6),
  xp INTEGER DEFAULT 0 CHECK (xp >= 0),
  streak INTEGER DEFAULT 0 CHECK (streak >= 0),
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  monthly_earnings DECIMAL(10,2) DEFAULT 0.00,
  verification_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Stats Table (detailed statistics)
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stat_date DATE DEFAULT CURRENT_DATE,
  verifications_completed INTEGER DEFAULT 0,
  reviews_written INTEGER DEFAULT 0,
  photos_uploaded INTEGER DEFAULT 0,
  earnings_today DECIMAL(10,2) DEFAULT 0.00,
  xp_earned_today INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, stat_date)
);

-- =====================================================
-- PLACES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hotel', 'gym', 'restaurant', 'hospital', 'cafe', 'school', 'neighborhood', 'pg', 'other')),
  address TEXT NOT NULL,
  city TEXT DEFAULT 'Bangalore',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  verified BOOLEAN DEFAULT false,
  verification_count INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  photos JSONB DEFAULT '[]'::jsonb,
  amenities JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  diet_type TEXT CHECK (diet_type IN ('veg', 'non-veg', 'both', NULL)), -- for restaurants
  specialities JSONB DEFAULT '[]'::jsonb, -- for hospitals
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VERIFICATIONS & REVIEWS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  gps_location JSONB, -- {latitude, longitude, accuracy, timestamp}
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  trust_score INTEGER DEFAULT 0,
  verification_checklist JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REWARDS & CREDITS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cashback', 'gift_card', 'coins', 'bonus', 'referral', 'streak', 'achievement', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) DEFAULT 0.00,
  coins INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'expired', 'cancelled')),
  claimed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('earned', 'spent', 'bonus', 'refund')),
  amount DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  related_verification_id UUID REFERENCES public.verifications(id),
  related_reward_id UUID REFERENCES public.rewards(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TASKS & ASSIGNMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.verification_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  reward_amount DECIMAL(10,2) DEFAULT 0.00,
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'cancelled')),
  deadline TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  verification_id UUID REFERENCES public.verifications(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ACHIEVEMENTS & BADGES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  requirement JSONB, -- {type: 'verification_count', threshold: 50}
  reward_xp INTEGER DEFAULT 0,
  reward_coins INTEGER DEFAULT 0,
  tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'legend')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- =====================================================
-- LEADERBOARD
-- =====================================================

CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
  rank INTEGER NOT NULL,
  score INTEGER NOT NULL,
  verifications_count INTEGER DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, period, period_start)
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_city ON public.profiles(city);
CREATE INDEX idx_profiles_level ON public.profiles(level);
CREATE INDEX idx_profiles_trust_score ON public.profiles(trust_score);

-- Places indexes
CREATE INDEX idx_places_type ON public.places(type);
CREATE INDEX idx_places_city ON public.places(city);
CREATE INDEX idx_places_verified ON public.places(verified);
CREATE INDEX idx_places_rating ON public.places(rating);
CREATE INDEX idx_places_location ON public.places(latitude, longitude);

-- Verifications indexes
CREATE INDEX idx_verifications_place_id ON public.verifications(place_id);
CREATE INDEX idx_verifications_user_id ON public.verifications(user_id);
CREATE INDEX idx_verifications_status ON public.verifications(status);
CREATE INDEX idx_verifications_created_at ON public.verifications(created_at DESC);

-- Rewards indexes
CREATE INDEX idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX idx_rewards_status ON public.rewards(status);
CREATE INDEX idx_rewards_type ON public.rewards(type);

-- Credit transactions indexes
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);

-- Tasks indexes
CREATE INDEX idx_verification_tasks_status ON public.verification_tasks(status);
CREATE INDEX idx_verification_tasks_assigned_to ON public.verification_tasks(assigned_to);
CREATE INDEX idx_verification_tasks_place_id ON public.verification_tasks(place_id);

-- Leaderboard indexes
CREATE INDEX idx_leaderboard_period ON public.leaderboard(period, period_start);
CREATE INDEX idx_leaderboard_rank ON public.leaderboard(period, rank);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_places_updated_at BEFORE UPDATE ON public.places
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON public.verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_tasks_updated_at BEFORE UPDATE ON public.verification_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update place rating when verification is added
CREATE OR REPLACE FUNCTION update_place_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.places
  SET
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM public.verifications
      WHERE place_id = NEW.place_id AND status = 'approved'
    ),
    verification_count = (
      SELECT COUNT(*)
      FROM public.verifications
      WHERE place_id = NEW.place_id AND status = 'approved'
    ),
    review_count = (
      SELECT COUNT(*)
      FROM public.verifications
      WHERE place_id = NEW.place_id AND status = 'approved' AND review_text IS NOT NULL
    )
  WHERE id = NEW.place_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_place_rating_trigger
  AFTER INSERT OR UPDATE ON public.verifications
  FOR EACH ROW EXECUTE FUNCTION update_place_rating();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- User stats policies
CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Places policies
CREATE POLICY "Places are viewable by everyone"
  ON public.places FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create places"
  ON public.places FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Verifications policies
CREATE POLICY "Verifications are viewable by everyone"
  ON public.verifications FOR SELECT
  USING (true);

CREATE POLICY "Users can create own verifications"
  ON public.verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own verifications"
  ON public.verifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Rewards policies
CREATE POLICY "Users can view own rewards"
  ON public.rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own rewards"
  ON public.rewards FOR UPDATE
  USING (auth.uid() = user_id);

-- Credit transactions policies
CREATE POLICY "Users can view own transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Tasks are viewable by everyone"
  ON public.verification_tasks FOR SELECT
  USING (true);

CREATE POLICY "Assigned users can update tasks"
  ON public.verification_tasks FOR UPDATE
  USING (auth.uid() = assigned_to);

-- Achievements policies
CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements FOR SELECT
  USING (true);

CREATE POLICY "User achievements are viewable by everyone"
  ON public.user_achievements FOR SELECT
  USING (true);

-- Leaderboard policies
CREATE POLICY "Leaderboard is viewable by everyone"
  ON public.leaderboard FOR SELECT
  USING (true);
