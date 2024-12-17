# Uniswap Position Notifier Bot 📊

This is a Telegram notifier designed to send periodic updates about a specified **Uniswap V3 position**. It is intended to be run as a **cron job** for automated notifications.

## Environment Variables 📄
Copy the `.env.example` file to `.env`:

```shell
cp .env.example .env
```

And fill in the following details:

```dotenv
# List of Uniswap position IDs to monitor (comma-separated)
POSITION_IDS=9876543,1234567

# Your Telegram chat ID to receive notifications
TELEGRAM_CHAT_ID=YOUR_CHAT_ID

# Telegram bot token obtained from BotFather
TELEGRAM_TOKEN=YOUR_BOT_TOKEN

# Owner wallet address
OWNER_WALLET=0xYourWalletAddress

# Cache interval key (for multiple interval support)
INTERVAL=1h

# Chain ID of the blockchain (e.g., 137 for Polygon)
CHAIN_ID=137

# Redis URL for caching (leave empty to use localhost by default)
REDIS_URL=
```

## Example Message 📝

A sample message sent by the bot:

```
📊 WMATIC/USDT Uniswap Position Report

💰 Total Unclaimed
117.267819 WMATIC (+0.25% in 1 hour)

📦 Total Amount
166.082057 WMATIC (+0.12% in 1 hour)

💹 Current Price
0.042069 USDT (+0.32% in 1 hour)

🚀 APR: 7.8632% (+0.10% in 1 hour)

⏰ Last Updated: 2024-08-12 12:00:00
```

## Support & Feedback 🤝
Feel free to open an issue if you encounter any problems or have feature suggestions!
