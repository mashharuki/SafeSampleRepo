import { AuthMethodType, ProviderType } from "@lit-protocol/constants";
import {
  LitAuthClient,
  WebAuthnProvider,
} from "@lit-protocol/lit-auth-client/src/index.js";
import { LitNodeClientNodeJs } from "@lit-protocol/lit-node-client-nodejs";
import {
  AuthMethod,
  IRelayPKP
} from '@lit-protocol/types';


const litNodeClient = new LitNodeClientNodeJs({
  litNetwork: "cayenne",
  debug: false,
});

// Lit用のインスタンスを設定
const authClient = new LitAuthClient({
  litRelayConfig: {
    relayApiKey: process.env.NEXT_PUBLIC_LIT_RELAY_API_KEY,
  },
  litNodeClient,
});

/**
 * 接続
 */
async function connect() {
  await litNodeClient.connect();
}

/**
 * Register new WebAuthn credential
 * ✨ very important
 */
export async function registerWebAuthn(): Promise<IRelayPKP> {
  await connect();
  const provider = authClient.initProvider<WebAuthnProvider>(
    ProviderType.WebAuthn
  );
  // Register new WebAuthn credential
  const options = await provider.register();

  // Verify registration and mint PKP through relay server
  const txHash = await provider.verifyAndMintPKPThroughRelayer(options);
  const response = await provider.relay.pollRequestUntilTerminalState(txHash);
  if (response.status !== 'Succeeded') {
    throw new Error('Minting failed');
  }
  // RealyPKP型のオブジェクトを生成
  const newPKP: IRelayPKP = {
    tokenId: response.pkpTokenId!,
    publicKey: response.pkpPublicKey!,
    ethAddress: response.pkpEthAddress!,
  };
  return newPKP;
}

/**
 * Get auth method object by authenticating with a WebAuthn credential
 */
export async function authenticateWithWebAuthn(): Promise<AuthMethod | undefined> {
  await connect();
  let provider = authClient.getProvider(ProviderType.WebAuthn);

  if (!provider) {
    provider = authClient.initProvider<WebAuthnProvider>(
      ProviderType.WebAuthn
    );
  }
  const authMethod = await provider!.authenticate();
  return authMethod;
}

/**
 * Fetch PKPs associated with given auth method
 */
export async function getPKPs(authMethod: AuthMethod): Promise<IRelayPKP[]> {
  await connect();
  const provider = getProviderByAuthMethod(authMethod);
  const pkpInfo = await provider!.fetchPKPsThroughRelayer(authMethod);
  console.log("pkpInfo:", pkpInfo);

  return pkpInfo;
}

/**
 * Mint a new PKP for current auth method
 */
export async function mintPKP(): Promise<any> {
  await connect();
  const provider = authClient.initProvider<WebAuthnProvider>(
    ProviderType.WebAuthn
  );

  const authMethod = await provider.authenticate();
  // get public key
  const publicKey = await provider.computePublicKeyFromAuthMethod(authMethod);
  console.log("local public key computed: ", publicKey);

  let claimResp = await provider.claimKeyId({
    authMethod,
  });
  console.log("claim response public key: ", claimResp.pubkey);  
  console.log("claim : ", claimResp);  
  
  return claimResp.pubkey;
}

/**
 * Get provider for given auth method
 */
function getProviderByAuthMethod(authMethod: AuthMethod) {
  switch (authMethod.authMethodType) {
    case AuthMethodType.WebAuthn:
      return authClient.getProvider(ProviderType.WebAuthn);
    default:
      return;
  }
}
