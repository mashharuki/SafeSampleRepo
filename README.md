# SafeSampleRepo
SafeProtocolを学習するためのリポジトリです。

## Safeとは

Safe（セイフ）は、多数のブロックチェーンで実行されるスマートコントラクトウォレットで、トランザクションの発生前にトランザクションを最小限の人数（M-of-N）で承認する必要があります。例えば、ビジネスに主要な利害関係者3人いる場合、トランザクションの送信前に3人中2人（2/3）または3人全員からの承認を要求するようにウォレットを設定できます。これにより、誰一人として資金を危険に晒すことができないことが保証されます。

## 動かし方

- インストール

  ```bash
  cd aa-demo-ui && yarn 
  cd safe-core-protocol-demo && yarn
  ```

- 起動(aa-demo-uiの方)

  ```bash
  yarn start
  ```

  デモの中で実際に生成したSafeAccount
  [0xe97583cDdF80aac5d7c4af996d7B73Ae3e4E3f13](https://mumbai.polygonscan.com/address/0xe97583cDdF80aac5d7c4af996d7B73Ae3e4E3f13)  
  [0x0268349cF927B050dD5aE919C11C139637aE2a24](https://mumbai.polygonscan.com/address/0x0268349cF927B050dD5aE919C11C139637aE2a24)

### relay-kit用のサンプルコード

- インストール

  ```bash
  cd relay-sample && yarn
  ```

- ガスレス+AAによるトランザクション実行(Gelatoを利用)

  ```bash
  yarn execute:sample
  ```

  実際に使用したSafeのウォレット(Base Goerli)  
  [0x244Bc53858760844C4C2b616B29E36Eeb2cb321a](https://goerli.basescan.org/address/0x244Bc53858760844C4C2b616B29E36Eeb2cb321a)
 
  実行結果

  ```bash
  Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/0xd39456ca81086f9c936b3fc5d2a34b29e63dfa75aef66b9f0253aa7eec3089a3
  ✨  Done in 19.64s.
  ```

  ```json
  {
    "task":{
      "chainId":84531,
      "taskId":"0xd39456ca81086f9c936b3fc5d2a34b29e63dfa75aef66b9f0253aa7eec3089a3",
      "taskState":"ExecSuccess",
      "creationDate":"2023-09-29T10:30:15.614Z",
      "executionDate":"2023-09-29T10:30:31.693Z","transactionHash":"0x76ca2d6e1a340903953fd99b95af8b3c6aa82e55d8588b4f407311ce52757282",
      "blockNumber":10394902
    }
  }
  ```

  実際にtransferされたトランザクションの記録(Goerli Testnet)  

  [0x76ca2d6e1a340903953fd99b95af8b3c6aa82e55d8588b4f407311ce52757282](https://goerli.basescan.org/tx/0x76ca2d6e1a340903953fd99b95af8b3c6aa82e55d8588b4f407311ce52757282)

### 参考文献
1. [公式ドキュメント](https://docs.safe.global/safe-core-aa-sdk/safe-core-sdk)
2. [Safeのdapp](https://app.safe.global/welcome?utm_source=coinbase&utm_medium=web)
3. [Sageのハッカソンガイド](https://safe-global.notion.site/Safe-Hackathon-Success-Guide-26ccbd7263ab44808d8f00106f35c2d7)
4. [Ultimate Ethereum Hackathon Survival Guide for 2023](https://swissintech.medium.com/ultimate-ethereum-hackathon-survival-guide-for-2023-94b2b72e17c0)
5. [サンプルアプリのGitHub](https://github.com/safe-global/safe-apps-sdk/tree/main/guides/drain-safe-app)
6. [デモアプリ](https://5afe.github.io/safe-core-protocol-demo/)
7. [Safe UI Kit](https://components.safe.global/?path=/docs/utils-colors--colors-sample)
8. [Safe React Component](https://github.com/safe-global/safe-react-components)
9. [Safe-global/safe-docs](https://github.com/safe-global/safe-docs)
10. [【完全保存版】Gelatoとは](https://note.com/standenglish/n/nb7090f9ab249?magazine_key=m24ba6e70d9b1)
11. [Gelato App](https://relay.gelato.network/apps/create)
12. [Relay Docs](https://docs.safe.global/safe-core-aa-sdk/relay-kit/gelato)
13. [Gelato 1Balance](https://relay.gelato.network/balance)
14. [Safe-AA-SDK GetStarted](https://docs.safe.global/safe-core-aa-sdk/safe-apps/get-started)
15. [Safe Core packages](https://docs.safe.global/safe-core-aa-sdk/safe-apps/overview)
16. [Guide: Integrating the Safe Core SDK](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#deploy-safe)