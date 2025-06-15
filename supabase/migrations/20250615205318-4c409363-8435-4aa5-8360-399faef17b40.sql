
-- Create the missing profile for the existing user
INSERT INTO public.profiles (id, email, full_name, badge_number, department, role)
VALUES (
  'c6e41e2e-aa9f-4221-8a0d-e0d84337270c',
  'ernestfancyviews@gmail.com',
  'John Doe', -- You can change this name
  NULL, -- No badge number for now
  NULL, -- No department for now  
  'officer' -- Default role
)
ON CONFLICT (id) DO NOTHING; -- In case it somehow already exists
