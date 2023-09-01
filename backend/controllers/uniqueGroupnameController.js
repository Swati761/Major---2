const { groupModel } = require("../models");

const uniqueGroupname = async (req, res) => {
  const { groupname } = req.body;
  groupModel
    .findOne({ name: groupname })
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

module.exports = uniqueGroupname;