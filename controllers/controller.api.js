const { fetchAPIEndpoints } = require('../models/model.api.js');

exports.getAPIEndpoints = (req, res) => {
  fetchAPIEndpoints().then((endpoints) => {
    res.status(200).send({ endpoints });
  });
};
