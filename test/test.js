const { expect, assert } = require("chai");
const { ethers } = require("hardhat");


//These test scripts need a lot of work 

describe("Rroulette", () => {
  let contract;
  let owner;
  const vrfCoordinator = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
  const LinkToken = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
  const KeyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
  const fee = 0.1 * 10 ** 18;
  
 beforeEach(async () => {
   let ticketPrice = await contract.ticketPrice;
    let totalNumOfPlayers = contract.totalNumOfPlayers;
    
    const Contract = await ethers.getContractFactory("Rroulette");
    const contract = await Contract.deploy(ticketPrice, totalNumOfPlayers);
    owner = await ethers.getSigner();
    await contract.deployed()
    
  });
  describe("Deployment", () => {
   
    it('Should set the owner', async () => {
      expect(await contract.owner().to.equal(owner.address));
    });

    it('Should set the VRF Coordinator', async () => {
expect(await vrfCoordinator)
    });

    it('Should set the Link token address', async () => {

    });
    it('Should set the key hash', async () => {

    });
    it('Should set the fee', async () => {

    });
    it('Should set the numOfPlayers', async () => {

    });
    it('Should set the ticket price', async () => {

    });

  })

  describe("creating a game",  () => {

    it('Should require player has sufficient funds', async () =>  {
     await contract.deployed();
     await contract.createNewGame() 
     assert(await ethers.provider.getBalance(contract.players[0]) == ticketPrice)
  
});

it('should accept payment from initial player', async () => {  
  await contract.createNewGame({
    from: players[0],
    value: ticketPrice, 
});


});

describe("joining a game",  () => {

  it('Should require that a game is already created', async () =>  {
   
});

it('Should require that the player has sufficient balance', async () =>  {
   
});

it('Should require that the game is not full', async () =>  {
   
});

it('Should start the game once max numOfPlayers is reached', async () =>  {
   //also changes state
});

});
describe("Playing the game",  () => {

  it('Should be set to the correct state', async () =>  {
    

});

  it('Should request a random number from VRFCoordinator every round', async () =>  {
    expect(await contract.getRandomNumber({ gasLimit: 1000000 }));
    await randomNumberRequest.wait()

});

it('Should pass turn to the next player until a player is eliminated', async () =>  {
  

});
it('Should eliminate and remove the player each round', async () =>  {
  

});

it('Should result in a single winner', async () =>  {
  

});


});

 });

 
  });

          
        
      
      
    

  

