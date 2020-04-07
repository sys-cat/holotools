const { Firestore } = require('@google-cloud/firestore');

const CLIENT_SECRET = JSON.parse(process.env.GOOGLE_SERVICE_JSON);

module.exports = new Firestore({
  projectId: CLIENT_SECRET.project_id,
  credentials: {
    client_email: CLIENT_SECRET.client_email,
    private_key: CLIENT_SECRET.private_key,
  },
});
