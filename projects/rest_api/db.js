// db.js
import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://user:abcdefg@schoolapi.g7m289e.mongodb.net/?appName=SchoolAPI";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("SchoolAPI");
  }
  return db;
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return db;
}

export async function loadJson(collectionName) {
  return await getDB().collection(collectionName).find({}).toArray();
}

export async function saveJson(collectionName, data) {
  const collection = getDB().collection(collectionName);
  await collection.deleteMany({});
  if (data.length) {
    await collection.insertMany(data);
  }
}
