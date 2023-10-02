# SafeSampleRepo

SafeProtocol を学習するためのリポジトリです。

## Safe とは

Safe（セイフ）は、多数のブロックチェーンで実行されるスマートコントラクトウォレットで、トランザクションの発生前にトランザクションを最小限の人数（M-of-N）で承認する必要があります。例えば、ビジネスに主要な利害関係者 3 人いる場合、トランザクションの送信前に 3 人中 2 人（2/3）または 3 人全員からの承認を要求するようにウォレットを設定できます。これにより、誰一人として資金を危険に晒すことができないことが保証されます。

## 動かし方

- インストール

  ```bash
  cd aa-demo-ui && yarn
  cd safe-core-protocol-demo && yarn
  ```

- 起動(aa-demo-ui の方)

  ```bash
  yarn start
  ```

  デモの中で実際に生成した SafeAccount
  [0xe97583cDdF80aac5d7c4af996d7B73Ae3e4E3f13](https://mumbai.polygonscan.com/address/0xe97583cDdF80aac5d7c4af996d7B73Ae3e4E3f13)  
  [0x0268349cF927B050dD5aE919C11C139637aE2a24](https://mumbai.polygonscan.com/address/0x0268349cF927B050dD5aE919C11C139637aE2a24)

### relay-kit 用のサンプルコード

- インストール

  ```bash
  cd relay-sample && yarn
  ```

- ガスレス+AA によるトランザクション実行(Gelato を利用)

  ```bash
  yarn execute:sample
  ```

  実際に使用した Safe のウォレット(Base Goerli)  
  [0x244Bc53858760844C4C2b616B29E36Eeb2cb321a](https://goerli.basescan.org/address/0x244Bc53858760844C4C2b616B29E36Eeb2cb321a)

  実行結果

  ```bash
  Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/0xd39456ca81086f9c936b3fc5d2a34b29e63dfa75aef66b9f0253aa7eec3089a3
  ✨  Done in 19.64s.
  ```

  ```json
  {
    "task": {
      "chainId": 84531,
      "taskId": "0xd39456ca81086f9c936b3fc5d2a34b29e63dfa75aef66b9f0253aa7eec3089a3",
      "taskState": "ExecSuccess",
      "creationDate": "2023-09-29T10:30:15.614Z",
      "executionDate": "2023-09-29T10:30:31.693Z",
      "transactionHash": "0x76ca2d6e1a340903953fd99b95af8b3c6aa82e55d8588b4f407311ce52757282",
      "blockNumber": 10394902
    }
  }
  ```

  実際に transfer されたトランザクションの記録(Goerli Testnet)

  [0x76ca2d6e1a340903953fd99b95af8b3c6aa82e55d8588b4f407311ce52757282](https://goerli.basescan.org/tx/0x76ca2d6e1a340903953fd99b95af8b3c6aa82e55d8588b4f407311ce52757282)

### 任意のネットワークに対応させるためにはいくつかコントラクトをデプロイする必要あり

```ts
import { ContractNetworksConfig } from "@safe-global/protocol-kit";

const chainId = await ethAdapter.getChainId();
const contractNetworks: ContractNetworksConfig = {
  [chainId]: {
    safeMasterCopyAddress: "<MASTER_COPY_ADDRESS>",
    safeProxyFactoryAddress: "<PROXY_FACTORY_ADDRESS>",
    multiSendAddress: "<MULTI_SEND_ADDRESS>",
    multiSendCallOnlyAddress: "<MULTI_SEND_CALL_ONLY_ADDRESS>",
    fallbackHandlerAddress: "<FALLBACK_HANDLER_ADDRESS>",
    signMessageLibAddress: "<SIGN_MESSAGE_LIB_ADDRESS>",
    createCallAddress: "<CREATE_CALL_ADDRESS>",
    simulateTxAccessorAddress: "<SIMULATE_TX_ACCESSOR_ADDRESS>",
    safeMasterCopyAbi: "<MASTER_COPY_ABI>", // Optional. Only needed with web3.js
    safeProxyFactoryAbi: "<PROXY_FACTORY_ABI>", // Optional. Only needed with web3.js
    multiSendAbi: "<MULTI_SEND_ABI>", // Optional. Only needed with web3.js
    multiSendCallOnlyAbi: "<MULTI_SEND_CALL_ONLY_ABI>", // Optional. Only needed with web3.js
    fallbackHandlerAbi: "<FALLBACK_HANDLER_ABI>", // Optional. Only needed with web3.js
    signMessageLibAbi: "<SIGN_MESSAGE_LIB_ABI>", // Optional. Only needed with web3.js
    createCallAbi: "<CREATE_CALL_ABI>", // Optional. Only needed with web3.js
    simulateTxAccessorAbi: "<SIMULATE_TX_ACCESSOR_ABI>", // Optional. Only needed with web3.js
  },
};

const safeFactory = await SafeFactory.create({ ethAdapter, contractNetworks });

const safeSdk = await Safe.create({
  ethAdapter,
  safeAddress,
  contractNetworks,
});
```

### 参考文献

1. [公式ドキュメント](https://docs.safe.global/safe-core-aa-sdk/safe-core-sdk)
2. [Safe の dapp](https://app.safe.global/welcome?utm_source=coinbase&utm_medium=web)
3. [Sage のハッカソンガイド](https://safe-global.notion.site/Safe-Hackathon-Success-Guide-26ccbd7263ab44808d8f00106f35c2d7)
4. [Ultimate Ethereum Hackathon Survival Guide for 2023](https://swissintech.medium.com/ultimate-ethereum-hackathon-survival-guide-for-2023-94b2b72e17c0)
5. [サンプルアプリの GitHub](https://github.com/safe-global/safe-apps-sdk/tree/main/guides/drain-safe-app)
6. [デモアプリ](https://5afe.github.io/safe-core-protocol-demo/)
7. [Safe UI Kit](https://components.safe.global/?path=/docs/utils-colors--colors-sample)
8. [Safe React Component](https://github.com/safe-global/safe-react-components)
9. [Safe-global/safe-docs](https://github.com/safe-global/safe-docs)
10. [【完全保存版】Gelato とは](https://note.com/standenglish/n/nb7090f9ab249?magazine_key=m24ba6e70d9b1)
11. [Gelato App](https://relay.gelato.network/apps/create)
12. [Relay Docs](https://docs.safe.global/safe-core-aa-sdk/relay-kit/gelato)
13. [Gelato 1Balance](https://relay.gelato.network/balance)
14. [Safe-AA-SDK GetStarted](https://docs.safe.global/safe-core-aa-sdk/safe-apps/get-started)
15. [Safe Core packages](https://docs.safe.global/safe-core-aa-sdk/safe-apps/overview)
16. [Guide: Integrating the Safe Core SDK](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#deploy-safe)
17. [【GitHub】gnosis-starter-kit](https://github.com/scaffold-eth/scaffold-eth/tree/gnosis-starter-kit)
18. [Safe Ecosystem Tools](https://viewer.diagrams.net/index.html?tags=%7B%7D&target=blank&highlight=0000ff&edit=_blank&layers=1&nav=1&page-id=atRejJyS5DeNAtDboIeV&title=Safe%20Diagrams.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1WcTgdHoQttJ0K_fV8mDg-RmDZRYGe3D-%26export%3Ddownload)
19. [【ETH Tokyo winner】Multiple access wallet](https://github.com/dallarosa/ethglobal-clarifi)
