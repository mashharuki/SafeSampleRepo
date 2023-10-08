import Safe, {
  EthersAdapter,
  SafeFactory,
  getSafeContract
} from '@safe-global/protocol-kit';
import { GelatoRelayPack } from '@safe-global/relay-kit';
import { MetaTransactionData, MetaTransactionOptions, OperationType, RelayTransaction } from '@safe-global/safe-core-sdk-types';
import { ethers } from 'ethers';
import { NFT_ADDRESS } from '../utils/constants';
import { abi } from './../../../sample-nft/artifacts/contracts/MyNFT.sol/MyNFT.json';

// コントラクト用のインスタンスを作成
const contract = new ethers.utils.Interface(abi);

/**
 * 新たにSafeを作成するメソッド
 */
export const createSafe = async(
  signer:any, 
  provider:any,
  eoa: string,
) => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer || provider
  });

  // create factory instance
  const safeFactory = await SafeFactory.create({ 
    ethAdapter: ethAdapter, 
  });
  // craete new safe Account
  const safeSdkOwner1 = await safeFactory.deploySafe({
    safeAccountConfig: {
      owners: [ 
        eoa
      ],
      threshold: 1,
    },
    options: {
      gasLimit: 5000000
    }
  });
  // get safe address
  var safeAddress = await safeSdkOwner1.getAddress();

  return safeAddress;
}

/**
 * 送信用のトランザクションデータを作成するためのメソッド
 */
const createSendTx = async(
  safeSdk: any,
  toAdderss: string, 
  amount: string
) => {
  
  // create tx data
  const safeTransactionData: MetaTransactionData = {
    to: toAdderss,
    data: '0x',
    value: ethers.utils.parseUnits(amount, 'ether').toString(),
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
const createMintNftTx = async(
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

/**
 * ネイティブトークンを送金するメソッド
 */
export const sendEthTx = async(
  signer:any, 
  provider:any,
  safeAddress: any,
  recipient: string, 
  amount: string
) => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer || provider
  })

  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress: safeAddress
  })

  // create tx data
  const signedSafeTx = await createSendTx(safeSdk, recipient, amount);
  // GelatoRelayPack型のインスタンスを生成
  const relayKit = new GelatoRelayPack(process.env.NEXT_PUBLIC_GELATO_RELAY_API_KEY);

  // safe Contractを取得
  const safeSingletonContract = await getSafeContract({ 
    ethAdapter, 
    safeVersion: await safeSdk.getContractVersion() 
  })

  // トランザクションを実行するためのデータを絵コード
  const encodedTx = safeSingletonContract.encode('execTransaction', [
    signedSafeTx.data.to,
    signedSafeTx.data.value,
    signedSafeTx.data.data,
    signedSafeTx.data.operation,
    signedSafeTx.data.safeTxGas,
    signedSafeTx.data.baseGas,
    signedSafeTx.data.gasPrice,
    signedSafeTx.data.gasToken,
    signedSafeTx.data.refundReceiver,
    signedSafeTx.encodedSignatures()
  ])
  
  const options: MetaTransactionOptions = {
    gasLimit: '100000',
    isSponsored: true
  }

  // lelayを介したトランザクション実行用のデータを生成
  const relayTransaction: RelayTransaction = {
    target: safeAddress,
    encodedTransaction: encodedTx,
    chainId: 5,
    options
  };
  
  // トランザクションを実行
  const response = await relayKit.relayTransaction(relayTransaction);

  return response;
};

/**
 * NFTをミントするメソッド
 */
export const mintNftTx = async(
  signer:any, 
  provider:any,
  safeAddress: any,
) => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer || provider
  })

  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress: safeAddress
  })

  // create tx data
  const signedSafeTx = await createMintNftTx(safeSdk, safeAddress);
  // GelatoRelayPack型のインスタンスを生成
  const relayKit = new GelatoRelayPack(process.env.NEXT_PUBLIC_GELATO_RELAY_API_KEY);

  // safe Contractを取得
  const safeSingletonContract = await getSafeContract({ 
    ethAdapter, 
    safeVersion: await safeSdk.getContractVersion() 
  })

  // トランザクションを実行するためのデータを絵コード
  const encodedTx = safeSingletonContract.encode('execTransaction', [
    signedSafeTx.data.to,
    signedSafeTx.data.value,
    signedSafeTx.data.data,
    signedSafeTx.data.operation,
    signedSafeTx.data.safeTxGas,
    signedSafeTx.data.baseGas,
    signedSafeTx.data.gasPrice,
    signedSafeTx.data.gasToken,
    signedSafeTx.data.refundReceiver,
    signedSafeTx.encodedSignatures()
  ])
  
  const options: MetaTransactionOptions = {
    gasLimit: '100000',
    isSponsored: true
  }

  // lelayを介したトランザクション実行用のデータを生成
  const relayTransaction: RelayTransaction = {
    target: safeAddress,
    encodedTransaction: encodedTx,
    chainId: 5,
    options
  };
  
  // トランザクションを実行
  const response = await relayKit.relayTransaction(relayTransaction);

  return response;
};