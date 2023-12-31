import Safe, {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory
} from '@safe-global/protocol-kit';
import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import { RPC_URL } from '../utils/constants';

dotenv.config();

const {
  OWNER_1_PRIVATE_KEY,
  OWNER_2_PRIVATE_KEY,
  OWNER_3_PRIVATE_KEY
} = process.env;

// base Goerli RPC
const rpc_url = RPC_URL;
const provider = new ethers.providers.JsonRpcProvider(rpc_url);

/**
 * init ProtocolKit instance
 */
export const initProtocolKit = async() => {
  // Initialize signers
  const owner1Signer = new ethers.Wallet(OWNER_1_PRIVATE_KEY!, provider);
  const owner2Signer = new ethers.Wallet(OWNER_2_PRIVATE_KEY!, provider);
  const owner3Signer = new ethers.Wallet(OWNER_3_PRIVATE_KEY!, provider);

  // SafeAccount作成のための設定
  const safeAccountConfig: SafeAccountConfig = {
    owners: [
      //await owner1Signer.getAddress(),
      // await ownerSigner.getAddress()
      await owner3Signer.getAddress()
    ],
    threshold: 1,
  }

  // create EtherAdapter instance
  const ethAdapterOwner = new EthersAdapter({
    ethers,
    signerOrProvider: owner3Signer
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

  /*  */
  // deploy safe account
  const safeSdkOwner1 = await safeFactory.deploySafe({ 
    safeAccountConfig,
    options: {
      gasLimit: 5000000
    }
  });
  console.log("safeSdkOwner1:", safeSdkOwner1);

  // get safe address
  const safeAddress = await safeSdkOwner1.getAddress();
  console.log("safeAddress:", safeAddress);

  

  // すでにsafeのスマートコントラクトウォレットアドレスを取得していればそれでインスタンスを作成
  // const safeAddress = "0xF1E16286756D0928A5C3EAff4316C396CB8dA885";
  const safeSdk = await Safe.create({ 
    ethAdapter: ethAdapterOwner, 
    safeAddress: safeAddress
  });

  console.log("safeSdk:", safeSdk);
  const balance = await provider.getBalance(safeAddress);
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