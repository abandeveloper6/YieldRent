const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

let isMysql = false;
let mysqlPool = null;
let sqliteDb = null;

// Initialize Database Layer
async function initDb() {
  const mysql = require('mysql2/promise');
  try {
    // Attempt connecting to MySQL (XAMPP default)
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000
    });

    // Check if database exists or create it
    await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'yieldrent_db'}\` CHARACTER SET utf8mb4;`);
    await tempPool.end();

    // Connect to specific database
    mysqlPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'yieldrent_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const [test] = await mysqlPool.query('SELECT 1 + 1 AS result');
    if (test && test[0].result === 2) {
      isMysql = true;
      console.log('✅ [Database] Successfully connected to MySQL server (XAMPP).');
      return;
    }
  } catch (err) {
    console.log(`ℹ️ [Database] MySQL not reachable (${err.message}). Activating local embedded SQLite database for seamless operation.`);
  }

  // Fallback to built-in node:sqlite
  const { DatabaseSync } = require('node:sqlite');
  const dbFile = path.join(__dirname, 'yieldrent.sqlite');
  sqliteDb = new DatabaseSync(dbFile);
  sqliteDb.exec('PRAGMA foreign_keys = ON;');
  console.log(`✅ [Database] Local SQLite initialized at: ${dbFile}`);
}

async function query(sql, params = []) {
  if (isMysql && mysqlPool) {
    try {
      const [rows] = await mysqlPool.query(sql, params);
      return rows;
    } catch (err) {
      console.error('[MySQL Query Error]:', err.message, 'SQL:', sql);
      throw err;
    }
  }

  if (sqliteDb) {
    try {
      // Normalize SQL for SQLite compatibility if needed
      let cleanSql = sql
        .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT')
        .replace(/TINYINT\(1\)/gi, 'INTEGER')
        .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
        .replace(/ENUM\([^)]+\)/gi, 'TEXT');

      const trimmed = cleanSql.trim().toUpperCase();
      if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA') || trimmed.startsWith('SHOW')) {
        const stmt = sqliteDb.prepare(cleanSql);
        return stmt.all(...params);
      } else {
        const stmt = sqliteDb.prepare(cleanSql);
        const info = stmt.run(...params);
        return {
          insertId: Number(info.lastInsertRowid),
          affectedRows: info.changes
        };
      }
    } catch (err) {
      console.error('[SQLite Query Error]:', err.message, 'SQL:', sql);
      throw err;
    }
  }

  throw new Error('Database is not initialized. Please call initDb() first.');
}

module.exports = {
  initDb,
  query,
  getIsMysql: () => isMysql
};
