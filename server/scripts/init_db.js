const mysql = require("mysql2/promise");
require("dotenv").config();

async function initDatabase() {
  try {
    // Connect without database selected
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });

    const dbName = process.env.DB_NAME || "mindmap";

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' checked/created.`);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
}

initDatabase();
