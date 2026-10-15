import app from "./app";
import { envConfig } from "./config/env.config";
import { initDB } from "./config/db.config";

async function main() {
  try {
    // Initialize PostgreSQL tables
    await initDB();

    app.listen(envConfig.port, () => {
      console.log(`DevPulse server is running on port ${envConfig.port}`);
    });
  } catch (error) {
    console.error("Failed to start DevPulse server:", error);
    process.exit(1);
  }
}

main();
