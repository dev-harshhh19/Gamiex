# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas for your e-commerce application.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Verify your email address

## Step 2: Create a Cluster

1. After logging in, click "Build a Database"
2. Choose "FREE" shared cluster
3. Select your preferred cloud provider and region (AWS, Google Cloud, or Azure)
4. Keep the default cluster name "Cluster0" or choose your own
5. Click "Create Cluster" (this may take a few minutes)

## Step 3: Create Database User

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Enter a username and secure password
5. Under "Database User Privileges", select "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development, you can click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production, add only your specific IP addresses
5. Click "Confirm"

## Step 5: Get Connection String

1. Go back to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as the driver and version "4.1 or later"
5. Copy the connection string

## Step 6: Update Your .env File

Replace the connection string in your `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/simple-ecommerce?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Important:** Replace:
- `yourusername` with your database username
- `yourpassword` with your database password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- `simple-ecommerce` with your preferred database name

## Step 7: Test Connection

1. Start your backend server:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. You should see: "MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net"

## Step 8: Seed Database

Once connected, seed your database with sample products:

```bash
npm run data:import
```

## Security Best Practices

### For Development:
- Use a strong password for your database user
- Consider using environment-specific databases (dev, staging, prod)

### For Production:
- Never commit your `.env` file to version control
- Use specific IP whitelisting instead of 0.0.0.0/0
- Create separate database users for different environments
- Enable MongoDB Atlas monitoring and alerts
- Consider using MongoDB Atlas Data API for additional security

## Troubleshooting

### Connection Issues:
1. **Authentication failed**: Check username/password in connection string
2. **Network timeout**: Verify IP address is whitelisted
3. **Database not found**: MongoDB will create the database automatically when you first write data

### Common Errors:
- `MongoNetworkError`: Usually a network access issue
- `MongoAuthenticationError`: Wrong username/password
- `MongoTimeoutError`: Network connectivity or firewall issue

## MongoDB Atlas Features

Your free tier includes:
- 512 MB storage
- Shared RAM and vCPU
- No time limit
- Access to MongoDB Compass
- Basic monitoring and alerting

## Monitoring Your Database

1. In Atlas dashboard, go to your cluster
2. Click on "Metrics" tab to see:
   - Operations per second
   - Network traffic
   - Memory usage
   - Storage usage

## Backup and Recovery

MongoDB Atlas automatically backs up your data:
- Continuous backups for the last 24 hours
- Daily snapshots for the last 7 days
- Weekly snapshots for the last 4 weeks
- Monthly snapshots for the last 12 months

## Next Steps

Once your database is set up:
1. Run the seeder to populate sample data
2. Test all API endpoints
3. Deploy your application to a hosting service
4. Consider upgrading to a dedicated cluster for production use

## Support

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/) - Free courses
- [Community Forums](https://community.mongodb.com/)