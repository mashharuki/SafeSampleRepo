import React, { useCallback } from 'react'
// import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

/*
const Container = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
*/

/**
 * SafeAppコンポーネント
 * @returns 
 */
const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()

  const submitTx = useCallback(async () => {
    try {
      // トランザクションの送金
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: safe.safeAddress,
            value: '0',
            data: '0x',
          },
        ],
      })
      console.log({ safeTxHash })
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
      console.log({ safeTx })
    } catch (e) {
      console.error(e)
    }
  }, [safe, sdk])

  return (
    <div>
      <div>Safe: {safe.safeAddress}</div>

      <button
        onClick={submitTx}
      >
        Click to send a test transaction
      </button>
    </div>
  )
}

export default SafeApp
