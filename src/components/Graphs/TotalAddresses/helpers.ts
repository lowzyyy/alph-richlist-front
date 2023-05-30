import { TotalAddressPerDate } from "./TotalAddressesTypes";

export const getMonthlyTotalAdd = (
  totalAdds: TotalAddressPerDate[] | undefined
): TotalAddressPerDate[] | undefined => {
  if (!totalAdds) {
    console.log("Empty");
    return;
  }

  const monthlyMap = new Map<string, { amount: number; total: number }>();

  for (let i = 0; i < totalAdds.length; i++) {
    const { date, amount, total } = totalAdds[i];
    const [month, _, year] = date.split("/");
    const monthYear = month + "/" + year;
    if (i === 0 && !monthlyMap.has(monthYear))
      monthlyMap.set(monthYear, { amount, total });
    else if (!monthlyMap.has(monthYear))
      monthlyMap.set(monthYear, { amount, total: totalAdds[i - 1].total + amount });
    else {
      monthlyMap.set(monthYear, {
        amount: monthlyMap.get(monthYear)!.amount + amount,
        total: monthlyMap.get(monthYear)!.total + amount,
      });
    }
  }

  const arr: { date: string; amount: number; total: number }[] = [];
  monthlyMap.forEach((val, key) =>
    arr.push({ date: key, amount: val.amount, total: val.total })
  );

  return arr;
};
