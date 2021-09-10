
const hre = require("hardhat");


async function main() {
  const Rroulette = await ethers.getContractFactory("Rroulette");
  const contract = await Rroulette.deploy(0000000000000000005, 6);
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
