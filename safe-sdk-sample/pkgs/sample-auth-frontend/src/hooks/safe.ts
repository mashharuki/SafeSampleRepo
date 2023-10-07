import SafeApiKit from '@safe-global/api-kit';
import Safe, {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
} from '@safe-global/protocol-kit';
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types';
import { ethers } from 'ethers';
import { NFT_ADDRESS, RPC_URL, TX_SERVICE_URL } from '../utils/constants';
import { abi } from './../../../sample-nft/artifacts/contracts/MyNFT.sol/MyNFT.json';

// base Goerli RPC
const rpc_url = RPC_URL;
const provider = new ethers.providers.JsonRpcProvider(rpc_url);

// コントラクト用のインスタンスを作成
const contract = new ethers.utils.Interface(abi);

/**
 * init ProtocolKit instance
 */
export const initProtocolKit = async() => {
  // Initialize signers
  // ここはWeb3authかlitで持ってくる。
  const owner1Signer = new ethers.Wallet(process.env.NEXT_PUBLIC_OWNER_1_PRIVATE_KEY!, provider);
  const owner2Signer = new ethers.Wallet(process.env.NEXT_PUBLIC_OWNER_2_PRIVATE_KEY!, provider);
  const owner3Signer = new ethers.Wallet(process.env.NEXT_PUBLIC_OWNER_3_PRIVATE_KEY!, provider);

  // SafeAccount作成のための設定
  const safeAccountConfig: SafeAccountConfig = {
    owners: [
      await owner1Signer.getAddress(),
      await owner2Signer.getAddress(),
      await owner3Signer.getAddress()
    ],
    threshold: 1,
  }

  // create EtherAdapter instance
  const ethAdapterOwner = new EthersAdapter({
    ethers,
    signerOrProvider: owner1Signer
  });

  console.log("ethAdapterOwner:", ethAdapterOwner);

  const safeVersion = '1.3.0'

  // create factory instance
  const safeFactory = await SafeFactory.create({ 
    ethAdapter: ethAdapterOwner, 
    //safeVersion: safeVersion,
    //isL1SafeMasterCopy: false
  });

  const version = await safeFactory.getSafeVersion();
  console.log("version:", version);
  
  const chainId = await safeFactory.getChainId();
  console.log("chainId:", chainId);

  const safeFactoryAddr = safeFactory.getAddress();
  console.log("safeFactoryAddr:", safeFactoryAddr);

  const predictSafeAddress = await safeFactory.predictSafeAddress(safeAccountConfig);
  console.log("predictSafeAddress:", predictSafeAddress);

  // TODO 別のコントラクトで作成したsafeコントラクトアドレスとユーザーのアドレスを紐付けてチェックする機能が必要そう。
  const txServiceUrl = TX_SERVICE_URL;
  const safeService = new SafeApiKit({ 
    txServiceUrl, 
    ethAdapter: ethAdapterOwner
  });

  // 生成済みのsafeAccounts一覧を取得するメソッド
  const safes = await safeService.getSafesByOwner(await owner1Signer.getAddress());
  console.log("safes:", safes.safes);

  var safeSdkOwner1;
  var safeAddress;

  // 一つも生成されていない場合には新規で作成それ以外の場合は作成ずみのSafeAccoutをアドレスとして詰める。
  if(safes.safes.length == 0) {
    // deploy safe account
    safeSdkOwner1 = await safeFactory.deploySafe({ 
      safeAccountConfig,
      options: {
        gasLimit: 5000000
      }
    });
    console.log("safeSdkOwner1:", safeSdkOwner1);

    // get safe address
    const safeAddress = await safeSdkOwner1.getAddress();
    console.log("safeAddress:", safeAddress);
  } else {
    // すでにsafeのスマートコントラクトウォレットアドレスを取得していればそれでインスタンスを作成
    safeAddress = safes.safes[4]
  }

  // Safeのインスタンスを作成
  const safeSdk = await Safe.create({ 
    ethAdapter: ethAdapterOwner, 
    safeAddress: safeAddress!
  });

  console.log("safeSdk:", safeSdk);
  const balance = await provider.getBalance(safeAddress!);
  // get safe's balance
  console.log("Safe's balance:", parseInt(balance._hex.toString(), 16));
  console.log(`https://app.safe.global/gor:${safeAddress}`);

  return {
    ethAdapterOwner,
    safeAddress,
    safeSdk,
    senderAddress: owner1Signer
  };
};

/**
 * init SafeApiKit instance
 */
export const initSafeApiKit = async() => {
  const txServiceUrl = TX_SERVICE_URL;
  // create eth adapter instance
  const { 
    ethAdapterOwner: ethAdapter,
    safeAddress,
    safeSdk,
    senderAddress
  } = await initProtocolKit();

  const safeService = new SafeApiKit({ 
    txServiceUrl, 
    ethAdapter 
  });

  console.log("safeService:", safeService);

  const nonce = await safeService.getNextNonce(safeAddress!);
  console.log("safeAddress's nonce:", nonce);

  return {
    safeService,
    ethAdapter,
    safeAddress,
    safeSdk,
    senderAddress
  };
};

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

  // この時点で proxy Contractが作られる。

  return result;
};

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
    to: NFT_ADDRESS , // NFTコントラクトのアドレス
    data: data,
    value: ethers.utils.parseUnits('0', 'ether').toString(),
    // gasPrice: "500000",
  };

  const safeTransaction = await safeSdk.createTransaction({ safeTransactionData });

  return safeTransaction;
}