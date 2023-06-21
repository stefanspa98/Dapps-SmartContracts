const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const TaskManager = await hre.ethers.getContractFactory("TaskManager");
  const taskManager = await TaskManager.deploy();

  await taskManager.deployed();

  console.log("TaskManager deployed to:", taskManager.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
