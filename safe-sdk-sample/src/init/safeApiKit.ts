import SafeApiKit from '@safe-global/api-kit';
import { TX_SERVICE_URL } from '../utils/constants';
import { initProtocolKit } from './protocolKit';

/**
 * init SafeApiKit instance
 */
export const initSafeApiKit = async() => {
  const txServiceUrl = TX_SERVICE_URL;
  // create eth adapter instance
  const { 
    ethAdapterOwner: ethAdapter 
  } = await initProtocolKit();

  const safeService = new SafeApiKit({ 
    txServiceUrl, 
    ethAdapter 
  });

  console.log("safeService:", safeService);

  return safeService;
};