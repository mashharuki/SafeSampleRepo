### 動かし方

- インストール

  ```bash
  yarn
  ```

- サンプルスクリプトの実施

  ```bash
  yarn start
  ```

  [Create Proxy with nonce の履歴](https://goerli.basescan.org/tx/0xe989a500866ff018e0a80d17b3f5fc1aeaf639f7d726569e3e546ceac34e730f#eventlog)

  ```bash
  ethAdapterOwner: EthersAdapter {}
  safeSdkOwner1: Safe {}
  safeAddress: 0xA397CDf56C24d356A6F1f4094FbD029F79844716
  safeSdk: Safe {}
  safeService: SafeApiKit {}
  safeAddress's nonce: 0
  proposeTransaction result: undefined
  pendingTxs: {
  count: 1,
  next: null,
  previous: null,
  results:
    [
      {
        safe: '0xF1E16286756D0928A5C3EAff4316C396CB8dA885',
        to: '0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072',
        value: '1000000000000000',
        data: null,
        operation: 0,
        gasToken: '0x0000000000000000000000000000000000000000',
        safeTxGas: 9665,
        baseGas: 0,
        gasPrice: '300000',
        refundReceiver: '0x0000000000000000000000000000000000000000',
        nonce: 0,
        executionDate: null,
        submissionDate: '2023-10-03T11:03:55.212665Z',
        modified: '2023-10-03T11:03:55.254550Z',
        blockNumber: null,
        transactionHash: null,
        safeTxHash: '0x3eaf1027c328adea606c434bf46712fb394266b23c3bdccb5cae39204c23d1ef',
        executor: null,
        isExecuted: false,
        isSuccessful: null,
        ethGasPrice: null,
        maxFeePerGas: null,
        maxPriorityFeePerGas: null,
        gasUsed: null,
        fee: null,
        origin: '{}',
        dataDecoded: null,
        confirmationsRequired: 1,
        confirmations: [Array],
        trusted: true,
        signatures: null
      }
    ]
    countUniqueNonce: 1
  ✨  Done in 37.08s.
  ```
