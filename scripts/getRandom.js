const addr = "<ADDRESS>"; //Rinkeby - RRoulette
const linkAddr = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"; //Rinkeby

async function main() {
  const consumer = await hre.ethers.getContractAt("Rroulette", addr);

  const linkABI = ["function transfer(address, uint) external"];
  const linkToken = await ethers.getContractAt(linkABI, linkAddr);
  const tx = await linkToken.transfer(consumer.address, ethers.utils.parseEther(".1"));
  await tx.wait(); // mined

  await consumer.getRandomNumber();

  console.log('Random number request tx hash: ', consumer.getRandomNumber); 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
