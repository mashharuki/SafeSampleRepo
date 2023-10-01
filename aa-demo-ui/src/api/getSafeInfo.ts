import axios, { RawAxiosRequestConfig } from 'axios'
import { utils } from 'ethers'

import getChain from 'src/utils/getChain'

export type SafeInfoType = {
  address: string
  nonce: number
  threshold: number
  owners: string[]
}

/**
 * getSafeInfo method
 * @param safeAddress 
 * @param connectedChainId 
 * @param options 
 * @returns 
 */
const getSafeInfo = async (
  safeAddress: string,
  connectedChainId: string,
  options?: RawAxiosRequestConfig
): Promise<SafeInfoType> => {
  const chain = getChain(connectedChainId)

  const address = utils.getAddress(safeAddress)

  // Mumbai has no transaction service because it is not part of our official UI https://app.safe.global/
  if (!chain?.transactionServiceUrl) {
    throw new Error(`No transaction service for ${chain?.label} chain`)
  }

  // API用のURL取得する。
  const url = `${chain?.transactionServiceUrl}/api/v1/safes/${address}/`

  const { data: safeInfo } = await axios.get(url, options)

  return safeInfo
}

export default getSafeInfo
