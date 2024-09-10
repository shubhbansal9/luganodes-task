const { processTransaction, provider, beaconDepositContractAddress } = require('./blockchainUtilities');
const { ethers } = require('ethers');

async function monitorDeposits() {
  const filter = {
    address: beaconDepositContractAddress,
    topics: [
      ethers.utils.id('Deposit(address,uint256)')
    ]
  };

  provider.on(filter, async (log) => {
    const txHash = log.transactionHash;
    console.log(`New deposit detected in transaction: ${txHash}`);

    const collectionName = 'rt deposits';
    const depositDetails = await processTransaction(txHash, collectionName);
    if (depositDetails) {
      console.log(`Deposit Recorded:`, depositDetails);
    }
  });

  console.log(`Monitoring deposits on contract: ${beaconDepositContractAddress}`);
}

monitorDeposits();
