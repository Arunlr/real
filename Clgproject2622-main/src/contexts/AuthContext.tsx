import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, callServer } from '../utils/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AppUser {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  trust_score?: number;
  xp_points?: number;
  reward_balance?: number;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string, phone?: string) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (data) {
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: data.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0],
          role: data.role || 'user',
          trust_score: data.trust_score,
          xp_points: data.xp_points,
          reward_balance: Number(data.reward_balance || 0),
        });
      } else {
        // If profile doesn't exist, build a default based on authUser metadata
        const defaultProfile = {
          id: authUser.id,
          full_name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
          email: authUser.email,
          phone: authUser.phone || '',
          avatar_url: authUser.user_metadata?.avatar_url || '',
          role: authUser.user_metadata?.role || 'user',
          trust_score: 100,
          xp_points: 0,
          reward_balance: 0.0,
        };
        
        await supabase.from('profiles').insert([defaultProfile]);
        
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: defaultProfile.full_name,
          role: defaultProfile.role,
          trust_score: defaultProfile.trust_score,
          xp_points: defaultProfile.xp_points,
          reward_balance: defaultProfile.reward_balance,
        });
      }
    } catch (e) {
      console.error('Failed to load user profile from database:', e);
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
        role: authUser.user_metadata?.role || 'user',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string, phone?: string) => {
    try {
      // Direct sign-up via Supabase Auth (respects email confirmation settings)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            role: 'user',
          }
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      console.error('Registration failed:', err);
      return { data: null, error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      console.error('Sign in failed:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
