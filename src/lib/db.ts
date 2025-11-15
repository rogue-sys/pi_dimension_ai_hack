import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "foodlens",
        bufferCommands: false,
      })
      .then((m) => {
        console.log("✅ MongoDB connected:", m.connection.name);
        return m.connection;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
