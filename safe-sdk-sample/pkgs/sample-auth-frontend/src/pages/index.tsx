import ActionButton from "@/components/ActionButton";
import Address from "@/components/Address";
import Console from "@/components/Console";
import Header from "@/components/Header";
import LoadingIndicator from "@/components/LoadingIndicator";
import { RPC_URL, TX_SERVICE_URL } from "@/utils/constants";
import SafeApiKit from '@safe-global/api-kit';
import { Web3AuthConfig, Web3AuthModalPack } from '@safe-global/auth-kit';
import Safe, {
  EthersAdapter,
  SafeFactory,
} from '@safe-global/protocol-kit';
import {
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  UserInfo,
  WALLET_ADAPTERS
} from '@web3auth/base';
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { createMintNftTx, createTx, proposeTx } from './../hooks/safe';
import { CHAIN_ID } from './../utils/constants';


/**
 * Home Component
 * @returns 
 */
export default function Home() {
  const [account, setAccount] = useState<any | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [senderAddress, setSenderAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<string[]>([
    `A sample application to demonstrate how to work Safe Contract.`,
  ]);
  const [web3AuthModalPack, setWeb3AuthModalPack] = useState<Web3AuthModalPack>()
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>()
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null)
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState<any | null>(
    null
  )

  /**
   * add Event method
   * @param newEvent 
   */
  const addEvent = (newEvent: string) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  /**
   * login method
   */
  const login = async() => {
    const authKitSignData = await web3AuthModalPack?.signIn();
    var eoa = authKitSignData?.eoa!;
    var safeAddress = authKitSignData?.safes![0];

    console.log('SIGN IN RESPONSE: ', authKitSignData);
    console.log('safeAddress: ', safeAddress);
    console.log('eoa: ', eoa);

    setLoading(true);
    // if user don't have any safeAccount , create here
    if(safeAddress == undefined || safeAddress == null){ 
      // create safeSDK instance
      const provider = new ethers.providers.Web3Provider(web3AuthModalPack?.getProvider()!);
      var signer = provider.getSigner();

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
      safeAddress = await safeSdkOwner1.getAddress();
    }
    setLoading(false);

    const userInfo = await web3AuthModalPack!.getUserInfo();
    console.log('USER INFO: ', userInfo)

    setSafeAuthSignInResponse(authKitSignData)
    setUserInfo(userInfo || undefined)
    setProvider(web3AuthModalPack?.getProvider() as SafeEventEmitterProvider)
    setAddress(safeAddress!)
    setSenderAddress(eoa);
  }

  /**
   * logout method
   */
  const logout = async() => {
    await web3AuthModalPack?.signOut();
    setProvider(null)
    setSafeAuthSignInResponse(null)
    setAddress(null)
    setSenderAddress(null)
  }

  /**
   * sendTransaction method
   * @param recipient 
   * @param amount 
   */
  const sendTransaction = async (recipient: string, amount: string) => {
    setEvents([]);

    //setLoading(true);
    addEvent("Sending transaction...");
    
    // send ETH 
    try {
      // create safeSDK instance
      const provider = new ethers.providers.Web3Provider(web3AuthModalPack?.getProvider()!);
      var signer = provider.getSigner()

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer || provider
      })

      const safeSdk = await Safe.create({
        ethAdapter,
        safeAddress: address!
      })
      const safeService = new SafeApiKit({ 
        txServiceUrl: TX_SERVICE_URL, 
        ethAdapter 
      });

      // create tx data
      const tx = await createTx(safeSdk);
      // proposetx
      await proposeTx(
        safeSdk,
        safeService, 
        address, 
        senderAddress, 
        tx
      );

      const pendingTxs = (await safeService.getPendingTransactions(address!)).results;

      addEvent(`pendingTxs:${JSON.stringify(pendingTxs)}`);
      const transaction = await safeService.getTransaction(pendingTxs[0].safeTxHash);
      const hash = transaction.safeTxHash
      // sign tx
      let signature = await safeSdk.signTransactionHash(hash)
      // confirmation
      await safeService.confirmTransaction(hash, signature.data)
      
      // check traction
      const isValidTx = await safeSdk.isValidTransaction(transaction);
      addEvent(`isValidTx:${isValidTx}`);

      // get transaction again
      const pendingTxs2 = (await safeService.getPendingTransactions(address!)).results;
      const transaction2 = await safeService.getTransaction(pendingTxs2[0].safeTxHash);
      // execute traction
      const executeTxResponse = await safeSdk.executeTransaction(transaction2, {
        gasPrice: 5000000
      });
      addEvent(`executeTxResponse:${JSON.stringify(executeTxResponse)}`);

      const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
      addEvent('Transaction executed:')
      addEvent(`https://goerli.basescan.org/tx/${receipt!.transactionHash}`)
      //setLoading(false);
    } catch(err) {
      console.error("ETH送金中にエラーが発生",err)
      //setLoading(false);
    }
  };

  /**
   * mintNft Button
   */
  const mintNft = async (recipient: string) => {
    setEvents([]);
    
    //setLoading(true);
    addEvent("mint NFT transaction...");

    try {
      // create safeSDK instance
      const provider = new ethers.providers.Web3Provider(web3AuthModalPack?.getProvider()!);
      var signer = provider.getSigner()

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer || provider
      })

      const safeSdk = await Safe.create({
        ethAdapter,
        safeAddress: address!
      })
      const safeService = new SafeApiKit({ 
        txServiceUrl: TX_SERVICE_URL, 
        ethAdapter 
      });

      // create tx data
      const tx = await createMintNftTx(safeSdk, address!);
      // proposetx
      await proposeTx(
        safeSdk,
        safeService, 
        address, 
        senderAddress, 
        tx
      );

      const pendingTxs = (await safeService.getPendingTransactions(address!)).results;

      addEvent(`pendingTxs:${JSON.stringify(pendingTxs)}`);
      const transaction = await safeService.getTransaction(pendingTxs[0].safeTxHash);
      const hash = transaction.safeTxHash
      // sign tx
      let signature = await safeSdk.signTransactionHash(hash)
      // confirmation
      await safeService.confirmTransaction(hash, signature.data)
      
      // check traction
      const isValidTx = await safeSdk.isValidTransaction(transaction);
      addEvent(`isValidTx:${isValidTx}`);

      // get transaction again
      const pendingTxs2 = (await safeService.getPendingTransactions(address!)).results;
      const transaction2 = await safeService.getTransaction(pendingTxs2[0].safeTxHash);
      // execute traction
      const executeTxResponse = await safeSdk.executeTransaction(transaction2);
      addEvent(`executeTxResponse:${JSON.stringify(executeTxResponse)}`);

      const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
      addEvent('Transaction executed:')
      addEvent(`https://goerli.basescan.org/tx/${receipt!.transactionHash}`)
    } catch(err) {
      console.error("NFTミント中にエラーが発生",err)
    }

    //setLoading(false);
  }

  /**
   * 副作用フック
   */
  useEffect(() => {
    const init = async() => {
      // Web3Auth Config
      const options: Web3AuthOptions = {
        clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID!, 
        web3AuthNetwork: 'testnet',
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: CHAIN_ID,
          rpcTarget: RPC_URL
        },
        uiConfig: {
          theme: 'dark',
          loginMethodsOrder: ['google', 'facebook']
        }
      }

      // Web3 Modal Config
      const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
          label: 'torus',
          showOnModal: false
        },
        [WALLET_ADAPTERS.METAMASK]: {
          label: 'metamask',
          showOnDesktop: true,
          showOnMobile: false
        }
      }

      // login Adapter Config
      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: 'mandatory'
        },
        adapterSettings: {
          uxMode: 'popup',
          whiteLabel: {
            name: 'Sample Safe Core SDK & Auth Kit Dapp' 
          }
        }
      })

      const web3AuthConfig: Web3AuthConfig = {
        txServiceUrl: TX_SERVICE_URL
      }

      // Instantiate and initialize the pack
      const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);
      await web3AuthModalPack.init({ 
        options, 
        adapters: [openloginAdapter], 
        modalConfig 
      });

      setWeb3AuthModalPack(web3AuthModalPack);
    };
    init();
  }, [])

  return (
    <>
      <Header login={login} logout={logout} isLoggedIn={!!provider}/>
      <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <div></div>
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <div className="space-y-4">
              <div className="flex justify-end space-x-4">
                <Address address={address} />
              </div>
              <div>
                <div className="grid grid-cols-3 grid-rows-2 gap-4">
                  { loading ? 
                    <LoadingIndicator/>
                  : (
                    <>
                      <div className="col-span-1 row-span-2">
                        {/* send Button */}
                        <ActionButton
                          name={"Send ETH"}
                          description={"Simple transfer of 0.0005 ETH to an arbitrary address with gas sponsored."}
                          onClickFunction={async() =>
                            await sendTransaction(
                              "0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072",
                              "0.0005"
                            )}
                        />
                        {/* mint NFT Button */}
                        <ActionButton
                          name={"Mint NFT"}
                          description={"mint NFT to contract Wallet"}
                          onClickFunction={async() => await mintNft(account)}
                        />
                      </div>
                      <Console events={events} />
                    </>
                  ) }
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}