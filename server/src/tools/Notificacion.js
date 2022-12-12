const admin = require('firebase-admin');

function initFarebase() {
    const servicesAccount = require('../path/keys/app-push-notification-f632c-firebase-adminsdk-d271n-f5a3ed91dc.json');
    admin.initializeApp({
        credential: admin.credential.cert(servicesAccount)
    });
}

initFarebase();

function sendPushToOneUser(notification) {
    const message = {
        token: notification.tokenId,
        data: notification.data,
    }
    admin.messaging().send(message).then((response) => {
        console.log("Envio de notificatión exitosa");
    }).catch((error) => {
        console.error(error.errorInfo.message)
    });
}

function sendPushToTopic(notification) {
    const message = {
        topic: notification.topic,
        data: {
            title: notification.title,
            message: notification.message
        }
    }
    console.log('send topic')
    admin.messaging().send(message).then((response) => {
        console.log("result", response);
    }).catch((error) => {
        console.log("error", error.message)
    });
}

module.exports = { sendPushToOneUser, sendPushToTopic };