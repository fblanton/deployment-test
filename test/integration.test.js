/* global describe, it, before, after, beforeEach */
const { expect } = require('chai');
const fetch = require('node-fetch');
const MongoClient = require('mongodb');
const createApp = require('../create-app');
const testBooks = require('./test-books');

const TEST_PORT = 1338;
const TEST_URL = 'http://localhost:' + TEST_PORT
const TEST_URI = 'mongodb://localhost:27017/test-books';

describe('Books API', () => {
  let server, db, books;

  before(done => {
    MongoClient.connect(TEST_URI, (err, _db) => {
      if (err) done(err);
      db = _db;
      books = db.collection('books');
      const app = createApp(db);
      server = app.listen(TEST_PORT, () => done());
    });
  })

  beforeEach(done => {
    books
      .deleteMany()
      .then(() =>
        books
          .insertMany(testBooks)
          .then(() => done())
          .catch(done)
        )
      .catch(done)
  })

  after(done => {
    db.close(true)
    server.close();
    done()
  })

  describe('POST [array of books]', () => {
    it('inserts many books into the db', done => {
      const testBooks = [
        { title: 'World', author: "Sam" },
        { title: 'Hello', author: "Paul" },
      ]
      fetch(TEST_URL + '/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBooks)
      })
        .then(res => res.json())
        .then(ops => {
          expect(ops[0]).to.include(testBooks[0])
          expect(ops[1]).to.include(testBooks[1]);
          done();
        })
        .catch(done)
    })
  })

  describe('POST a single book', () => {
    it('insert one book into the db', done => {
      const testBook = { title: 'World', author: "Sam" }
      fetch(TEST_URL + '/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBook)
      })
        .then(res => res.json())
        .then(doc => {
          expect(doc).to.include(testBook)
          done();
        })
        .catch(done)
    })
  })

  describe('GET /books', () => {
    it('returns all books', done => {
      fetch(TEST_URL + '/books')
        .then(res => res.json())
        .then(res => {
          expect(res).to.be.lengthOf(2);
          done();
        })
        .catch(err => done(err));
    })
  })

  describe('GET /books?title=The+Road+Home', () => {
    it('returns a list of books', done => {
      fetch(TEST_URL + '/books?title=The+Road+Home')
        .then(res => res.json())
        .then(res => {
          expect(res).to.be.lengthOf(1);
          done();
        })
        .catch(err => done(err));
    })
  })

  describe('GET /books?author=Jack+Smith', () => {
    it('returns a list of books', done => {
      fetch(TEST_URL + '/books?author=Jack+Smith')
        .then(res => res.json())
        .then(res => {
          expect(res).to.be.lengthOf(2);
          done();
        })
        .catch(err => done(err));
    })
  })

  describe('PUT /books/:id with json body', () => {
    it('updates an existing book', done => {
      const id = String(testBooks[0]._id)
      const update = { title: 'They went to Rome' }
      fetch(TEST_URL + '/books/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      })
        .then(res => {
          expect(res.status).to.equal(200)
          return res.json()
        })
        .then(res => {
          expect(res).to.include({
            _id: id,
            title: update.title,
            author: testBooks[0].author
          })
          done()
        })
        .catch(done)
    })
  })

  describe('DELETE /books/:id', () => {
    it('removes an existing book', done => {
      fetch(TEST_URL + '/books/' + testBooks[1]._id, { method: 'DELETE' })
        .then(res => {
          expect(res.status).to.equal(200)
          return res.json()
        })
        .then(({ ok }) => {
          expect(ok).to.equal(1)
          done()
        })
        .catch(done)
    })
  })
})
