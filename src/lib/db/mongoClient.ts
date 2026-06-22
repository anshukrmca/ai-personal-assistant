import { MongoClient } from "mongodb";
import { setupIndexes } from "./setupIndexes";

let rawUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!rawUri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI" or "MONGO_URI"');
}

const uri = rawUri.replace(/^["']|["']$/g, '').trim();
const options = { family: 4 };

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
    globalWithMongo._mongoClientPromise = client.connect().then(async (c) => {
      await setupIndexes(c.db("ai-personal-assistant"));
      return c;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect().then(async (c) => {
    await setupIndexes(c.db("ai-personal-assistant"));
    return c;
  });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db("ai-personal-assistant");
}
