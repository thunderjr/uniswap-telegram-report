# Uniswap Position Notifier Bot 📊

This is a Telegram notifier designed to send periodic updates about a specified **Uniswap V3 position**. It is intended to be run as a **cron job** for automated notifications.

## Environment Variables 📄
Copy the `.env.example` file to `.env`:

```shell
cp .env.example .env
```

And fill in the following details:

```dotenv
# Optional - List of Uniswap position IDs to monitor (comma-separated)
# If not specified, it will list all positions (see LIST_POSITIONS_PAGE_SIZE)
POSITION_IDS=9876543,1234567

# Your Telegram chat ID to receive notifications
TELEGRAM_CHAT_ID=42069

# Telegram bot token obtained from BotFather
TELEGRAM_TOKEN=YOUR_BOT_TOKEN

# Owner wallet address
OWNER_WALLET=0xdeadbeef

# Chain ID of the blockchain (e.g., 137 for Polygon)
CHAIN_ID=137

# Range warning threshold (in percentage) [Default: 7.5%]
RANGE_WARNING_THRESHOLD=7.5

# Cache interval key (for multiple interval cache support)
INTERVAL=1h

# Optional - List positions request page size [Default: 25]
LIST_POSITIONS_PAGE_SIZE=25

# Optional - Redis URL for caching (leave empty to use localhost by default)
REDIS_URL=
```

## Example Message 📝

```
📊 *WETH/USDT* Uniswap Position Report
Range: 🔼 3000 🔽 4000
⚠️ Warning: Price is close to the upper range! (60.784620 >= 60.800000)

💰 *Total Unclaimed*
1.267819 WETH +0.25% (1h)

📦 *Total Amount*
166.082057 WETH +0.12% (1h)

💹 *Current Price*
3420 USDT +0.32% (1h)

🚀 *APR:* 10.8632% +0.10% (1h)

⏰ *Last Updated:* 2024-08-12 12:00:00
```

## Support & Feedback 🤝
Feel free to open an issue if you encounter any problems or have feature suggestions!
