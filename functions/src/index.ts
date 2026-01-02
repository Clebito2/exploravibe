import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const createPagBankOrder = functions.https.onCall(async (data, context) => {
    // Check auth
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
    }

    // PagBank integration logic will go here
    return {
        orderId: "PB-" + Math.random().toString(36).substr(2, 9),
        status: "pending",
    };
});
