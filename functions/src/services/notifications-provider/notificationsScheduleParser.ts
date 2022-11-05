export const notificationsScheduleParser = (params: any) => {
  const {prices, date} = params;
  prices.sort((a:any, b: any) => a.price - b.price);
  const threeCheapestHours = [prices[0], prices[1], prices[2]];
  const threeCostlyHours =
    [prices[prices.length - 1],
      prices[prices.length - 2],
      prices[prices.length - 3],
    ];
  const notificationsSchedule = {
    date,
    threeCheapestHours,
    threeCostlyHours,
  };
  return notificationsSchedule;
};
