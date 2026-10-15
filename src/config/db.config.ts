import { Pool } from "pg";
import { envConfig } from "./env.config";

export const pool = new Pool({
  connectionString: envConfig.databaseUrl,
  ssl:
    envConfig.nodeEnv === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export const initDB = async (): Promise<void> => {
  try {
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createUsersTableQuery);

    console.log("PostgreSQL database tables initialized successfully.");
  } catch (error) {
    console.error("Error initializing PostgreSQL database:", error);
    throw error;
  }
};
