

![Project Logo](./assets/project-logo.jpg)

# ⚡ Ethereum Transaction Monitor System 🚀

This project monitors Ethereum transactions, logs details into MongoDB, notifies via Telegram, and stores logs locally. It tracks specific transactions on the Ethereum network using Alchemy WebSocket and provides real-time notifications.

## ✨ Features

- 📝 **Real-time monitoring** of Ethereum transactions.
- 🗃️ Logs transaction details to **MongoDB**.
- 📲 Sends notifications to **Telegram**.
- 🛠️ Saves logs locally for record-keeping.
- 🚧 **Test mode** for safe dry-run.

## 🛠️ Prerequisites

- **Node.js** (v14+)
- **MongoDB** database
- **Alchemy WebSocket** API for Ethereum
- **Telegram Bot** (for notifications)

## 🚀 Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ethereum-monitor.git
cd ethereum-monitor
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create a `.env` File

```plaintext
TEST_MODE=true
ALCHEMY_WS_URL=YOUR_ALCHEMY_WEBSOCKET_URL
MONGO_URL=YOUR_MONGODB_CONNECTION_STRING
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
CHAT_ID=YOUR_TELEGRAM_CHAT_ID
LOG_FILE_PATH=logs/transactions.log
BEACON_DEPOSIT_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
```

### Step 4: Configure MongoDB

Make sure MongoDB is running on the specified host.

### Step 5: Set Up Telegram Bot 🤖

    1. Create a bot using [BotFather](https://core.telegram.org/bots#botfather).
    2. Get your bot token and chat ID, and add them to `.env`.

### Step 6: Create Logs Directory

```bash
mkdir logs
```

## 📖 Usage


### Step 1: Start Monitoring 🛡️

```bash
node depositMonitor.js
```

### Step 2: Testing 🧪

```bash
node transactionsTester.js
```

### Step 3: View Logs 🗒️

Check `transactions_log.txt` for detailed records.

## 📂 File Structure

```plaintext
.
├── blockchainUtilities.js
├── depositMonitor.js
├── transactionTest.js
├── transactions_log.txt
├── .env
├── package.json
└── README.md
```

## 🛠️ API Overview

### `blockchainUtilities.js`

- **`processTransaction(txHash, collectionName)`**: Fetches, logs, stores transaction details, and notifies via Telegram.
- **`notifyTelegram(messageContent)`**: Sends notifications.
- **`storeTransaction(depositData, collectionName)`**: Stores transaction data in MongoDB.

## 📑 Environment Variables

| Variable                       | Description                                 |
| -------------------------------| ------------------------------------------- |
| `TEST_MODE`                     | `true` for test mode                        |
| `ALCHEMY_WS_URL`                | Alchemy WebSocket URL                       |
| `MONGO_URL`                     | MongoDB connection string                   |
| `TELEGRAM_BOT_TOKEN`            | Telegram bot token                          |
| `CHAT_ID`                       | Telegram chat ID                            |
| `LOG_FILE_PATH`                 | Path for transaction logs                   |
| `BEACON_DEPOSIT_CONTRACT_ADDRESS`| Ethereum contract address                   |

To add Git commands for contributing to your project, you can update the **Contributing** section like this:

---

## 🛠️ Contributing

Contributions are welcome! Follow these steps to contribute:

### Step 1: Fork the Repository 🍴

Click the **Fork** button on the top right corner of [this repository](https://github.com/shubhbansal9/luganodes-task).

### Step 2: Clone Your Fork 🛠️

Clone your forked repository to your local machine.

```bash
git clone https://github.com/shubhbansal9/luganodes-task.git
```

### Step 3: Create a New Branch 🌿

Create a new branch for your feature or bug fix.

```bash
git checkout -b feature/your-feature-name
```

### Step 4: Make Your Changes 📝

Make your changes in the codebase.

### Step 5: Commit Your Changes ✅

After making changes, commit them with a meaningful commit message.

```bash
git add .
git commit -m "Add a brief description of your changes"
```

### Step 6: Push to Your Fork 🔄

Push the changes to your forked repository.

```bash
git push origin main
```

### Step 7: Create a Pull Request 🚀

Go to the original repository on GitHub and create a pull request from your branch. Ensure that you provide a detailed description of your changes.



## 📜 License

This project is licensed under the MIT License.

