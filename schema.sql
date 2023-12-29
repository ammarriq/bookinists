DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
   id TEXT,
   name TEXT,
   picture TEXT,
   email TEXT,
   social_id TEXT,
   network TEXT,
   last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   last_ip TEXT,
   last_country TEXT
);

DROP TABLE IF EXISTS sessions;
CREATE TABLE IF NOT EXISTS sessions (
   id TEXT,
   user_id TEXT,
   expires_at TEXT,
   fresh INTEGER
);