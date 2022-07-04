exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    // console.log(err.status, '<<< ERROR STATUS');
    // console.log(err.msg, '<<< ERROR msg');
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  }
  next(err);
};

exports.unhandledErrors = (err, req, res, next) => {
  res.status(500).send({ msg: 'unhandled server error' });
};
