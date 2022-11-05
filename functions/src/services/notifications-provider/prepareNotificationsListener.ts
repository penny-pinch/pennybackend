import * as functions from "firebase-functions";
import {saveNotificationsSchedule} from "./saveNotificationsSchedule";
import {db} from "../firebase/firebase";
import {notificationsScheduleParser} from "./notificationsScheduleParser";

export const notificationsScheduler = functions.firestore
    .document("prices/{daysPrice}")
    .onCreate(async (snapshot, context) => {
      const priceData = snapshot.data();
      const {date, prices} = priceData;
      const notificationsSchedule = notificationsScheduleParser({date, prices});
      await saveNotificationsSchedule({db, notificationsSchedule});
      return;
    });
