const { groupModel } = require("../models");

const setGroupController = (req, res) => {
  const { name, passphrase, adminUsername, memberUsernames, pubKey, pvtKey } = req.body;
  const group = new groupModel({ name, passphrase, adminUsername, memberUsernames, pubKey, pvtKey });
  group.save((error, obj) => {
    if (error) {
      return res.send({
        message: error,
        result: false,
      });
    }
    return res.send({
      message: "Group Created",
      result: true,
      obj,
    });
  });
};

module.exports = setGroupController;
