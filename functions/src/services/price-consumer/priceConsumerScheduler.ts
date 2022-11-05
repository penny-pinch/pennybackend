import * as functions from "firebase-functions";
import {getNextDayForecast} from "./priceConsumer";
import {saveDaysPrices} from "./saveDaysPrices";
import {db} from "../firebase/firebase";

export const priceConsumerScheduler = functions
    .pubsub
    .schedule("every 5 minutes")
    .onRun(async (context) => {
      const prices = await getNextDayForecast();
      const averagePrice = prices.prices.reduce((a, b) => a + b.price, 0);
      await saveDaysPrices({db, prices: {averagePrice, ...prices}});
      return;
    });


