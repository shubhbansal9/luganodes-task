require('dotenv').config();

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const axios = require('axios');

// Configuration constants
const CONFIG = {
    testMode: process.env.TEST_MODE === 'true',
    alchemyWsUrl: process.env.ALCHEMY_WS_URL,
    mongoUrl: process.env.MONGO_URL,
    dbName: 'ugaluga',
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.CHAT_ID,
    },
    logFilePath: path.join(__dirname, process.env.LOG_FILE_PATH),
    beaconDepositContractAddress: process.env.BEACON_DEPOSIT_CONTRACT_ADDRESS,
};

// Ethereum provider using WebSocket
const provider = new ethers.providers.WebSocketProvider(CONFIG.alchemyWsUrl);

// MongoDB client initialization
const client = new MongoClient(CONFIG.mongoUrl);

// Send message to Telegram
async function notifyTelegram(messageContent) {
    if (CONFIG.testMode) return;

    const telegramApiUrl = `https://api.telegram.org/bot${CONFIG.telegram.botToken}/sendMessage`;

    try {
        await axios.post(telegramApiUrl, {
            chat_id: CONFIG.telegram.chatId,
            text: messageContent,
        });
        console.log('Notification sent via Telegram');
    } catch (err) {
        console.error('Failed to send Telegram message:', err);
    }
}

// Initialize MongoDB connection
async function initializeMongoDB() {
    try {
        await client.connect();
        console.log('MongoDB connection established');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

// Retrieve and process transaction details
async function processTransaction(txHash, collectionName) {
    try {
        const transaction = await provider.getTransaction(txHash);
        if (transaction) {
            const block = await provider.getBlock(transaction.blockNumber);
            const gasFee = transaction.gasPrice.mul(transaction.gasLimit);
            const internalTx = ethers.utils.formatEther(transaction.value) === '0.0';

            // Display transaction details in the console
            logTransactionDetails(transaction, block, gasFee, internalTx);

            const depositEntry = {
                blockNumber: transaction.blockNumber,
                blockTimestamp: block.timestamp,
                fee: ethers.utils.formatEther(gasFee),
                hash: transaction.hash,
                pubkey: transaction.from,
                from: transaction.from,
                to: transaction.to,
                value: ethers.utils.formatEther(transaction.value),
                gasPrice: ethers.utils.formatUnits(transaction.gasPrice, 'gwei'),
                formattedTimestamp: new Date(block.timestamp * 1000).toISOString(),
            };

            if (!CONFIG.testMode) {
                await storeTransaction(depositEntry, collectionName);
                logTransactionToFile(txHash, true, internalTx);
            }

            const notificationMessage = formatTransactionMessage(transaction, block);
            await notifyTelegram(notificationMessage);

            return depositEntry;
        } else {
            console.log(`Transaction ${txHash} not found.`);
            logTransactionToFile(txHash, false, false);
        }
    } catch (err) {
        console.error(`Error processing transaction ${txHash}:`, err);
        logTransactionToFile(txHash, false, false, err.message);
    }
}

// Format the transaction details into a message
function formatTransactionMessage(transaction, block) {
    return `New Ethereum Transaction Detected:
From: ${transaction.from}
To: ${transaction.to}
Value: ${ethers.utils.formatEther(transaction.value)} ETH
Gas Price: ${ethers.utils.formatUnits(transaction.gasPrice, 'gwei')} Gwei
Timestamp: ${new Date(block.timestamp * 1000).toISOString()}`;
}

// Log transaction details to the console
function logTransactionDetails(transaction, block, gasFee, internalTransaction) {
    console.log(`Transaction ${transaction.hash} details:`);
    if (internalTransaction) {
        console.log('This is an internal transaction (no ETH transfer).');
    }
    console.log(`From: ${transaction.from}`);
    console.log(`To: ${transaction.to}`);
    console.log(`Value: ${ethers.utils.formatEther(transaction.value)} ETH`);
    console.log(`Block: ${transaction.blockNumber}`);
    console.log(`Gas Fee: ${ethers.utils.formatEther(gasFee)} ETH`);
    console.log(`Timestamp: ${new Date(block.timestamp * 1000).toISOString()}`);
}

// Store the transaction data in MongoDB
async function storeTransaction(depositData, collectionName) {
    if (CONFIG.testMode) return;

    try {
        const database = client.db(CONFIG.dbName);
        const collection = database.collection(collectionName);
        await collection.insertOne(depositData);
        console.log(`Transaction stored in MongoDB under collection "${collectionName}"`);
    } catch (err) {
        console.error('Error saving transaction to MongoDB:', err);
    }
}

// Log transactions to a file for record-keeping
function logTransactionToFile(txHash, success, internalTx, error = null) {
    const logEntry = `${new Date().toISOString()} - TxHash: ${txHash} - Success: ${success} ${internalTx ? '(Internal Tx)' : ''} ${error ? `Error: ${error}` : ''}\n`;
    fs.appendFileSync(CONFIG.logFilePath, logEntry);
}

// Close MongoDB connection
async function closeMongoConnection() {
    try {
        await client.close();
        console.log('MongoDB connection closed');
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
    }
}

// Export necessary modules
module.exports = {
    processTransaction,
    initializeMongoDB,
    closeMongoConnection,
    provider,
    beaconDepositContractAddress: CONFIG.beaconDepositContractAddress,
};
