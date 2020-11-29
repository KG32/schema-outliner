const MongoClient = require('mongodb').MongoClient;

function connectToDb() {
  return 'con';
}


process.on('message', message => {
  if (process.send) {
    const out = connectToDb();
    process.send(out);
  }
});
