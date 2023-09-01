/*
const twilio = require('twilio');

const sendSMS = async(phoneNumber, otp) => {
    console.log(phoneNumber);
    return new Promise(function (resolve, reject) {
        const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        client.messages.create({
            body: `OTP: ${otp}`,
            to: phoneNumber,
            from: process.env.TWILIO_NUMBER,
        }).then(() =>  console.log('OTP sent'))
        .catch((err) => console.log(err));
    });
}

module.exports = sendSMS;
*/

const axios = require('axios');

const sendSMS = (to, text) => {
    const encodedParams = new URLSearchParams();
    encodedParams.append("to", to);
    encodedParams.append("p", process.env.SMS_API);
    encodedParams.append("text", text);

    const options = {
        method: 'POST',
        url: 'https://sms77io.p.rapidapi.com/sms',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': process.env.RAPID_API,
            'X-RapidAPI-Host': 'sms77io.p.rapidapi.com'
        },
        data: encodedParams
    };

    resp = "";
    axios.request(options).then(function (response) {
        resp = response.data;
    }).catch(function (error) {
        resp = error;
    });

    return resp;

}

module.exports = sendSMS;