-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  name TEXT,
  provider TEXT DEFAULT 'credentials',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  max_size INTEGER DEFAULT 6,
  favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pokemon table
CREATE TABLE pokemon (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  pokemon_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  nickname TEXT,
  sprite TEXT,
  types JSONB,
  stats JSONB,
  ability TEXT,
  nature TEXT,
  item TEXT,
  moves JSONB,
  position INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fakemon table
CREATE TABLE fakemon (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  types JSONB,
  stats JSONB,
  sprite TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_teams_user_id ON teams(user_id);
CREATE INDEX idx_pokemon_team_id ON pokemon(team_id);
CREATE INDEX idx_fakemon_user_id ON fakemon(user_id);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE pokemon ENABLE ROW LEVEL SECURITY;
ALTER TABLE fakemon ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own teams" ON teams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own teams" ON teams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own teams" ON teams FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own teams" ON teams FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own pokemon" ON pokemon FOR SELECT USING (
  EXISTS (SELECT 1 FROM teams WHERE teams.id = pokemon.team_id AND teams.user_id = auth.uid())
);
CREATE POLICY "Users can create own pokemon" ON pokemon FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM teams WHERE teams.id = pokemon.team_id AND teams.user_id = auth.uid())
);
CREATE POLICY "Users can update own pokemon" ON pokemon FOR UPDATE USING (
  EXISTS (SELECT 1 FROM teams WHERE teams.id = pokemon.team_id AND teams.user_id = auth.uid())
);
CREATE POLICY "Users can delete own pokemon" ON pokemon FOR DELETE USING (
  EXISTS (SELECT 1 FROM teams WHERE teams.id = pokemon.team_id AND teams.user_id = auth.uid())
);

CREATE POLICY "Users can view own fakemon" ON fakemon FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own fakemon" ON fakemon FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own fakemon" ON fakemon FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own fakemon" ON fakemon FOR DELETE USING (auth.uid() = user_id);
