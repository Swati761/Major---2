const { groupModel } = require("../models");

const getGroupController = (req, res) => {
  const { adminUsername } = req.query;
  groupModel
    .find({adminUsername, deleted: false})
    .then((ans) => {
      console.log(ans);
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

module.exports = getGroupController;
