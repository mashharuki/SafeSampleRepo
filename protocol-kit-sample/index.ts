import { ethers } from 'ethers'
import { 
  EthersAdapter, 
  SafeFactory,
  SafeAccountConfig
} from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'

// https://chainlist.org/?search=goerli&testnets=true
const RPC_URL='https://eth-goerli.public.blastapi.io';
const txServiceUrl = 'https://safe-transaction-goerli.safe.global'

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Initialize signers
const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY!, provider)
const owner3Signer = new ethers.Wallet(process.env.OWNER_3_PRIVATE_KEY!, provider)

// SafeAccount作成のための設定
const safeAccountConfig: SafeAccountConfig = {
  owners: [
    await owner1Signer.getAddress(),
    await owner2Signer.getAddress(),
    await owner3Signer.getAddress()
  ],
  threshold: 2,
  // ... (Optional params)
}

// create EtherAdapter instance
const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signerOrProvider: owner1Signer
})

// create SafeApiKit instance
const safeService = new SafeApiKit({ 
  txServiceUrl, 
  ethAdapter: ethAdapterOwner1 
});

// craete factory instace
const safeFactory = await SafeFactory.create({ 
  ethAdapter: ethAdapterOwner1 
})

// deploy SafeAccount
const safeSdkOwner1 = await safeFactory.deploySafe({ 
  safeAccountConfig 
})

const safeAddress = await safeSdkOwner1.getAddress()

console.log('Your Safe has been deployed:')
console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
console.log(`https://app.safe.global/gor:${safeAddress}`)


const safeAmount = ethers.utils.parseUnits('0.001', 'ether').toHexString()
// create tx data
const transactionParameters = {
  to: safeAddress,
  value: safeAmount
}
// send Transaction
const tx = await owner1Signer.sendTransaction(transactionParameters)

console.log('Fundraising.')
console.log(`Deposit Transaction: https://goerli.etherscan.io/tx/${tx.hash}`)

const destination = '0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072'
const amount = ethers.utils.parseUnits('0.001', 'ether').toString()

// create Safe Tx data
const safeTransactionData: SafeTransactionDataPartial = {
  to: destination,
  data: '0x',
  value: amount
}
// Create a Safe transaction with the provided parameters
const safeTransaction = await safeSdkOwner1.createTransaction({ 
  safeTransactionData 
})
// get Transaction Hash
const safeTxHash = await safeSdkOwner1.getTransactionHash(safeTransaction)

// Sign transaction to verify that the transaction is coming from owner 1
const senderSignature = await safeSdkOwner1.signTransactionHash(safeTxHash)

// send Tx
await safeService.proposeTransaction({
  safeAddress,
  safeTransactionData: safeTransaction.data,
  safeTxHash,
  senderAddress: await owner1Signer.getAddress(),
  senderSignature: senderSignature.data,
})

const results: any = await safeService.getPendingTransactions(safeAddress)
const pendingTransactions = results.results
const transaction = pendingTransactions[0]
const safeTxHash2 = transaction.safeTxHash

const ethAdapterOwner2 = new EthersAdapter({
  ethers,
  signerOrProvider: owner2Signer
})

const safeFactory2 = await SafeFactory.create({ 
  ethAdapter: ethAdapterOwner2
})

// deploy SafeAccount
const safeSdkOwner2 = await safeFactory2.deploySafe({ 
  safeAccountConfig 
})

const signature: any = await safeSdkOwner2.signTransactionHash(safeTxHash)
const response = await safeService.confirmTransaction(safeTxHash, signature.data)

const executeTxResponse = await safeSdkOwner2.executeTransaction(transaction, signature.data)
const receipt = await executeTxResponse.transactionResponse?.wait()

console.log('Transaction executed:')
console.log(`https://goerli.etherscan.io/tx/${receipt!.transactionHash}`);

// get balance
const afterBalance = await provider.getBalance(safeAddress);

console.log(`The final balance of the Safe: ${ethers.utils.formatUnits(afterBalance, 'ether')} ETH`)