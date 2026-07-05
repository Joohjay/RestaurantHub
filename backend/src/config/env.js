import dotenv from "dotenv";

dotenv.config();

function requireEnv(name, fallback = "") {
  const value = process.env[name] || fallback;
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  jwtSecret: requireEnv("JWT_SECRET", "supersecret"),
  db: {
    host: requireEnv("DB_HOST"),
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    user: requireEnv("DB_USER"),
    password: requireEnv("DB_PASSWORD"),
    database: requireEnv("DB_NAME"),
  },
};
