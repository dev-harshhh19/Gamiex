/**
 * MongoDB Atlas Keep-Alive Script
 * 
 * This script prevents MongoDB Atlas from going idle by:
 * 1. Connecting to the database
 * 2. Writing a dot (.) to a keep-alive collection
 * 3. Updating the timestamp
 * 
 * This version is designed to be integrated into a long-running process
 * and does not manage its own connection lifecycle or process exit.
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

// Export functions for use in other modules
module.exports = { connectToDatabase, writeDotToDatabase };