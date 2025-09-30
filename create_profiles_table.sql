-- Drop existing objects if they exist
DROP TRIGGER IF EXISTS on_auth_user_insert ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_auth_user();
DROP TABLE IF EXISTS profiles;

-- Create the profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT,
  email TEXT NOT NULL,
  gender TEXT,
  age_range TEXT,
  college TEXT,
  department TEXT,
  matric_number TEXT,
  level TEXT,
  interests TEXT[], -- Array of strings
  activities TEXT,
  profile_image TEXT,
  id_card TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to insert their own profile (during signup)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow admins to view all profiles (you might want to add role-based access)
-- For now, you can disable RLS temporarily for testing:
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Create trigger function to auto-create profile on auth user insert
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- avoid duplicate inserts
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    INSERT INTO public.profiles (id, email, name, created_at, approved)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.created_at, false);
  END IF;
  RETURN NEW;
END;
$$;

-- Revoke execute from public
REVOKE EXECUTE ON FUNCTION public.handle_new_auth_user() FROM public;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_insert
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();