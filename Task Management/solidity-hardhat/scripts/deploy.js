const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const DynamicNft = await hre.ethers.getContractFactory("DynamicNFT");
  const DynamicNFT = await DynamicNft.deploy();

  await DynamicNFT.deployed();

  console.log("NFT deployed to:", DynamicNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
