import { MongoClient } from "mongodb";

const uri = "mongodb://anshu121hjp_db_user:anshu121hjp_db_user@ac-iwzecbe-shard-00-00.h60nog7.mongodb.net:27017,ac-iwzecbe-shard-00-01.h60nog7.mongodb.net:27017,ac-iwzecbe-shard-00-02.h60nog7.mongodb.net:27017/ai-personal-assistant?ssl=true&authSource=admin&retryWrites=true&w=majority";

async function run() {
  console.log("Connecting...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully!");
    const dbs = await client.db().admin().listDatabases();
    console.log("Databases:", dbs.databases.map(d => d.name));
  } finally {
    await client.close();
  }
}

run().catch(console.error);
