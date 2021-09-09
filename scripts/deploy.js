
const  hre = require("hardhat");


async function main() {
  
  const Contract = await hre.ethers.getContractFactory("RrouletteV1");
  const contract = await Contract.deploy(0250000000000000000, 3);
  await contract.deployed();

  console.log("Roulette deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
