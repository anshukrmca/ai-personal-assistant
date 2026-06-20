import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

// Use standard URI to avoid Node.js SRV DNS issues on Windows
const MONGODB_URI = "mongodb://anshu121hjp_db_user:anshu121hjp_db_user@ac-iwzecbe-shard-00-00.h60nog7.mongodb.net:27017,ac-iwzecbe-shard-00-01.h60nog7.mongodb.net:27017,ac-iwzecbe-shard-00-02.h60nog7.mongodb.net:27017/ai-personal-assistant?ssl=true&authSource=admin&retryWrites=true&w=majority";
const DATA_DIR = path.join(process.cwd(), "data");

async function migrate() {
  console.log("[Migration] Connecting to MongoDB...");
  const client = await MongoClient.connect(MONGODB_URI, { family: 4 });
  const db = client.db("ai-personal-assistant");

  const filesToMigrate = [
    { file: "users.json", collection: "users" },
    { file: "otps.json", collection: "otps" },
    { file: "integrations.json", collection: "integrations" },
    { file: "feedItems.json", collection: "feedItems" },
    { file: "briefings.json", collection: "briefings" },
    { file: "tokens.json", collection: "tokens" },
    { file: "chatMessages.json", collection: "chatMessages" },
  ];

  for (const { file, collection } of filesToMigrate) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.log(`[Migration] Skipped ${file} - Not found.`);
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    if (!raw.trim()) continue;

    try {
      const items = JSON.parse(raw);
      if (!Array.isArray(items) || items.length === 0) {
        console.log(`[Migration] Skipped ${file} - Empty array.`);
        continue;
      }

      console.log(`[Migration] Migrating ${items.length} items from ${file} to collection '${collection}'...`);

      const col = db.collection(collection);
      
      // Because we might run this multiple times, it's safer to deleteMany and re-insert for the initial mock data,
      // or just do a bulk insert. For simplicity in a local migration, we'll just insert everything.
      // If you want idempotency, you'd loop over `items` and use updateOne with upsert: true.
      // Assuming a one-time clean slate migration:
      await col.deleteMany({});
      await col.insertMany(items);
      
      console.log(`[Migration] Successfully migrated ${file}!`);
    } catch (err) {
      console.error(`[Migration] Error migrating ${file}:`, err);
    }
  }

  console.log("[Migration] All done!");
  await client.close();
}

migrate().catch(console.error);
