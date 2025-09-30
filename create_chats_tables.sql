-- Create the conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id) -- Ensure no duplicate conversations
);

-- Enable Row Level Security (RLS)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policies for conversations
-- Users can view conversations where they are involved
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can insert conversations involving themselves
CREATE POLICY "Users can insert conversations involving themselves" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create the messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL, -- Encrypted content
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for messages
-- Users can view messages in conversations they are part of
CREATE POLICY "Users can view messages in own conversations" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user1_id FROM conversations WHERE id = conversation_id
      UNION
      SELECT user2_id FROM conversations WHERE id = conversation_id
    )
  );

-- Users can insert messages if they are the sender and part of the conversation
CREATE POLICY "Users can insert messages in own conversations" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    auth.uid() IN (
      SELECT user1_id FROM conversations WHERE id = conversation_id
      UNION
      SELECT user2_id FROM conversations WHERE id = conversation_id
    )
  );