
const hre = require("hardhat");
const ethernal = require('hardhat-ethernal');


async function main() {
  const Rroulette = await ethers.getContractFactory("Rroulette");
  const contract = await Rroulette.deploy(0.001 * 10**18, 6);  // For Verify type arguments as 0001000000000000000, 6
  await contract.deployed();
  
  await hre.ethernal.push({
    name: 'Rroulette',
    address: contract.address
})
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
