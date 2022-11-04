import * as functions from "firebase-functions";

export const deviceToggle = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs test!", {structuredData: true});
  response.send("Hello from Firebsssase!");
});
