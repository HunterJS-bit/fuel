DROP TABLE IF EXISTS stations CASCADE;
DROP TABLE IF EXISTS fuel_prices CASCADE;

-- Create stations table
CREATE TABLE IF NOT EXISTS stations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  hours TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  fuel_type TEXT,
  station_type VARCHAR(50) DEFAULT 'fuel',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create fuel prices table
CREATE TABLE IF NOT EXISTS fuel_prices (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  price_rsd DECIMAL(10, 2) NOT NULL,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_to TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_stations_city ON stations(city);
CREATE INDEX IF NOT EXISTS idx_stations_brand ON stations(brand);
CREATE INDEX IF NOT EXISTS idx_stations_coords ON stations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_fuel_prices_brand ON fuel_prices(brand);
CREATE INDEX IF NOT EXISTS idx_fuel_prices_validity ON fuel_prices(valid_from, valid_to);
