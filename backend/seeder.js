const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const games = require('./data/games');

// Load environment variables
dotenv.config({ path: './.env' });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️  Data Destroyed!'.red);

    // Insert games
    const createdGames = await Product.insertMany(games);
    console.log(`🎮 ${createdGames.length} Games Imported!`.green);

    console.log('✅ Data Import Success!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️  Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
