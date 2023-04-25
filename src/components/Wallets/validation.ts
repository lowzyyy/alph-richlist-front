import { ALPH_BASE } from "@/src/globalHelpers";
import { queryParam } from "./WalletTypes";

const takeFirst = (argQ: queryParam) => {
  return Array.isArray(argQ) ? argQ[0] : argQ;
};

export const validateSortOrder = (sortQ: queryParam, orderQ: queryParam) => {
  let sortVal = takeFirst(sortQ);
  let orderVal = takeFirst(orderQ);

  if (sortVal && orderVal) {
    if (
      sortVal === "balance" ||
      sortVal === "ins" ||
      sortVal === "outs" ||
      sortVal == "locked_balance"
    )
      if (orderVal === "desc" || orderVal === "asc")
        return { query: `&sort=${sortVal}&order=${orderVal}`, sortVal, orderVal };
      else return { query: `${sortVal} desc`, sortVal, orderVal: "desc" };
  }
  if (sortVal && !orderVal) {
    if (sortVal === "balance" || sortVal === "ins" || sortVal === "outs")
      return { query: `&sort=${sortVal}&order=desc`, sortVal, orderVal: "desc" };
  }
  return { query: "&sort=balance&order=desc", sortVal: "balance", orderVal: "desc" };
};

export const validateFilter = (filterQ: queryParam) => {
  const filterVal = takeFirst(filterQ);
  if (filterVal) {
    if (filterVal === "all") return { query: `&filter=all`, filterVal };
    if (filterVal === "justgenesis") return { query: `&filter=justgenesis`, filterVal };
    else return { query: "", filterVal: "" };
  } else return { query: "", filterVal: "" };
};

export const validateAge = (ageQ: queryParam) => {
  const ageVal = takeFirst(ageQ);
  if (ageVal) {
    if (
      ageVal === "<=1w" ||
      ageVal === "<=1m" ||
      ageVal === "<=6m" ||
      ageVal === "<=1y" ||
      ageVal === "<=2y" ||
      ageVal === ">=1w" ||
      ageVal === ">=1m" ||
      ageVal === ">=6m" ||
      ageVal === ">=1y" ||
      ageVal === ">=2y"
    )
      return { query: `&age=${ageVal}`, ageVal };
    else return { query: "", ageVal: "" };
  } else return { query: "", ageVal: "" };
};

// BALANCE VALIDATE
export type RegExpGroups<T extends string> =
  | (RegExpExecArray & {
      groups?: { [name in T]: string } | { [key: string]: string };
    })
  | null;

const orderBounds = (x1: string, x2: string, lMulti?: string, rMulti?: string) => {
  const lMul = lMulti ? getMultiplier(lMulti) : 1;
  const rMul = rMulti ? getMultiplier(rMulti) : 1;
  const left = +x1 * ALPH_BASE * (lMul ?? 1),
    right = +x2 * ALPH_BASE * (rMul ?? 1);
  const lString = x1 + (lMulti ?? "");
  const rString = x2 + (rMulti ?? "");
  return left > right ? { l: rString, r: lString } : { l: lString, r: rString };
};

const getMultiplier = (m: string) => (m === "k" ? 1000 : 1_000_000);

export const normalBalance = /^(?<Normal>\d+(?:\.\d+)?$)/;
export const shortBalance = /^(?<Short>\d+(?:\.\d+)?)(?<Multi>k|m)$/;
export const rangeBalance =
  /^(?:(?<fNormal>\d+(?:\.\d+)?)|((?<fShort>\d+(?:\.\d+)?)(?<fMulti>k|m)))-((?<sNormal>\d+(?:\.\d+)?)|(?:(?<sShort>\d+(?:\.\d+)?)(?<sMulti>k|m)))$/;

