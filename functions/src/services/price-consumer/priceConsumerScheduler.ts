import * as functions from "firebase-functions";
import {getNextDayForecast} from "./priceConsumer";
import {saveDaysPrices} from "./saveDaysPrices";
import {db} from "../firebase/firebase";

export const priceConsumerScheduler = functions
    .pubsub
    .schedule("every 5 minutes")
    .onRun(async (context) => {
      const dayPriceData = await getNextDayForecast();
      const kwhPrices = dayPriceData
          .prices
          .map((price: any) => {
            return {price: price.price / 1000, time: price.time};
          });
      const averagePrice =
        kwhPrices.reduce((a, b) => a + b.price, 0) / kwhPrices.length;
      await saveDaysPrices({
        db,
        prices: {
          averagePrice: averagePrice,
          prices: kwhPrices,
          date: dayPriceData.date,
        },
      });
      return;
    });


