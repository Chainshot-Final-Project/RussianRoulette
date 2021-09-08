const { expect, assert } = require("chai");
const { ethers } = require("hardhat");


//These test scripts need a lot of work 

describe("Rroulette", () => {
  let contract;
  let owner;
  
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
    let ticketPrice =  contract.ticketPrice();
    const players =  contract.players();
    const player1 = players[0]

    it('Should require player has sufficient funds', async () =>  {
      
     await contract.deployed(); 
     assert(await contract.balanceOf(player1) == ticketPrice)
  
});

it('should accept payment from initial player', async () => {
   
  await contract.createNewGame({
    from: players[0],
    value: ticketPrice, 
})
});
 });
  });

          
        
      
      
    

  

