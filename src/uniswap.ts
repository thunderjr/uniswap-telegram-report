import axios from "axios";

interface GetPositionRequest {
  chainId: number;
  protocolVersion: string;
  tokenId: string;
  owner: string;
}

interface Position {
  chainId: number;
  protocolVersion: string;
  v3Position: V3Position;
  status: string;
}

interface V3Position {
  tokenId: string;
  tickLower: string;
  tickUpper: string;
  liquidity: string;
  token0: Token;
  token1: Token;
  feeTier: string;
  currentTick: string;
  currentPrice: string;
  tickSpacing: string;
  token0UncollectedFees: string;
  token1UncollectedFees: string;
  amount0: string;
  amount1: string;
  poolId: string;
  totalLiquidityUsd: string;
  currentLiquidity: string;
  apr: number;
  owner: string;
}

interface Token {
  chainId: number;
  address: string;
  symbol: string;
  decimals: number;
  name: string;
}

export const getPosition = async (
  request: GetPositionRequest,
): Promise<Position> => {
  const response = await axios.post<{ position: Position }>(
    "https://interface.gateway.uniswap.org/v2/pools.v1.PoolsService/GetPosition",
    request,
    {
      headers: {
        origin: "https://app.uniswap.org",
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    },
  );

  return response.data.position;
};

export type PositionData = ReturnType<typeof parsePositionData>;
export const parsePositionData = (position: Position) => {
  const { token0, token1, apr } = position.v3Position;

  const price = tickToPrice(
    Number(position.v3Position.currentTick),
    token0.decimals,
    token1.decimals,
  );

  const rangeUpper = tickToPrice(
    Number(position.v3Position.tickUpper),
    token0.decimals,
    token1.decimals,
  );

  const rangeLower = tickToPrice(
    Number(position.v3Position.tickLower),
    token0.decimals,
    token1.decimals,
  );

  const amounts = {
    [token0.symbol]: parseFloat(
      formatUnits(BigInt(position.v3Position.amount0), token0.decimals),
    ),
    [token1.symbol]: parseFloat(
      formatUnits(BigInt(position.v3Position.amount1), token1.decimals),
    ),
  };

  const unclaimed = {
    [token0.symbol]: parseFloat(
      formatUnits(
        BigInt(position.v3Position.token0UncollectedFees),
        token0.decimals,
      ),
    ),
    [token1.symbol]: parseFloat(
      formatUnits(
        BigInt(position.v3Position.token1UncollectedFees),
        token1.decimals,
      ),
    ),
  };

  return {
    poolSymbol: `${token0.symbol}/${token1.symbol}`,
    totalUnclaimed: unclaimed[token0.symbol] * price + unclaimed[token1.symbol],
    totalAmount: amounts[token0.symbol] * price + amounts[token1.symbol],
    timestamp: new Date().toISOString(),
    totalSymbol: token1.symbol,
    rangeUpper,
    rangeLower,
    price,
    apr,
  };
};

const tickToPrice = (
  tick: number,
  token0Decimals: number,
  token1Decimals: number,
) => {
  return Math.pow(1.0001, tick) * Math.pow(10, token0Decimals - token1Decimals);
};

/**
 *  Divides a number by a given exponent of base 10 (10exponent), and formats it into a string representation of the number..
 *
 * - Docs: https://viem.sh/docs/utilities/formatUnits
 *
 * @example
 * import { formatUnits } from 'viem'
 *
 * formatUnits(420000000000n, 9)
 * // '420'
 */
export function formatUnits(value: bigint, decimals: number) {
  let display = value.toString();

  const negative = display.startsWith("-");
  if (negative) display = display.slice(1);

  display = display.padStart(decimals, "0");

  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals),
  ];
  fraction = fraction.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${
    fraction ? `.${fraction}` : ""
  }`;
}
