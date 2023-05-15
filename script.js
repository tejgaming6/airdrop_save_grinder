const ethers = require('ethers');
const { ZkSyncWallet, getDefaultProvider } = require('zksync');

// Set up Ethereum provider
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// Set up Zksync provider
const zkSyncProvider = getDefaultProvider('mainnet');

// Set up wallets
const wallet1 = new ethers.Wallet('PRIVATE_KEY_1', provider);
const wallet2 = new ethers.Wallet('PRIVATE_KEY_2', provider);

// Set up token details
const tokenSymbol = 'ETH';
const tokenDecimals = 18;

// Set up Zksync wallets
const syncWallet1 = await ZkSyncWallet.fromEthSigner(wallet1, zkSyncProvider);
const syncWallet2 = await ZkSyncWallet.fromEthSigner(wallet2, zkSyncProvider);

// Function to transfer funds from wallet1 to wallet2
async function transferFunds() {
  const transferAmount = ethers.utils.parseUnits('1', tokenDecimals); // Transfer 1 ETH

  const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const targetTimestamp = calculateNextExecutionTimestamp(); // Calculate next execution timestamp
  
  if (currentTimestamp >= targetTimestamp) {
    const transfer = await syncWallet1.syncTransfer({
      to: syncWallet2.address,
      token: tokenSymbol,
      amount: transferAmount,
      feeOptimize: true, // Optimize for lower gas fees
    });

    await transfer.awaitReceipt();
    console.log(`Transfer from ${wallet1.address} to ${wallet2.address} successful!`);
  } else {
    console.log('Not yet time for transfer. Waiting for the scheduled time.');
  }
}

// Calculate next execution timestamp based on the specific day of the month
function calculateNextExecutionTimestamp() {
  const now = new Date();
  let targetTime = new Date(now.getFullYear(), now.getMonth() + 1, 1, 7, 0, 0); // Set 7 AM of next month's first day as the target time

  while (targetTime.getDay() !== getTargetDayOfMonth()) {
    targetTime.setDate(targetTime.getDate() + 1); // Increment target time by one day until the target day is reached
  }

  return Math.floor(targetTime.getTime() / 1000); // Convert to timestamp in seconds
}

// Get the target day of the month based on the number of transactions executed so far
function getTargetDayOfMonth() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  if (currentMonth === 0) {
    // January: First transaction on Monday, second transaction on Tuesday, third transaction on Wednesday
    return [1, 2, 3][getTransactionCount() % 3];
  } else {
    // Following months: First transaction on Tuesday, second transaction on Wednesday, third transaction on Thursday
    return [2, 3, 4][getTransactionCount() % 3];
  }
}

// Get the number of transactions executed so far (stored in a file or database)
function getTransactionCount() {
  // Implement your logic here to retrieve and return the number of transactions executed so far
  // Example: Read from a file, query a database, etc.
}

// Execute the transfer
transferFunds();
