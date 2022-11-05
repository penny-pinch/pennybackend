export const saveNotificationsSchedule = async (params:any) => {
  const {notificationsSchedule, db} = params;

  await db
      .collection("notificationsSchedule")
      .add(notificationsSchedule);

  console.log(`${notificationsSchedule.date} notification schedule saved`);
  return;
};
