const { userModel } = require("../models");

const uniqueUsername = async (req, res) => {
  const { username } = req.body;

  userModel
    .findOne({ username })
    .then((ans) => {
      if (ans) {
        return res.send({
            unique: false
        });
      }
      return res.send({
        unique: true
      });
    });
}

module.exports = uniqueUsername;