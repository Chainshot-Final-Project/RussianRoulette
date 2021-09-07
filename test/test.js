const { expect, assert } = require("chai");
const { ethers } = require("hardhat");


//These test scripts need a lot of work 

describe("Rroulette", function () {
  let contract;
  it("Should deploy the contract", async function () {
    
    const Contract = await ethers.getContractFactory("Rroulette");
    const contract = await Contract.deploy();
    await contract.deployed()
  });


  describe("creating a game", function () {
    it('Should add a game ID and inrement ID', async function()  {
      const ID = await contract.gameID;
      assert(ID > 0)
      ID ++;
  
});

    it('Should require player has sufficient funds', async function()  {
      const ticketPrice = ethers.utils.parseEther(".001");
      const players = await contract.players()
      const player1 = players[0]
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

          
        
      
      
    

  

