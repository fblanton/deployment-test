const express = require('express');
const bookRoutes = require('./book-routes');
const errorRoute = require('./error-route');
const jsonParser = require('body-parser').json();

module.exports = (db) => {
  const app = express();
  app.use(jsonParser);
  app.use('/books', bookRoutes(db));
  app.use(errorRoute);
  return app;
}
