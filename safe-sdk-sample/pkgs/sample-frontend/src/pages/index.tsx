import ActionButton from "@/components/ActionButton";
import Address from "@/components/Address";
import Console from "@/components/Console";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Wallet } from "ethers";
import { useState } from "react";
import { createMintNftTx, createTx, initSafeApiKit, proposeTx } from './../hooks/safe';

/**
 * Home Component
 * @returns 
 */
export default function Home() {
  const [account, setAccount] = useState<any | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [senderAddress, setSenderAddress] = useState<Wallet | null>(null);
  const [safeSdk, setSafeSdk] = useState<any | null>(null);
  const [safeService, setSafeService] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<string[]>([
    `A sample application to demonstrate how to work Safe Contract.`,
  ]);

  /**
   * add Event method
   * @param newEvent 
   */
  const addEvent = (newEvent: string) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  /**
   * createSafeAccount method
   * @returns 
   */
  const createAccount = async () => {
    setLoading(true);

    // craete Safe Account
    try {
      const {
        safeService,
        safeAddress,
        safeSdk,
        senderAddress
      } = await initSafeApiKit();

      setAddress(safeAddress);
      setSafeSdk(safeSdk);
      setSafeService(safeService);
      setSenderAddress(senderAddress);
    } catch(err) {
      console.error("safeAccount作成中にエラーが発生",err)
    }

    setLoading(false);
  };

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
      // create tx data
      const tx = await createTx(safeSdk);
      // proposetx
      await proposeTx(
        safeSdk,
        safeService, 
        address, 
        await senderAddress?.getAddress(), 
        tx
      );

      const pendingTxs = (await safeService.getPendingTransactions(address)).results;

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
      const pendingTxs2 = (await safeService.getPendingTransactions(address)).results;
      const transaction2 = await safeService.getTransaction(pendingTxs2[0].safeTxHash);
      // execute traction
      const executeTxResponse = await safeSdk.executeTransaction(transaction2);
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
      // create tx data
      const tx = await createMintNftTx(safeSdk, address!);
      // proposetx
      await proposeTx(
        safeSdk,
        safeService, 
        address, 
        await senderAddress?.getAddress(), 
        tx
      );

      const pendingTxs = (await safeService.getPendingTransactions(address)).results;

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
      const pendingTxs2 = (await safeService.getPendingTransactions(address)).results;
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

  return (
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
                      {/* create Safe Account Button */}
                      <ActionButton
                        name={"Create Safe Account"}
                        description={"create safe Smart Contract"}
                        onClickFunction={async() => await createAccount()}
                      />
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
  );
}
