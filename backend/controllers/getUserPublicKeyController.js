const { userModel } = require("../models");
const setToRedis = require("../utils/setToRedis");
const getFromRedis = require("../utils/getFromRedis");

const getUserPublicKeyController = async(req, res) => {
  const username = req.query.username;
  const pubKey = await getFromRedis(username);
  if(pubKey) {
    res.send({
      pubKey,
    });
  }
  userModel
    .findOne({ username })
    .then(async(obj) => {
      await setToRedis(`${username}`, JSON.stringify(obj.pubKey));
      res.send({
        pubKey: obj.pubKey,
      });
    })
    .catch((err) => {
      res.send({
        err: err,
      });
    });
};

module.exports = getUserPublicKeyController;
