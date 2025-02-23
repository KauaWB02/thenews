export class SharedService {
  // getMidnightUTC(date: Date): Date {
  //   return new Date(
  //     Date.UTC(
  //       date.getFullYear(),
  //       date.getMonth(),
  //       date.getDate(),
  //       date.getHours() - 3,
  //       date.getMinutes(),
  //       date.getSeconds(),
  //       date.getMilliseconds()
  //     )
  //   );
  // }

  //Valida se se a DatetoCheck é do dia anterior e se o dia anterior for domingo retorne verdadeiro
  isExactlyOneDayBefore(dateToCheck: Date, referenceDate: Date): boolean {
    const adjustedDate = referenceDate;

    adjustedDate.setDate(adjustedDate.getDate() - 1);

    if (adjustedDate.getUTCDay() === 0) {
      return true;
    }

    return dateToCheck.getTime() === adjustedDate.getTime();
  }
}

export const GetMidnightUTC = (date: Date): Date => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours() - 3,
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
};
