/* eslint-disable */
module.exports = (err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
}
