import { initSafeApiKit } from './init/safeApiKit';
import { createTx } from './tx/createTx';
import { proposeTx } from './tx/proposeTx';
 
/**
 * メインスクリプト
 */
const main = async() => {
  const {
    safeService,
    ethAdapter,
    safeSdkOwner1,
    safeAddress,
    safeSdk
  } = await initSafeApiKit();

  // create tx data
  const tx = await createTx(safeSdk);
  // proposetx
  await proposeTx(
    safeSdk,
    safeService, 
    safeAddress, 
    "0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072", 
    tx
  );
}

main();