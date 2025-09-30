import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, getUserProfile } from './supabase';

interface User {
  id: string;
  email?: string;
  user_metadata: {
    name?: string;
    [key: string]: any;
  };
}

interface UserProfile {
  id: string;
  name: string;
  nickname?: string;
  email: string;
  gender: string;
  age_range: string;
  college: string;
  department: string;
  matric_number: string;
  level: string;
  interests: string[];
  activities: string;
  profile_image?: string;
  id_card?: string;
  approved: boolean;
  created_at: string;
}

interface UserContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (currentUser) {
        setUser(currentUser);

        // Fetch user profile from database
        try {
          const profile = await getUserProfile(currentUser.id);
          setUserProfile(profile);
        } catch (profileError) {
          // Profile might not exist yet for new users
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
    } catch (error) {
      setUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    await checkAuth();
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setUser(null);
    setUserProfile(null);
  };

  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          try {
            const profile = await getUserProfile(session.user.id);
            setUserProfile(profile);
          } catch (error) {
            setUserProfile(null);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value: UserContextType = {
    user,
    userProfile,
    loading,
    login,
    logout,
    checkAuth,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};