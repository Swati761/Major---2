const { sendSMS } = require("../utils");
const { generateOTP } = require("../utils");

const sendOTPController = (req, res) => {
  const { phoneNumber } = req.body;
  const otp = generateOTP();
  return res.json({
    message: sendSMS(phoneNumber, 'OTP is ' + otp)
  });
};

module.exports = sendOTPController;
