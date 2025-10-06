-- Initialize database with extensions and basic setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a schema for the portfolio (optional)
-- CREATE SCHEMA IF NOT EXISTS portfolio;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