export const validateBalanceURL = (balanceQ: queryParam) => {
  const balance = takeFirst(balanceQ)?.toLocaleLowerCase();
  if (balance) {
    if (balance.startsWith(">=") || balance.startsWith("<=")) {
      const maybeNumber = balance.slice(2);
      const symbol = balance.slice(0, 2);
      const symbolId = symbol === "<=" ? true : false;
      if (normalBalance.test(maybeNumber)) {
        const match: RegExpGroups<"Normal"> = normalBalance.exec(maybeNumber)!;
        const { Normal } = match.groups!;
        return {
          query: `&balance=${symbol}${Normal}`,
          balanceLeftVal: `${symbolId ? "" : `${Normal}`}`,
          balanceRightVal: `${symbolId ? `${Normal}` : ""}`,
        };
      }
      if (shortBalance.test(maybeNumber)) {
        const match: RegExpGroups<"Short" | "Multi"> = shortBalance.exec(maybeNumber)!;
        const { Short, Multi } = match.groups!;
        return {
          query: `&balance=${symbol}${Short}${Multi}`,
          balanceLeftVal: `${symbolId ? "" : `${Short}${Multi}`}`,
          balanceRightVal: `${symbolId ? `${Short}${Multi}` : ""}`,
        };
      }
      return { query: "", balanceLeftVal: "", balanceRightVal: "" };
    } else if (rangeBalance.test(balance)) {
      const match: RegExpGroups<
        "fNormal" | "fShort" | "fMulti" | "sNormal" | "sShort" | "sMulti"
      > = rangeBalance.exec(balance)!;
      const { fNormal, fShort, fMulti, sNormal, sShort, sMulti } = match.groups!;
      if (fNormal && sNormal) {
        const { l, r } = orderBounds(fNormal, sNormal);
        return {
          query: `&balance=${l}-${r}`,
          balanceLeftVal: `${l}`,
          balanceRightVal: `${r}`,
        };
      }
      if (!fNormal && sNormal) {
        const { l, r } = orderBounds(fShort, sNormal, fMulti);
        return {
          query: `&balance=${l}-${r}`,
          balanceLeftVal: `${l}`,
          balanceRightVal: `${r}`,
        };
      }
      if (fNormal && !sNormal) {
        const { l, r } = orderBounds(fNormal, sShort, undefined, sMulti);
        return {
          query: `&balance=${l}-${r}`,
          balanceLeftVal: `${l}`,
          balanceRightVal: `${r}`,
        };
      }
      if (!fNormal && !sNormal) {
        const { l, r } = orderBounds(fShort, sShort, fMulti, sMulti);
        return {
          query: `&balance=${l}-${r}`,
          balanceLeftVal: `${l}`,
          balanceRightVal: `${r}`,
        };
      }
      return { query: "", balanceLeftVal: "", balanceRightVal: "" };
    } else return { query: "", balanceLeftVal: "", balanceRightVal: "" };
  } else return { query: "", balanceLeftVal: "", balanceRightVal: "" };
};

export const validateBalanceClient = (leftQ: string, rightQ: string) => {
  const left = leftQ.trim().toLowerCase();
  const right = rightQ.trim().toLowerCase();
  const emptyBalance = { query: "", balanceLeftVal: "", balanceRightVal: "" };
  if (!left && !right) return emptyBalance;
  if (left && !right) {
    if (normalBalance.test(left) || shortBalance.test(left))
      return {
        query: `&balance=>=${left}`,
        balanceLeftVal: `${left}`,
        balanceRightVal: "",
      };
    else return emptyBalance;
  }
  if (!left && right) {
    if (normalBalance.test(right) || shortBalance.test(right))
      return {
        query: `&balance=<=${right}`,
        balanceLeftVal: "",
        balanceRightVal: `${right}`,
      };
    else return emptyBalance;
  }
  if (left && right) {
    const leftTest = normalBalance.test(left) || shortBalance.test(left);
    const righTest = normalBalance.test(right) || shortBalance.test(right);
    if (leftTest && righTest)
      return {
        query: `&balance=${left}-${right}`,
        balanceLeftVal: `${left}`,
        balanceRightVal: `${right}`,
      };
    else if (!leftTest && righTest) {
      return {
        query: `&balance=<=${right}`,
        balanceLeftVal: "",
        balanceRightVal: `${right}`,
      };
    } else if (leftTest && !righTest)
      return {
        query: `&balance=>=${left}`,
        balanceLeftVal: `${left}`,
        balanceRightVal: "",
      };
  } else return emptyBalance;
  return emptyBalance;
};

export const validateZeroOuts = (zeroOutsQ: queryParam) => {
  const zeroOuts = takeFirst(zeroOutsQ);
  if (zeroOuts) {
    if (zeroOuts === "true") return { query: "&zeroOuts=true" };
    else return { query: "" };
  } else return { query: "" };
};

export const validateDormant = (dormantQ: queryParam) => {
  const dormant = takeFirst(dormantQ);
  if (dormant) {
    if (dormant === "6m" || dormant === "1y" || dormant === "2y")
      return { query: `&dormant=${dormant}`, dorVal: `${dormant}` };
    else return { query: "", dorVal: "" };
  } else return { query: "", dorVal: "" };
};
