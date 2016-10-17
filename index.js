const MongoClient = require('mongodb');
const createApp = require('./create-app');

const PORT = process.env.PORT || 1337;
const DEFAULT_URI = 'mongodb://localhost:27017/books'
const MONGO_URI = process.env.MONGODB_URI || DEFAULT_URI

MongoClient.connect(URI, (err, db) => {
  if (err) {
    // eslint-disable-next-line
    console.error(err);
    process.exit(1);
  }
  const app = createApp(db);
  app.listen(PORT);
})
