const { fetchUsers } = require('../models/models.users.js');

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};
