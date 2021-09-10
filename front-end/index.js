import Web3Modal from "web3modal";
import {ethers} from 'ethers';
import renderAccount from './renderAccount';
import providerOptions from './providerOptions';

const url = process.env.RINKEBY_URL
const provider = new ethers.providers.JsonRpcProvider(url);
const contractAddress = "0xE6711c866D4ee72663521CB2ff8B72879b5f40D0"



const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true,
  providerOptions
});

async function render() {
  const provider = await connect();
  const signer = await provider.getSigner(0);
  const address = await signer.getAddress();
  const rawBalance = await provider.getBalance(address);
  const balance = ethers.utils.formatEther(rawBalance);

  renderAccount({ address, balance }, logoutHandler);
}

async function logoutHandler() {
  web3Modal.clearCachedProvider();
  await connect();
  await render();
}

async function connect() {
  const externalProvider = await web3Modal.connect();
  return new ethers.providers.Web3Provider(externalProvider);
}

render();






