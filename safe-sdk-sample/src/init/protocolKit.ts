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
  OWNER_2_PRIVATE_KEY
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

  // SafeAccount作成のための設定
  const safeAccountConfig: SafeAccountConfig = {
    owners: [
      await owner1Signer.getAddress(),
      await owner2Signer.getAddress()
    ],
    threshold: 2,
    // ... (Optional params)
  }

  // create EtherAdapter instance
  const ethAdapterOwner = new EthersAdapter({
    ethers,
    signerOrProvider: owner1Signer
  });

  console.log("ethAdapterOwner:", ethAdapterOwner);

  // create factory instance
  const safeFactory = await SafeFactory.create({ 
    ethAdapter: ethAdapterOwner, 
    isL1SafeMasterCopy: true
  });

  // deploy safe account
  const safeSdkOwner1 = await safeFactory.deploySafe({ 
    safeAccountConfig 
  });
  console.log("safeSdkOwner1:", safeSdkOwner1);

  // get safe address
  const safeAddress = await safeSdkOwner1.getAddress();
  console.log("safeAddress:", safeAddress);

  const safeSdk = await Safe.create({ 
    ethAdapter: ethAdapterOwner, 
    safeAddress: safeAddress 
  });

  console.log("safeSdk:", safeSdk);

  return {
    ethAdapterOwner,
    safeSdkOwner1,
    safeAddress,
    safeSdk
  };
};