require('dotenv').config();
const { ethers } = require("ethers");

const { abi } = require('/Users/tomterrific/Chainshot/RussianRoulette/src/artifacts/contracts/Rroulette.sol/Rroulette.json');

// Set up wallet.
const privateKey = process.env.PRIVATE_KEY;
const alchemyEndpoint = process.env.ALCHEMY_FORK;

const provider = new ethers.providers.JsonRpcProvider(alchemyEndpoint, 'rinkeby');
const wallet = new ethers.Wallet(privateKey, provider)

// Get Pack contract
const contractAddress = '0x53d376eD24482Bb6F48ab3eaDE0A31c29C180F7D';
const contract = new ethers.Contract(contractAddress, abi, wallet);

async function main() {
  const randomNumberRequest = await contract.getRandomNumber({ gasLimit: 1000000 });
  await randomNumberRequest.wait()
  
  console.log('Random number request tx hash: ', randomNumberRequest.hash); 
  
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });