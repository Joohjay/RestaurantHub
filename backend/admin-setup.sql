-- Run only if your users.role column has a CHECK constraint that allows only customer/owner.
-- Replace users_role_check with the actual constraint name from your database if different.
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('customer', 'owner', 'admin'));

-- Promote an existing account to admin.
-- Replace the email with your admin account email.
UPDATE users
SET role = 'admin'
WHERE email = 'admin@example.com';
