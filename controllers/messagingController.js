require('dotenv').config();
const admin = require('firebase-admin');

function getMessaging() {return admin.messaging();} 

const registrationToken = process.env.MESSAGING_TOKEN_TO_TEST;

const message = {
    data: {
        score: '850',
        time: '2:45'
    },
    token: registrationToken
};

exports.sendTestMessage = async (req, res) => {
    getMessaging().send(message)
    .then((response) => {

        const message = 'Successfully sent message: '+response;
        console.log(message);
        return res.status(200).json({message: message});
    })
    .catch((error) => {

        const message = 'Error sending message:' + error.message
        console.log(message);
        return res.status(500).json(message);
    });
}