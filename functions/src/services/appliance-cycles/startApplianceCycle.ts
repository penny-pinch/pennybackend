import {db} from "../firebase/firebase";
import * as functions from "firebase-functions";

export const applianceCycleTrigger =
  functions.https.onRequest(async (request, response) => {
    const priceRef = db.doc("prices/49wuk0lqwKyWMADWGPUv");
    const priceSnap = await priceRef.get();
    const priceData = priceSnap.data();
    const appliance = request.body.appliance;
    const now = new Date();

    const applianceCycle = await startApplianceCycle({
      appliance: {
        name: appliance.name,
        cycleLengthHours: appliance.cycleLengthHours,
        consumption: appliance.consumption,
      },
      prices: priceData,
      startTime: now.getHours(),
    });
    functions.logger.log("priceData", priceData);
    try {
      response.send(applianceCycle);
    } catch (error) {
      if (error instanceof Error) {
        response.send(error.message);
      } else {
        response.send(error);
      }
    }
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

  return {
    appliance: appliance.name,
    cost,
    differenceFromAverage: averageCost - cost,
    differenceFromHighest: highestCost - cost,
    duration: appliance.cycleLengthHours,
  };
};
