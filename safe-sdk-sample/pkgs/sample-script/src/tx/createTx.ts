import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types';
import { ethers } from 'ethers';

/**
 * 送信用のトランザクションデータを作成するためのメソッド
 */
export const createTx = async(safeSdk: any,) => {
  
  // create tx data
  const safeTransactionData: SafeTransactionDataPartial = {
    to: '0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072',
    data: '0x',
    value: ethers.utils.parseUnits('0.0001', 'ether').toString(),
    // gasPrice: "500000",
  };

  const safeTransaction = await safeSdk.createTransaction({ safeTransactionData });

  return safeTransaction;
}