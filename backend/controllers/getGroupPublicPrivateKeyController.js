const { obj } = require("../Schema/refreshToken");
const { groupModel } = require("../models");
const setToRedis = require("../utils/setToRedis");
const getFromRedis = require("../utils/setToRedis");

const getGroupPublicPrivateKey = async(req, res) => {
  const groupname = req.query.groupname;
  const pubKey = await getFromRedis(groupname + "_pub");
  const pvtKey = await getFromRedis(groupname + "_pvt"); 
  if(pubKey && pvtKey) {
    res.send({
      pubKey,
      pvtKey
    });
  }
  groupModel
    .findOne({ groupname })
    .then(async(obj) => {
      await setToRedis(`${groupname}_pub`, JSON.stringify(obj.pubKey));
      await setToRedis(`${groupname}_pvt`, JSON.stringify(obj.pvtKey));
      res.send({
        pubKey: obj.pubKey,
        pvtKey: obj.pvtKey
      });
    })
    .catch((err) => {
      res.send({
        err: err,
      });
    });
};

module.exports = getGroupPublicPrivateKey;
