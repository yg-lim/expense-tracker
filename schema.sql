CREATE TABLE users (
  username text PRIMARY KEY,
  password text NOT NULL
);

CREATE TABLE expenses (
  id serial PRIMARY KEY,
  amount numeric(6,2) NOT NULL,
  description text NOT NULL,
  date date NOT NULL DEFAULT NOW()
  -- username text NOT NULL
  --   REFERENCES users (username)
  --   ON DELETE CASCADE
);