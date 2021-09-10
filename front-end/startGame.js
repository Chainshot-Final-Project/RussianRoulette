import {ethers} from 'ethers';
import Rroulette from './artifacts/contracts/Rroulette.sol/Rroulette.json'
const url = process.env.RINKEBY_URL
const provider = new ethers.providers.JsonRpcProvider(url);
const contractAddress = "0xE6711c866D4ee72663521CB2ff8B72879b5f40D0"

async function newGame() {
    const contract = new ethers.Contract(contractAddress, Rroulette.abi, signer)
    const value = ethers.utils.parseEther(".25");
    const signer = await provider.getSigner(0);
    const transaction = await signer.sendTransaction(value)(document.getElementById("tx").value);
      await transaction.wait();

}
