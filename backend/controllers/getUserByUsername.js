const { userModel } = require("../models");

const getUserByUsername = (req, res) => {
  userModel
    .findOne({ _id: req.query.id })
    .then((ans) => {
      if (ans) {
        return res.send({
          Object: ans,
          found: true,
        });
      } else
        res.send({
          found: false,
        });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        err: err,
      });
    });
};

module.exports = getUserByUsername;
