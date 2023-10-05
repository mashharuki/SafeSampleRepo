import { initSafeApiKit } from './init/safeApiKit';
import { createMintNftTx } from './tx/createTx-mintNft';
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
  const tx = await createMintNftTx(safeSdk, safeAddress);
  // proposetx
  await proposeTx(
    safeSdk,
    safeService, 
    safeAddress, 
    "0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072", 
    tx
  );

  const pendingTxs = (await safeService.getPendingTransactions(safeAddress)).results;

  console.log("pendingTxs:", pendingTxs);
  const transaction = await safeService.getTransaction(pendingTxs[0].safeTxHash);
  const hash = transaction.safeTxHash
  // sign tx
  let signature = await safeSdk.signTransactionHash(hash)
  // confirmation
  await safeService.confirmTransaction(hash, signature.data)
  
  // check traction
  const isValidTx = await safeSdk.isValidTransaction(transaction);
  console.log("isValidTx:", isValidTx);

  // get transaction again
  const pendingTxs2 = (await safeService.getPendingTransactions(safeAddress)).results;
  const transaction2 = await safeService.getTransaction(pendingTxs2[0].safeTxHash);
  // execute traction
  const executeTxResponse = await safeSdk.executeTransaction(transaction2, {
    from:"0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072"
  });
  console.log("executeTxResponse:", executeTxResponse );

  const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
  console.log('Transaction executed:')
  console.log(`https://goerli.basescan.org/tx/${receipt!.transactionHash}`)
}

main();