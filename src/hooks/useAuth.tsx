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
      // Use any type to bypass TypeScript errors until schema is updated
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

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
      console.log('=== SIGNUP DEBUG INFO ===');
      console.log('Current URL:', window.location.href);
      console.log('Origin:', window.location.origin);
      console.log('Supabase URL check:', supabase.supabaseUrl);
      
      // Test basic connectivity to Supabase
      console.log('Testing Supabase connectivity...');
      const connectivityTest = await fetch(`${supabase.supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': supabase.supabaseKey,
        }
      });
      console.log('Connectivity test status:', connectivityTest.status);
      
      const redirectUrl = `${window.location.origin}/`;
      console.log('Attempting signup with:', { 
        email, 
        redirectUrl,
        hasPassword: !!password,
        metadata: {
          ...metadata,
          // Don't log sensitive data
          password: '[REDACTED]'
        }
      });

      const signUpOptions = {
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: metadata.full_name,
            badge_number: metadata.badge_number,
            department: metadata.department,
            role: metadata.role || 'officer'
          }
        }
      };

      console.log('SignUp options (sanitized):', {
        ...signUpOptions,
        password: '[REDACTED]'
      });

      const { data, error } = await supabase.auth.signUp(signUpOptions);

      console.log('Supabase response data:', data);

      if (error) {
        console.error('Signup error details:', {
          message: error.message,
          status: error.status,
          statusText: error.name,
          details: error
        });
        
        // Provide more specific error messages
        if (error.message.includes('fetch')) {
          toast.error('Network error: Cannot connect to authentication service. Please check your internet connection.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password format.');
        } else if (error.message.includes('User already registered')) {
          toast.error('An account with this email already exists. Please try signing in instead.');
        } else {
          toast.error(`Registration failed: ${error.message}`);
        }
        return { error };
      }

      console.log('Signup successful, user data:', data);
      toast.success('Registration successful! Please check your email to verify your account.');
      return { error: null };
    } catch (error: any) {
      console.error('Signup catch error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      
      // Handle different types of network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Network error: Unable to reach the server. Please check your connection and try again.');
      } else if (error.name === 'AbortError') {
        toast.error('Request timeout: The server took too long to respond.');
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
