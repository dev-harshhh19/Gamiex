// Environment validation for production readiness
const validateEnvironment = () => {
  const requiredEnvVars = [
    'MONGODB_URL',
    'JWT_SECRET',
    'NODE_ENV'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n📝 Please check your .env file against .env.example');
    process.exit(1);
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long for security');
    process.exit(1);
  }

  // Validate MongoDB URL format
  if (!process.env.MONGODB_URL.startsWith('mongodb')) {
    console.error('❌ MONGODB_URL must be a valid MongoDB connection string');
    process.exit(1);
  }

  console.log('✅ Environment validation passed');
};

module.exports = validateEnvironment;
