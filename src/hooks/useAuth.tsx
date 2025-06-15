
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  badge_number?: string;
  department?: string;
  role: 'officer' | 'investigator' | 'supervisor' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  profileLoading: boolean;
  signUp: (email: string, password: string, metadata: {
    full_name: string;
    badge_number?: string;
    department?: string;
    role?: string;
  }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchProfile = async (userId: string) => {
    // Prevent multiple simultaneous calls
    if (profileLoading) {
      console.log('Profile fetch already in progress, skipping...');
      return;
    }

    setProfileLoading(true);
    
    try {
      console.log('Fetching profile for user:', userId);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );
      
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116') {
          console.log('No profile found, user may need to complete setup');
        }
        setProfile(null);
        return;
      }

      console.log('Profile fetched successfully:', data);

      // Only allow valid role values
      const validRoles = ['officer', 'investigator', 'supervisor', 'admin'] as const;
      const safeRole =
        validRoles.includes(data.role as any) ? (data.role as Profile['role']) : 'officer';

      setProfile({
        ...data,
        role: safeRole,
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      if (error.message === 'Profile fetch timeout') {
        toast.error('Profile loading timed out. Please refresh the page.');
      }
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to defer the async profile fetch and avoid blocking the auth state change
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id);
            }
          }, 0);
        } else {
          setProfile(null);
          setProfileLoading(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata: {
    full_name: string;
    badge_number?: string;
    department?: string;
    role?: string;
  }) => {
    try {
      console.log('=== SIGNUP DEBUG ===');
      console.log('Email:', email);
      console.log('Metadata:', metadata);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.full_name,
            badge_number: metadata.badge_number,
            department: metadata.department,
            role: metadata.role || 'officer'
          }
        }
      });

      console.log('=== SIGNUP RESPONSE ===');
      console.log('Data:', data);
      console.log('Error:', error);

      if (error) {
        console.error('Supabase signup error:', error);
        
        if (error.message.includes('User already registered')) {
          toast.error('An account with this email already exists. Please try signing in instead.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password format.');
        } else if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          toast.error('Network connection failed. Please check your internet connection and try again.');
        } else {
          toast.error(`Registration failed: ${error.message}`);
        }
        return { error };
      }

      console.log('Signup successful!');
      toast.success('Registration successful! Please check your email to verify your account.');
      return { error: null };
    } catch (error: any) {
      console.error('=== SIGNUP CATCH ERROR ===');
      console.error('Error:', error);
      
      if (error.message?.includes('fetch') || error.name === 'TypeError') {
        toast.error('Unable to connect to authentication server. Please check your internet connection and try again.');
      } else {
        toast.error(`Unexpected error during registration: ${error.message}`);
      }
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting signin with:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        toast.error(error.message);
        return { error };
      }

      console.log('Signin successful');
      toast.success('Welcome back!');
      return { error: null };
    } catch (error: any) {
      console.error('Signin catch error:', error);
      toast.error('An unexpected error occurred during login');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Logged out successfully');
        setUser(null);
        setProfile(null);
        setSession(null);
        setProfileLoading(false);
      }
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    profileLoading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
