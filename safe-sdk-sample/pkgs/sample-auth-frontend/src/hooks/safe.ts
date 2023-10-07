import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types';
import { ethers } from 'ethers';
import { NFT_ADDRESS, RPC_URL } from '../utils/constants';
import { abi } from './../../../sample-nft/artifacts/contracts/MyNFT.sol/MyNFT.json';

// base Goerli RPC
const rpc_url = RPC_URL;
const provider = new ethers.providers.JsonRpcProvider(rpc_url);

// コントラクト用のインスタンスを作成
const contract = new ethers.utils.Interface(abi);

/**
 * 送信用のトランザクションデータを作成するためのメソッド
 */
export const createTx = async(safeSdk: any,) => {
  
  // create tx data
  const safeTransactionData: MetaTransactionData = {
    to: '0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072',
    data: '0x',
    value: ethers.utils.parseUnits('0.0001', 'ether').toString(),
    operation: OperationType.Call
  };

  const safeTransaction = await safeSdk.createTransaction({ safeTransactionData });
  // トランザクションを署名
  const signedSafeTx = await safeSdk.signTransaction(safeTransaction)
  
  return signedSafeTx;
}

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
  const safeTransactionData: MetaTransactionData = {
    to: NFT_ADDRESS , // NFTコントラクトのアドレス
    data: data,
    value: ethers.utils.parseUnits('0', 'ether').toString(),
    operation: OperationType.Call
  };

  const safeTransaction = await safeSdk.createTransaction({ safeTransactionData });
  // トランザクションを署名
  const signedSafeTx = await safeSdk.signTransaction(safeTransaction)

  return signedSafeTx;
}