
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

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Use type assertion to bypass TypeScript errors until schema is updated
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist, create one for existing users
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating one for existing user');
          const user = await supabase.auth.getUser();
          
          if (user.data.user) {
            const { data: newProfile, error: createError } = await (supabase as any)
              .from('profiles')
              .insert({
                id: userId,
                email: user.data.user.email || '',
                full_name: user.data.user.user_metadata?.full_name || 'User',
                badge_number: user.data.user.user_metadata?.badge_number,
                department: user.data.user.user_metadata?.department,
                role: user.data.user.user_metadata?.role || 'officer'
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
            } else {
              console.log('Profile created successfully:', newProfile);
              setProfile(newProfile);
            }
          }
        }
        return;
      }

      console.log('Profile fetched successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile data after user is authenticated
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata: {
    full_name: string;
    badge_number?: string;
    department?: string;
    role?: string;
  }) => {
    try {
      console.log('=== DETAILED SIGNUP DEBUG ===');
      console.log('Email:', email);
      console.log('Password length:', password?.length);
      console.log('Metadata:', metadata);
      console.log('Supabase URL:', 'https://uuirkrlxpmfqljfldtqt.supabase.co');
      
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
        console.error('Supabase signup error details:', {
          message: error.message,
          status: error.status,
          statusText: error.name
        });
        
        // Handle specific error cases
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
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Full error object:', error);
      
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
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
