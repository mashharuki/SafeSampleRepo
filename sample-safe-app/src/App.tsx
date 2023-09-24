import React from 'react'
// import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { useSafeBalances } from './hooks/useSafeBalances';
import BalancesTable from './components/BalancesTable';
import { getTransferTransaction } from './api/transfers';

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
  const { sdk, safe } = useSafeAppsSDK();
  const [balances] = useSafeBalances(sdk);
  const [recipient, setRecipient] = React.useState('');

  console.log({ balances });

  /**
   * handleTransfer method
   */
  const handleTransfer = async (): Promise<void> => {
    const transactions = balances.map((balance) => getTransferTransaction(balance, recipient));

    // トランザクションを一括送信
    const { safeTxHash } = await sdk.txs.send({ 
      txs: transactions 
    });

    console.log({ safeTxHash });
    
    const tx = await sdk.txs.getBySafeTxHash(safeTxHash);
    console.log({ tx });
  };

  return (
    <div>
      <div>Safe: {safe.safeAddress}</div>
      <BalancesTable balances={balances} />

      <textarea
        onChange={(e) => {
          setRecipient(e.target.value);
        }}
        value={recipient}
      />

      <button
        color="primary" 
        onClick={handleTransfer}
      >
        Send the assets
      </button>
    </div>
  )
}

export default SafeApp
