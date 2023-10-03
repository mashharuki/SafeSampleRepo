import { initSafeApiKit } from './init/safeApiKit';
import { createTx } from './tx/createTx';
import { proposeTx } from './tx/proposeTx';
 
/**
 * メインスクリプト
 */
const main = async() => {
  const {
    safeService,
    safeAddress,
    safeSdk
  } = await initSafeApiKit();

  // create tx data
  const tx = await createTx(safeSdk);
  // proposetx
  await proposeTx(
    safeSdk,
    safeService, 
    safeAddress, 
    "0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072", 
    tx
  );

  const pendingTxs = await safeService.getPendingTransactions(safeAddress);

  console.log("pendingTxs:", pendingTxs);
  const transaction = await safeService.getTransaction(pendingTxs.results[0].safeTxHash);
  const hash = transaction.safeTxHash
  // sign tx
  let signature = await safeSdk.signTransactionHash(hash)
  // confirmation
  await safeService.confirmTransaction(hash, signature.data)
  
  // check traction
  const isValidTx = await safeSdk.isValidTransaction(transaction);
  console.log("isValidTx:", isValidTx);

  // execute traction
  const executeTxResponse = await safeSdk.executeTransaction(transaction)
  const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())

  console.log("receipt:", receipt);
}

main();