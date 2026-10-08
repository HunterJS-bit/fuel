-- Fuel prices seed data (Serbia, October 2026)
-- Upsert-safe: updates price and updated_at if brand+fuel_type already exists

INSERT INTO fuel_prices (brand, fuel_type, price_rsd, valid_from) VALUES
  -- NIS Petrol
  ('NIS Petrol',    'eurodiesel', 195.00, '2026-10-01'),
  ('NIS Petrol',    'bmb95',      184.00, '2026-10-01'),
  ('NIS Petrol',    'lpg',         85.00, '2026-10-01'),
  -- OMV
  ('OMV',           'eurodiesel', 198.50, '2026-10-01'),
  ('OMV',           'bmb95',      187.00, '2026-10-01'),
  ('OMV',           'lpg',         87.50, '2026-10-01'),
  -- MOL
  ('MOL',           'eurodiesel', 196.50, '2026-10-01'),
  ('MOL',           'bmb95',      185.00, '2026-10-01'),
  ('MOL',           'lpg',         86.00, '2026-10-01'),
  -- Lukoil
  ('Lukoil',        'eurodiesel', 197.00, '2026-10-01'),
  ('Lukoil',        'bmb95',      185.50, '2026-10-01'),
  ('Lukoil',        'lpg',         86.50, '2026-10-01'),
  -- Petrol (slovenian brand)
  ('Petrol',        'eurodiesel', 196.00, '2026-10-01'),
  ('Petrol',        'bmb95',      184.50, '2026-10-01'),
  -- Eco
  ('Eco',           'eurodiesel', 194.00, '2026-10-01'),
  ('Eco',           'bmb95',      183.00, '2026-10-01'),
  -- Gazprom
  ('Gazprom Petrol','eurodiesel', 196.00, '2026-10-01'),
  ('Gazprom Petrol','bmb95',      184.00, '2026-10-01'),
  ('Gazprom Petrol','lpg',         85.50, '2026-10-01'),
  -- Generic / unknown brands
  ('Other',         'eurodiesel', 195.00, '2026-10-01'),
  ('Other',         'bmb95',      184.00, '2026-10-01'),
  ('Other',         'lpg',         85.00, '2026-10-01')
ON CONFLICT (brand, fuel_type) DO UPDATE
  SET price_rsd  = EXCLUDED.price_rsd,
      valid_from = EXCLUDED.valid_from,
      updated_at = NOW();
