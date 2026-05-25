CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'applicant',
  first_login INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS access_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Default admin and demo users (passwords are plain for demo)
INSERT OR IGNORE INTO users (name, email, password, role) VALUES
  ('Admin', 'admin@cosmos.com', 'admin123', 'admin'),
  ('Recruiter Demo', 'recruiter@cosmos.com', 'recruiter123', 'recruiter'),
  ('Vendor Demo', 'vendor@cosmos.com', 'vendor123', 'vendor');
