import type { PositionData } from "./uniswap";
import type { createClient } from "redis";

export const setPositionCache = (
  client: ReturnType<typeof createClient>,
  key: string,
  value: PositionData,
) => client.hSet(key, value);

export const getPositionCache = async (
  client: ReturnType<typeof createClient>,
  key: string,
): Promise<PositionData> => {
  const data = (await client.hGetAll(key)) as {
    [K in keyof PositionData]: string;
  };
  return {
    totalUnclaimed: parseFloat(data.totalUnclaimed),
    totalAmount: parseFloat(data.totalAmount),
    rangeUpper: parseFloat(data.rangeUpper),
    rangeLower: parseFloat(data.rangeLower),
    totalSymbol: data.totalSymbol,
    price: parseFloat(data.price),
    poolSymbol: data.poolSymbol,
    timestamp: data.timestamp,
    apr: parseFloat(data.apr),
  };
};
