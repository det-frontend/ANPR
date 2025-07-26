import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client
      .connect()
      .then((client) => {
        console.log("✅ MongoDB connected (development)");
        return client;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error (development):", err);
        throw err;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client
    .connect()
    .then((client) => {
      console.log("✅ MongoDB connected (production)");
      return client;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error (production):", err);
      throw err;
    });
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  console.log("Connected to MongoDB", client);
  return client.db("anpr_system");
}

export default clientPromise;
