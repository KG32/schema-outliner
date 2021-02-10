import { MongoClient } from 'mongodb';

export async function getDbData(uri: string) {
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db('');
  const dbCollections = await db.listCollections().toArray();
  if (!dbCollections.length) throw new Error('dbEmptyOrNotFound');
  const collections = [];
  for (let i = 0; i < dbCollections.length; i++) {
    const colName = dbCollections[i].name;
    const collection = db.collection(colName);
    const docs = await collection.find({}).toArray();
    collections.push({ name: colName, docs });
  }
  console.log(collections);
  return collections;
};
