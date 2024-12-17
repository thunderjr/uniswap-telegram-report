import "dotenv/config";

import TelegramBot from "node-telegram-bot-api";
import { createClient } from "redis";

import { getPositionCache, setPositionCache } from "./redis";
import { getPosition, parsePositionData } from "./uniswap";
import { positionMessage } from "./message";

const requiredValues = {
  POSITION_IDS: process.env.POSITION_IDS?.split(",") || [],
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || "",
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || "",
  OWNER_WALLET: process.env.OWNER_WALLET || "",
  INTERVAL: process.env.INTERVAL || "",
  CHAIN_ID: process.env.CHAIN_ID || "",
};

async function main() {
  const missingValueKeys = Object.entries(requiredValues).filter(([_, value]) => !value?.length).map(([key]) => key);
  if (missingValueKeys.length > 0) throw new Error(`Missing required env values: ${missingValueKeys.join(", ")}`);

  const {
    CHAIN_ID,
    INTERVAL,
    OWNER_WALLET,
    POSITION_IDS,
    TELEGRAM_TOKEN,
    TELEGRAM_CHAT_ID,
  } = requiredValues;

  const redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on('error', err => console.error('[Redis Error]', err));
  await redisClient.connect();

  const telegramBot = new TelegramBot(TELEGRAM_TOKEN);

  for (const positionId of POSITION_IDS) {
    const data = await getPosition({
      protocolVersion: 'PROTOCOL_VERSION_V3',
      chainId: Number(CHAIN_ID),
      owner: OWNER_WALLET,
      tokenId: positionId,
    }).then(parsePositionData);

    const cacheKey = `uniswap-position-${positionId}-${INTERVAL}`;
    const lastData = await getPositionCache(redisClient, cacheKey);
    const message = positionMessage({ lastData, data });

    await telegramBot.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: "MarkdownV2" });
    await setPositionCache(redisClient, cacheKey, data);

    console.log(message);
  }

  await redisClient.disconnect();
}

main();
