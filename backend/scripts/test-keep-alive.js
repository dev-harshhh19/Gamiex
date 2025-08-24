#!/usr/bin/env node

/**
 * Test script for MongoDB Atlas Keep-Alive functionality
 * 
 * This script tests the keep-alive functionality and shows
 * the current status of the keep-alive collection
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Keep-alive schema (same as in keep-atlas-alive.js)
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
 * Test the keep-alive functionality
 */
async function testKeepAlive() {
  try {
    console.log('🧪 Testing MongoDB Atlas Keep-Alive...');
    console.log(`⏰ Current time: ${new Date().toISOString()}`);
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB Atlas');
    
    // Check existing keep-alive records
    const records = await KeepAlive.find().sort({ createdAt: -1 });
    
    if (records.length === 0) {
      console.log('📝 No keep-alive records found. Creating first record...');
      
      const newRecord = new KeepAlive({
        dot: '.',
        lastPing: new Date(),
        pingCount: 1
      });
      
      await newRecord.save();
      console.log('✅ Created first keep-alive record');
    } else {
      console.log(`📊 Found ${records.length} keep-alive record(s)`);
      
      const latestRecord = records[0];
      console.log('📋 Latest Keep-Alive Record:');
      console.log(`   ID: ${latestRecord._id}`);
      console.log(`   Dot: "${latestRecord.dot}"`);
      console.log(`   Last Ping: ${latestRecord.lastPing.toISOString()}`);
      console.log(`   Ping Count: ${latestRecord.pingCount}`);
      console.log(`   Created: ${latestRecord.createdAt.toISOString()}`);
      console.log(`   Updated: ${latestRecord.updatedAt.toISOString()}`);
      
      // Calculate time since last ping
      const timeSinceLastPing = Date.now() - latestRecord.lastPing.getTime();
      const minutesSinceLastPing = Math.floor(timeSinceLastPing / (1000 * 60));
      
      console.log(`⏱️ Time since last ping: ${minutesSinceLastPing} minutes`);
      
      if (minutesSinceLastPing > 10) {
        console.log('⚠️ Warning: Last ping was more than 10 minutes ago');
      } else {
        console.log('✅ Keep-alive is working properly');
      }
    }
    
    // Test writing a new dot
    console.log('\n🧪 Testing write operation...');
    let testRecord = await KeepAlive.findOne();
    
    if (testRecord) {
      testRecord.dot = '.';
      testRecord.lastPing = new Date();
      testRecord.pingCount += 1;
    } else {
      testRecord = new KeepAlive({
        dot: '.',
        lastPing: new Date(),
        pingCount: 1
      });
    }
    
    await testRecord.save();
    console.log('✅ Successfully wrote test dot to database');
    console.log(`📊 New ping count: ${testRecord.pingCount}`);
    
    // Show database stats
    const stats = await mongoose.connection.db.stats();
    console.log('\n📊 Database Statistics:');
    console.log(`   Database: ${stats.db}`);
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

/**
 * Show cron job status
 */
function showCronStatus() {
  console.log('\n📋 Cron Job Information:');
  console.log('   Schedule: Every 5 minutes (*/5 * * * *)');
  console.log('   Script: backend/scripts/keep-atlas-alive.js');
  console.log('   Log: backend/logs/keep-alive.log');
  console.log('');
  console.log('🔍 To check if cron job is running:');
  console.log('   crontab -l | grep keep-atlas-alive');
  console.log('');
  console.log('📊 To view logs:');
  console.log('   tail -f backend/logs/keep-alive.log');
  console.log('');
  console.log('🚀 To setup cron job:');
  console.log('   chmod +x backend/scripts/setup-cronjob.sh');
  console.log('   ./backend/scripts/setup-cronjob.sh');
}

/**
 * Main function
 */
async function main() {
  try {
    await testKeepAlive();
    showCronStatus();
    console.log('\n✅ Keep-alive test completed successfully!');
  } catch (error) {
    console.error('\n❌ Keep-alive test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  main();
}
