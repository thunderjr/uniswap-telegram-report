import { type Duration, intervalToDuration } from "date-fns";
import type { PositionData } from "./uniswap";

type PositionMessageParams = {
  lastData: PositionData;
  data: PositionData;
};

const RANGE_WARNING_THRESHOLD =
  (Number(process.env.RANGE_WARNING_THRESHOLD) || 7.5) / 100;

export const positionMessage = ({ data, lastData }: PositionMessageParams) => {
  const unclaimedChange = percentageChange(
    data.totalUnclaimed,
    lastData.totalUnclaimed,
  );
  const amountChange = percentageChange(data.totalAmount, lastData.totalAmount);
  const priceChange = percentageChange(data.price, lastData.price);
  const aprChange = percentageChange(data.apr, lastData.apr);

  const interval = stringifyDuration(
    intervalToDuration({
      start: new Date(lastData.timestamp),
      end: new Date(),
    }),
  );

  const rangeWarningMessage = rangeWarning(
    data.price,
    data.rangeUpper,
    data.rangeLower,
  );

  return (
    `📊 *${data.poolSymbol}* Uniswap Position Report\n` +
    `Range: 🔼 ${data.rangeUpper.toFixed(6)} 🔽 ${data.rangeLower.toFixed(6)}\n${rangeWarningMessage}\n` +
    "💰 *Total Unclaimed*\n" +
    `${data.totalUnclaimed.toFixed(6)} ${data.totalSymbol} ${changeText(unclaimedChange, interval)}\n\n` +
    "📦 *Total Amount*\n" +
    `${data.totalAmount} ${data.totalSymbol} ${changeText(amountChange, interval)}\n\n` +
    "💹 *Current Price*\n" +
    `${data.price.toFixed(6)} ${changeText(priceChange, interval)}\n\n` +
    `🚀 *APR:* ${data.apr.toFixed(4)}% ${changeText(aprChange, interval)}\n\n` +
    (lastData.timestamp ? `⏰ *Last Updated:* ${lastData.timestamp}` : "")
  ).replaceAll(/([|{\[\]~}+)(#>!=\-.])/gm, "\\$1");
};

const stringifyDuration = (duration: Duration) => {
  const str = Object.entries(duration)
    .reduce((acc, [key, value]) => {
      if (key === "seconds") return acc;
      if (value === 0) return acc;
      return acc + `${value} ${key} `;
    }, "")
    .trim();

  if (str.length > 0) return str;
  if (duration.seconds) return duration.seconds + " seconds";
  return "less than a second";
};

const rangeWarning = (
  price: number,
  rangeUpper: number,
  rangeLower: number,
) => {
  if (price >= rangeUpper * (1 - RANGE_WARNING_THRESHOLD)) {
    return `⚠️ Warning: Price is close to the upper range! (${price.toFixed(6)} >= ${rangeUpper.toFixed(6)})\n`;
  } else if (price <= rangeLower * (1 + RANGE_WARNING_THRESHOLD)) {
    return `⚠️ Warning: Price is close to the lower range! (${price.toFixed(6)} <= ${rangeLower.toFixed(6)})\n`;
  }
  return "";
};

const percentageChange = (current: number, previous: number) => {
  return ((current - previous) / previous) * 100;
};

const changeText = (change: number, interval: string) => {
  return change ? `(${change.toFixed(2)}% in ${interval})` : "";
};
