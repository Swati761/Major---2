const { userModel } = require("../models");

const addPenaltyController = (req, res) => {
    const { users } = req.body.params;
    for(user in users) {
      userModel.findOne({_id: user})
      .then((ans) => {
        console.log(ans);
        if(ans) {
          ans.penalty += users[user];
        }
        ans.save();
      })
      .catch((err) => {
        console.log(err);
        res.send({
          success: false,
          err: err
        });
      });
    }
};

module.exports = addPenaltyController;
