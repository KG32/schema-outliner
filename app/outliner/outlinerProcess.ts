const MongoClient = require('mongodb').MongoClient;

async function connectToDb() {
  // const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  // return client.db(dbName);
}

async function outlineSchema() {

}

function test() {
  return 'test';
}

process.on('message', async (message) => {
  switch(message) {
    case 'outline':
      console.log('outline');
      break;
    case 'ping':
      if (!process.send) return;
      console.log('ping');
      process.send('pong');
      break;
    default:
      console.error('unknown msg');
  }
});

