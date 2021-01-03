const MongoClient = require('mongodb').MongoClient;

async function connectToDb(uri, dbName) {
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  return client.db(dbName);
}

async function getCollections(db) {
  const dbCollections = await db.listCollections().toArray();
  if (!dbCollections.length) throw new Error('dbEmptyOrNotFound');
  const collections = [];
  for (let i = 0; i < dbCollections.length; i++) {
    const colName = dbCollections[i].name;
    const collection = db.collection(colName);
    const docs = await collection.find({}).toArray();
    collections.push({ name: colName, docs });
  }

  return collections;
}

process.on('message', async (data) => {
  const { type, options } = data;
  switch(type) {
    case 'dbData':
      const { uri, dbName } = options;
      const db = await connectToDb(options.uri, options.dbName);
      const collections = await getCollections(db);
      process.send({ type: 'dbData', payload: { collections }});
      break;
    default:
      console.error('unknown msg');
  }
});

