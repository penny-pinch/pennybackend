export const saveDaysPrices = async (params:any) => {
  const {prices, db} = params;

  await db
      .collection("prices")
      .add(prices);

  console.log(`${prices.day} prices saved to Firestore`);
  return;
};
