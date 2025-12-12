import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { existsSync, mkdirSync } from 'fs';

const dbPath = process.env.NODE_ENV === 'production' 
  ? '/app/data/academic.db' 
  : 'academic.db';

// Ensure directory exists in production
if (process.env.NODE_ENV === 'production') {
  const dir = '/app/data';
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

// Create database connection with retry logic and better error handling
let db: sqlite3.Database;

function connectToDatabase() {
  try {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err.message);
        throw err;
      } else {
        console.log('✅ Database connected successfully');
        
        // Configure for better performance and reliability
        db.run('PRAGMA journal_mode = WAL');
        db.run('PRAGMA synchronous = NORMAL');
        db.run('PRAGMA cache_size = 10000');
        db.run('PRAGMA temp_store = memory');
        db.run('PRAGMA busy_timeout = 30000');
      }
    });

    // Handle database errors
    db.on('error', (err) => {
      console.error('❌ Database error:', err.message);
    });

    // Handle database close
    db.on('close', () => {
      console.log('📊 Database connection closed');
    });

  } catch (error) {
    console.error('❌ Failed to create database connection:', error);
    throw error;
  }
}

// Initialize connection
connectToDatabase();

// Helper to promisify db methods with better error handling
const runAsync = promisify(db.run.bind(db));
const getAsync = promisify(db.get.bind(db));
const allAsync = promisify(db.all.bind(db));

export { db, runAsync, getAsync, allAsync };
export default db;