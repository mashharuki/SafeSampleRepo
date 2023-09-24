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

### 参考文献
1. [公式ドキュメント](https://docs.safe.global/safe-core-aa-sdk/safe-core-sdk)
2. [Safeのdapp](https://app.safe.global/welcome?utm_source=coinbase&utm_medium=web)
3. [Sageのハッカソンガイド](https://safe-global.notion.site/Safe-Hackathon-Success-Guide-26ccbd7263ab44808d8f00106f35c2d7)
4. [Ultimate Ethereum Hackathon Survival Guide for 2023](https://swissintech.medium.com/ultimate-ethereum-hackathon-survival-guide-for-2023-94b2b72e17c0)
5. [サンプルアプリのGitHub](https://github.com/safe-global/safe-apps-sdk/tree/main/guides/drain-safe-app)
6. [デモアプリ](https://5afe.github.io/safe-core-protocol-demo/)