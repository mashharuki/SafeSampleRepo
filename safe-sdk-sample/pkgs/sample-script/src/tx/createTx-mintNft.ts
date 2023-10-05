import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types';
import * as ethers from 'ethers';
import { abi } from './../../../sample-nft/artifacts/contracts/MyNFT.sol/MyNFT.json';


// コントラクト用のインスタンスを作成
const contract = new ethers.utils.Interface(abi);


/**
 * NFT発行用のトランザクションデータを作成するためのメソッド
 */
export const createMintNftTx = async(
  safeSdk: any, 
  safeAddress:string
) => {

  // エンコードデータを作成
  const data = contract.encodeFunctionData("mint", [safeAddress])
  
  // create tx data
  const safeTransactionData: SafeTransactionDataPartial = {
    to: '0x599c542e6FF0e009D929091e948d2BA510136741' , // NFTコントラクトのアドレス
    data: data,
    value: ethers.utils.parseUnits('0', 'ether').toString(),
    // gasPrice: "500000",
  };

  const safeTransaction = await safeSdk.createTransaction({ safeTransactionData });

  return safeTransaction;
}