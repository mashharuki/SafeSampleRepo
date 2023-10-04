import { ethers } from "hardhat";

/**
 * デプロイスクリプト
 */
async function main() {

  const nft = await ethers.deployContract("MyNFT");
  
  await nft.waitForDeployment();

  console.log(
    `deployed to ${nft.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
