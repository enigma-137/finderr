-- Create the likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  liked_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(liker_id, liked_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Policies for likes
-- Users can view likes where they are the liker or liked
CREATE POLICY "Users can view own likes" ON likes
  FOR SELECT USING (auth.uid() = liker_id OR auth.uid() = liked_id);

-- Users can insert their own likes
CREATE POLICY "Users can insert own likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = liker_id);

-- Users can delete their own likes (if needed)
CREATE POLICY "Users can delete own likes" ON likes
  FOR DELETE USING (auth.uid() = liker_id);

-- Create the matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Policies for matches
-- Users can view matches where they are involved
CREATE POLICY "Users can view own matches" ON matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Matches are inserted by the system (via function or app logic), so no insert policy for users
-- But to allow the app to insert, we can allow authenticated users to insert if they are one of the users
CREATE POLICY "Users can insert matches involving themselves" ON matches
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);