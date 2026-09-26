CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  postcode TEXT NOT NULL,
  service TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS appointments_status_date
  ON appointments(status, preferred_date);
