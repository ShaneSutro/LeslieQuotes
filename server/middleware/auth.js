const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.GOOGLE_CREDS)),
});

const decodeAuthToken = async (req, res, next) => {
  const header = req.headers?.authorization;
  if (header !== 'Bearer null' && req.headers?.authorization.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.currentUser = decodedToken;
    } catch (err) {
      console.error(err);
    }
  }
  next();
};

module.exports = decodeAuthToken;
