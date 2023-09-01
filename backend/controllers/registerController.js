const bcrypt = require("bcrypt");
const { userModel } = require("../models");
const { tokenGenerate } = require("../utils");
const setToRedis = require("../utils/setToRedis");

const register = async (req, res) => {
  const { phoneNumber, name, email, username, password, pubKey } = req.body;
  const user = new userModel({ phoneNumber, username, name, email, password, verifiedByEmail: true, verifiedByPhone: true, pubKey});
  user
    .createUser()
    .then((ans) => {
      const id = ans._id;
      setToRedis(`${ans.username}`, JSON.stringify(pubKey));
      tokenGenerate(ans).then(({ accessToken, refreshToken }) => {
        res.send({
          username,
          id,
          accessToken,
          refreshToken,
          found: true,
        });
      });
    })
    .catch((err) => {
      res.send({
        success: false,
        message: err,
      });
    });
};
module.exports = register;
