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

  const transfer = await syncWallet1.syncTransfer({
    to: syncWallet2.address,
    token: tokenSymbol,
    amount: transferAmount,
    feeOptimize: true, // Optimize for lower gas fees
  });

  await transfer.awaitReceipt();
  console.log(`Transfer from ${wallet1.address} to ${wallet2.address} successful!`);
}

// Execute the transfer
transferFunds();

