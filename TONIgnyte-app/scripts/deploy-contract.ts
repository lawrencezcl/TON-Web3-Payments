import { 
  Address, 
  beginCell, 
  Cell, 
  toNano, 
  WalletContractV4,
  TonClient,
  internal,
  SendMode,
  StateInit
} from 'ton';
import { mnemonicToWalletKey } from 'ton-crypto';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Contract deployment script for TON loyalty token
async function deployLoyaltyContract() {
  // Initialize TON client for testnet
  const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: process.env.TONCENTER_API_KEY, // You need to set this API key
  });

  // Load wallet private key from mnemonic
  const mnemonic = process.env.WALLET_MNEMONIC?.split(' ') || [];
  if (mnemonic.length === 0) {
    throw new Error('WALLET_MNEMONIC not set in environment variables');
  }
  const key = await mnemonicToWalletKey(mnemonic);
  
  // Create wallet contract instance
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  const walletContract = client.open(wallet);

  console.log('Deploying loyalty token contract...');
  
  // Read the compiled contract code
  const compiledContractPath = resolve(__dirname, '../contracts/loyalty.compiled');
  const contractData = JSON.parse(readFileSync(compiledContractPath, 'utf8'));
  
  if (contractData.status !== 'ok') {
    throw new Error(`Contract compilation failed: ${contractData.message}`);
  }
  
  // Decode the compiled BOC (Base64 encoded cell)
  const contractCode = Cell.fromBase64(contractData.codeBoc);

  // Prepare the initial data for the contract
  const initialData = beginCell()
    .storeCoins(toNano('0')) // total_supply starts at 0
    .endCell();

  // Create the StateInit object
  const stateInit: StateInit = {
    code: contractCode,
    data: initialData,
  };

  // Calculate the contract address
  const contractAddress = new Address(0, beginCell()
    .storeUint(0, 2)
    .storeDict(null)
    .storeRef(contractCode)
    .storeRef(initialData)
    .endCell()
    .hash());
  console.log('Contract will be deployed at address:', contractAddress.toString());

  // Send the deployment transaction
  const seqno = await walletContract.getSeqno();
  
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: contractAddress,
        value: toNano('0.05'), // 0.05 TON for gas
        body: beginCell().endCell(), // deployment body
        init: stateInit,
      }),
    ],
    sendMode: SendMode.PAY_GAS_SEPARATELY,
  });

  console.log('Deployment transaction sent. Waiting for confirmation...');
  
  // Wait a bit for the transaction to be processed
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  console.log('Contract deployed successfully!');
  console.log('Contract address:', contractAddress.toString());
}

// Run the deployment
deployLoyaltyContract().catch(console.error);