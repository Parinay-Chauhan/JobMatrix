import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const SOURCE_DB = "mydb";
const TARGET_DB = "JobPortal";

async function migrate() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }

  console.log(`Connecting to MongoDB...`);
  const client = new mongoose.mongo.MongoClient(process.env.MONGODB_URI);
  await client.connect();
  console.log(`Connected to cluster.`);

  const sourceDb = client.db(SOURCE_DB);
  const targetDb = client.db(TARGET_DB);

  const collections = await sourceDb.listCollections().toArray();
  console.log(`Found ${collections.length} collections in "${SOURCE_DB}".`);

  let totalDocsMigrated = 0;

  for (const col of collections) {
    const colName = col.name;
    if (colName.startsWith("system.")) continue;

    const sourceCol = sourceDb.collection(colName);
    const targetCol = targetDb.collection(colName);

    const docs = await sourceCol.find({}).toArray();
    console.log(`- Collection "${colName}": ${docs.length} document(s)`);

    if (docs.length > 0) {
      const operations = docs.map((doc) => ({
        replaceOne: {
          filter: { _id: doc._id },
          replacement: doc,
          upsert: true,
        },
      }));

      await targetCol.bulkWrite(operations);
      totalDocsMigrated += docs.length;
      console.log(`  -> Synced into "${TARGET_DB}.${colName}"`);
    }

    try {
      const indexes = await sourceCol.indexes();
      for (const idx of indexes) {
        if (idx.name === "_id_") continue;
        const options = {};
        if (idx.unique) options.unique = true;
        if (idx.sparse) options.sparse = true;
        if (idx.expireAfterSeconds !== undefined) options.expireAfterSeconds = idx.expireAfterSeconds;
        await targetCol.createIndex(idx.key, options);
      }
    } catch {
      // Ignore index copy errors
    }
  }

  console.log(`\nFinished! Successfully migrated ${totalDocsMigrated} document(s) from "${SOURCE_DB}" into "${TARGET_DB}".`);
  await client.close();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
