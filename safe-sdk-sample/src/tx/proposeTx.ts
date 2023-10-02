

/**
 * 送信用のトランザクションデータをpropseするためのメソッド
 */
export const proposeTx = async(
  safeSdk: any,
  safeService: any,
  safeAddress: any,
  senderAddress: any,
  safeTransaction: any
) => {
  const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
  const senderSignature = await safeSdk.signTransactionHash(safeTxHash);

  // call proposeTransaction method
  const result = await safeService.proposeTransaction({
    safeAddress,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress,
    senderSignature: senderSignature.data
  });

  console.log("proposeTransaction result:", result);

  return result;
};