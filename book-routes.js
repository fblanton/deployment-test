const { Router } = require('express');
const ObjectId = require('mongodb').ObjectID;

module.exports = db => {
  const router = new Router();
  const books = db.collection('books');

  router.post('/', (req, res, next) => {
    if (Array.isArray(req.body)) {
      books
        .insertMany(req.body)
        .then(({ insertedCount, ops, insertedIds }) =>
          res.json(({ insertedCount, ops, insertedIds })))
          .catch(next)
    } else {
      books
        .insertOne(req.body)
        .then((insertedCount, ops, insertedIds) =>
          res.json(({ insertedCount, ops, insertedIds })))
          .catch(next)
    }
  })

  router.get('/', ({ query }, res, next) =>
    books
      .find(query)
      .toArray()
      .then(docs => res.json(docs))
      .catch(next)
  )

  router.put('/:id', ({ params: { id }, body }, res, next) =>
    books
      .updateOne({ _id: ObjectId(id) }, {$set: body})
      .then(({ result: { ok } }) => {
        if (!ok) { next(`unable to update id: ${id}`) }
        books.findOne({ _id: ObjectId(id) })
          .then(doc => res.status(200).json(doc))
          .catch(next)
      })
      .catch(next)
  )

  router.delete('/:id', ({ params: { id }, body }, res, next) =>
    books
      .deleteOne({ _id: ObjectId(id) })
      .then(({ result }) => res.status(200).json(result))
      .catch(next)
  )
  return router;
}
