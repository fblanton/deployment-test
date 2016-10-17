const MongoClient = require('mongodb');
const createApp = require('./create-app');

const PORT = 1337;
const URI = 'mongodb://localhost:27017/books'

MongoClient.connect(URI, (err, db) => {
  if (err) {
    // eslint-disable-next-line
    console.error(err);
    process.exit(1);
  }
  const app = createApp(db);
  app.listen(PORT);
})
