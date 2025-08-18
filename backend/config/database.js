const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // Provide helpful error messages for common Atlas issues
    if (error.message.includes('authentication failed')) {
      console.error('💡 Check your MongoDB Atlas username and password in the connection string');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Check your MongoDB Atlas cluster URL and network access settings');
    } else if (error.message.includes('timeout')) {
      console.error('💡 Check your network connection and MongoDB Atlas IP whitelist');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;