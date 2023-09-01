const { userModel } = require("../models");
const setToRedis = require('../utils/setToRedis');

const updateUserController = (req, res) => {
  const { id, username, name, email, phoneNumber, pubKey } = req.body;
  console.log('h', id, name, phoneNumber, pubKey);

  userModel
    .findByIdAndUpdate(id, { 
      name,
      email, 
      phoneNumber,
      pubKey
    })
    .then((ans) => {
        if(ans) {
            setToRedis(`${username}`, JSON.stringify(pubKey));
            res.send({
                ok: true
            });
        } else {
            res.send({
                ok: false,
            });
        }
    })
    .catch((err) => {
      console.log(err);
      res.send({
        err: err,
      });
    });
};

module.exports = updateUserController;
