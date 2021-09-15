import {ethers} from 'ethers';
import renderAccount from './src/renderAccount';
import abi from './abi.json';
import Web3Modal from 'web3modal';
import providerOptions from './src/providerOptions';

const web3Modal = new Web3Modal({
    network: "rinkeby",
    cacheProvider: false,
    providerOptions,
});

const contractAddr = "0xC7Bf0c27beA0a33e0B497eB1f2A110d3DAaa733e";

web3Modal.clearCachedProvider();

async function connectAndRender() {
    await ethereum.request({method: 'eth_requestAccounts'});
    const externalProvider = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(externalProvider);
    const signer = provider.getSigner(0);
    const contract = new ethers.Contract(contractAddr, abi, signer);

    const address = await signer.getAddress();
    const balance = ethers.utils.formatEther(await provider.getBalance(address));

    const decrementHandler = async () => {
        await contract.createNewGame();
    }

    //TODO engage the join function. 
    const joinHandler = async () => {
        await contract.joinGame();
    }
    renderAccount({ address, balance }, decrementHandler, joinHandler, logout);
}

async function logout() {
    web3Modal.clearCachedProvider();
    connectAndRender();
}

ethereum.on("accountsChanged", () => {
    connectAndRender();
});

connectAndRender();