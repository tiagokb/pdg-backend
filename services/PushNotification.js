const admin = require('firebase-admin');

class PushNotification {
    constructor() {
      this.message = {
        notification: {},
        data: {},
        apns:{
          headers:{
            "apns-expiration": (Math.floor(Date.now() / 1000) + 1200).toString(),
            "apns-priority":"5"
          }
        },
        android:{
          ttl:1200,
          priority:"high"
        },
        webpush:{
          headers:{
            "TTL":"1200",
            Urgency: "high"
          }
        }
      };
    }
  
    setTitle(title) {
      this.message.notification.title = title;
      return this;
    }
  
    setBody(body) {
      this.message.notification.body = body;
      return this;
    }
  
    setToken(token) {
      this.message.token = token;
      return this;
    }

    setTokens(tokens) {
      this.message.tokens = tokens;
      return this;
    }
  
    setData(key, value) {
      this.message.data[key.toString()] = value.toString();
      return this;
    }

    async send() {

      try {
        const messaging = admin.messaging();

        if (this.message.token) {
          return await messaging.send(this.message);
        } else if (this.message.tokens) {
          // Sending multicast messages to multiple tokens
          return await messaging.sendEachForMulticast(this.message);
        } else {
          throw new Error('Token or tokens not set for notification.');
        }
      } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = PushNotification;