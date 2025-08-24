#!/usr/bin/env node

/**
 * MongoDB Atlas Keep-Alive Script
 * 
 * This script prevents MongoDB Atlas from going idle by:
 * 1. Connecting to the database
 * 2. Writing a dot (.) to a keep-alive collection
 * 3. Updating the timestamp
 * 
 * Run this script every 20 minutes via cron job
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Keep-alive schema
const keepAliveSchema = new mongoose.Schema({
  dot: {
    type: String,
    default: '.'
  },
  lastPing: {
    type: Date,
    default: Date.now
  },
  pingCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const KeepAlive = mongoose.model('KeepAlive', keepAliveSchema);

/**
 * Connect to MongoDB Atlas
 */
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ Connected to MongoDB Atlas at ${new Date().toISOString()}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    return false;
  }
}

/**
 * Write a dot to keep the database alive
 */
async function writeDotToDatabase() {
  try {
    // Find existing keep-alive record or create new one
    let keepAliveRecord = await KeepAlive.findOne();
    
    if (!keepAliveRecord) {
      // Create new record
      keepAliveRecord = new KeepAlive({
        dot: '.',
        lastPing: new Date(),
        pingCount: 1
      });
      console.log('📝 Created new keep-alive record');
    } else {
      // Update existing record
      keepAliveRecord.dot = '.';
      keepAliveRecord.lastPing = new Date();
      keepAliveRecord.pingCount += 1;
      console.log(`📝 Updated keep-alive record (ping #${keepAliveRecord.pingCount})`);
    }
    
    await keepAliveRecord.save();
    
    console.log(`✅ Successfully wrote dot to database at ${new Date().toISOString()}`);
    console.log(`📊 Total pings: ${keepAliveRecord.pingCount}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to write to database: ${error.message}`);
    return false;
  }
}

/**
 * Cleanup and close connection
 */
async function cleanup() {
  try {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error(`❌ Error closing connection: ${error.message}`);
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting MongoDB Atlas Keep-Alive Script...');
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  
  // Connect to database
  const connected = await connectToDatabase();
  if (!connected) {
    process.exit(1);
  }
  
  // Write dot to database
  const success = await writeDotToDatabase();
  
  // Cleanup
  await cleanup();
  
  if (success) {
    console.log('✅ Keep-alive script completed successfully');
    process.exit(0);
  } else {
    console.log('❌ Keep-alive script failed');
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n⚠️ Received SIGINT, cleaning up...');
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️ Received SIGTERM, cleaning up...');
  await cleanup();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('💥 Uncaught Exception:', error);
  await cleanup();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  await cleanup();
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, connectToDatabase, writeDotToDatabase };
