import * as functions from "firebase-functions";
import {getNextDayForecast} from "./priceConsumer";
import {saveDaysPrices} from "./saveDaysPrices";
import {db} from "../firebase/firebase";

export const priceConsumerScheduler = functions
    .pubsub
    .schedule("every 5 minutes")
    .onRun(async (context) => {
      const dayPriceData = await getNextDayForecast();
      const averagePrice = dayPriceData.prices.reduce((a, b) => a + b.price, 0);
      const kwhPrices = dayPriceData
          .prices
          .map((price: any) => price.price / 1000);
      await saveDaysPrices({
        db,
        prices: {averagePrice: averagePrice / 1000, prices: kwhPrices},
      });
      return;
    });


