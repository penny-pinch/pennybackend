import {db} from "../firebase/firebase";
import * as functions from "firebase-functions";

export const applianceCycleTrigger =
  functions.https.onRequest(async (request, response) => {
    const priceRef = db.doc("prices/49wuk0lqwKyWMADWGPUv");
    const priceSnap = await priceRef.get();
    const priceData = priceSnap.data();
    const applianceCycle = await startApplianceCycle({
      appliance: {
        name: "Washing machine",
        cycleLengthHours: 2.5,
        consumption: 0.8,
      },
      prices: priceData,
      startTime: 10,
    });
    response.send(applianceCycle);
  });


export const startApplianceCycle = async (props: any) => {
  const {appliance, prices, startTime} = props;
  const startPriceIndex = Math.floor(startTime);
  let cost = 0;
  const averageCost =
    appliance.cycleLengthHours *
    prices.averagePrice *
    appliance.consumption;
  const highestPrice = Math.max(...prices.prices.map((o:any) => o.price));
  const highestCost =
    highestPrice *
    appliance.consumption *
    appliance.cycleLengthHours;

  const overflowInNextHour = appliance.cycleLengthHours % 1;
  for (
    let i = startPriceIndex;
    i < startPriceIndex + Math.floor(appliance.cycleLengthHours);
    i++) {
    cost += (prices.prices[i].price * appliance.consumption);
  }
  if (overflowInNextHour > 0) {
    const overflowPrice = prices.prices[startPriceIndex +
      Math.ceil(appliance.cycleLengthHours)].price * overflowInNextHour;
    cost += (overflowPrice * appliance.consumption);
  }

  const applianceCycle = {
    appliance: appliance.name,
    cost,
    differenceFromAverage: averageCost - cost,
    differenceFromHighest: highestCost - cost,
    duration: appliance.cycleLengthHours,
  };

  return applianceCycle;
};
