const sendOTPController = require("./sendOtpController");
const registerController = require("./registerController");
const sendMailController = require("./sendMailController");
const verifyOTPController = require("./verifyOTPController");
const loginController = require("./loginController");
const refreshTokenController = require("./refreshTokenController");
const setGroupController = require("./setGroupController");
const deleteGroupController = require("./deleteGroupController.js");
const getGroupController = require("./getGroupController");
const getGroupByIdController = require("./getGroupByIdController");
const getAllGroupController = require("./getAllGroupsController");
const getAllUserController = require("./getAllUserController");
const getIPController = require("./getIPController");
const addPenaltyController = require('./addPenaltyController');
//const registerAttackController = require('./registerAttackController');
const getUserPublicKeyController = require('./getUserPublicKeyController');
const getGroupPublicPrivateKeyController = require('./getGroupPublicPrivateKeyController');
const uniqueUsernameController = require('./uniqueUsernameController');
const uniqueGroupnameController = require('./uniqueGroupnameController');
const getUserByUsername = require('./getUserByUsername');
const updateUserController = require('./updateUserController');

module.exports = {
  getAllGroupController,
  sendOTPController,
  registerController,
  sendMailController,
  verifyOTPController,
  loginController,
  refreshTokenController,
  setGroupController,
  getGroupController,
  deleteGroupController,
  getGroupByIdController,
  getAllUserController,
  getIPController,
  addPenaltyController,
  getUserPublicKeyController,
  uniqueUsernameController,
  uniqueGroupnameController,
  getGroupPublicPrivateKeyController,
  getUserByUsername,
  updateUserController
  //registerAttackController
};
