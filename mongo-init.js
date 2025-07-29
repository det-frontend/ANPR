// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the ANPR system database
db = db.getSiblingDB("anpr_system");

// Create collections with proper indexes
db.createCollection("vehicles");
db.createCollection("users");

// Create indexes for better performance
db.vehicles.createIndex({ truckNumber: 1 }, { unique: true });
db.vehicles.createIndex({ createdAt: -1 });
db.vehicles.createIndex({ orderDate: -1 });
db.vehicles.createIndex({ companyName: 1 });
db.vehicles.createIndex({ driverName: 1 });

db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

// Insert default admin user (optional - can be done via API)
// Note: Password should be hashed in production
// db.users.insertOne({
//   username: "admin",
//   email: "admin@anpr.com",
//   password: "hashed_password_here",
//   role: "manager",
//   name: "System Administrator",
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString()
// });

print("ANPR System database initialized successfully!");
print("Collections created: vehicles, users");
print("Indexes created for optimal performance");
