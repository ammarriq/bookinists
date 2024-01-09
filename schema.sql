DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
   id TEXT PRIMARY KEY,
   name TEXT,
   picture TEXT,
   email TEXT UNIQUE,
   role TEXT,
   social_id TEXT,
   network TEXT,
   last_login INTEGER,
   last_ip TEXT,
   last_country TEXT
);

DROP TABLE IF EXISTS sessions;
CREATE TABLE IF NOT EXISTS sessions (
   id TEXT PRIMARY KEY,
   user_id TEXT,
   expires_at TEXT,
   fresh INTEGER,
   FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS tags;
CREATE TABLE IF NOT EXISTS tags (
   id TEXT PRIMARY KEY,
   name TEXT,
   description TEXT,
   icon INTEGER,
   text_color TEXT,
   bg_color TEXT
);

DROP TABLE IF EXISTS collections;
CREATE TABLE IF NOT EXISTS collections (
   id TEXT PRIMARY KEY,
   name TEXT,
   description TEXT,
   image INTEGER,
);