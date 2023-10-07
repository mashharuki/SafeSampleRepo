import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const {
  PRIVATE_KEY,
  ALCHEMY_GOERLI_URL
} = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    "base-goerli": {
      url: "https://goerli.base.org",
      accounts: [PRIVATE_KEY!],
      gasPrice: 1000000000,
    },
    goerli: {
      url: ALCHEMY_GOERLI_URL,
      accounts: [PRIVATE_KEY!],
      gasPrice: 1000000000,
    }
  }
};

export default config;
