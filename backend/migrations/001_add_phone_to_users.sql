-- Migration: Add phone column to existing users table
-- Run this if your database was created before the phone column was added.
-- Safe to run multiple times because of IF NOT EXISTS.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20) UNIQUE;
