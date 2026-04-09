-- Migration: Initial Schema
-- Description: Create transactions and scrape_logs tables with indexes
-- Date: 2026-04-08
-- Note: users table already exists with UUID id type

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'ACTIVE', 'EXPIRED', 'REJECTED')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  active BOOLEAN NOT NULL DEFAULT false,
  createdDate TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  modifiedDate TIMESTAMP WITH TIME ZONE,
  deletedDate TIMESTAMP WITH TIME ZONE
);

-- Create scrape_logs table
CREATE TABLE IF NOT EXISTS scrape_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  query TEXT NOT NULL,
  request_body JSONB NOT NULL,
  response_body JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  createdDate TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  modifiedDate TIMESTAMP WITH TIME ZONE,
  deletedDate TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status) WHERE deletedDate IS NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_active ON transactions(active, start_date, end_date) WHERE deletedDate IS NULL;
CREATE INDEX IF NOT EXISTS idx_scrape_logs_user_id ON scrape_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_scrape_logs_created ON scrape_logs(createdDate) WHERE deletedDate IS NULL;
