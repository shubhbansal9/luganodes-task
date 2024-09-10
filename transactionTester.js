const { fetchTransactionDetails } = require('./blockchainUtilities');

async function testTransactionHashes() {
  const txHash1 = 'test1';
  const txHash2 = 'test2';
  const collectionName = 'test deposits';

  console.log('Testing with specific transaction hashes...');

  try {
    await fetchTransactionDetails(txHash1, collectionName);
    await fetchTransactionDetails(txHash2, collectionName);

    console.log('All transactions processed successfully.');

  } catch (error) {
    console.error('Error during transaction processing:', error);
  } finally {
    process.exit(0);
  }
}

testTransactionHashes();