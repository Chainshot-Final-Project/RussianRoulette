const { assert } = require("chai");
const STATES = {
  END: 0,
  SETUP: 1,
  PLAY: 2,
}
describe("Rroulette", function () {
  let contract;
  let ticketPrice = ethers.utils.parseEther("1");
  let totalNumOfPlayers = 6;
  let signer0, addr0, Owner;
  let signer1, addr1, player1;
  let signer2, addr2, player2;
  let signer3, addr3, player3;
  let signer4, addr4, player4;
  let signer5, addr5, player5;
  let signer6, addr6, player6;
  const linkAddr = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"; //Rinkeby
  let linkToken;
  before(async () => {    
    signer0 = await ethers.provider.getSigner(0);
    addr0 = await signer0.getAddress(); 
    const Rroulette = await ethers.getContractFactory("Rroulette");
    contract = await Rroulette.deploy(ticketPrice,totalNumOfPlayers);
    await contract.deployed();
    console.log("contract deployed at: "+ contract.address);
    const linkABI = ["function transfer(address, uint256)"];    
    linkToken = await ethers.getContractAt(linkABI, linkAddr);
    const tx = await linkToken.transfer(contract.address, 20000);
    await tx.wait(); // mined
  });

  describe('should have balance of LINK Tokens', () => {
    it('should have balance of LINK Tokens ', async () => {
      const x = await linkToken.balanceOf(contract.address);    
      console.log(await (x));
    }); 
    
  });



describe('should have stored constructor arguments', () => {
  it('should have set number of players ', async () => {
    const x = await contract.totalNumofPlayers();    
    assert.equal((x), 6);
  }); 
  
  it('should have set ticket price ', async () => {
    const y = ethers.utils.formatEther(await contract.ticketPrice());            
    assert.equal((y), 1);
  }); 

  it('should have set signer(0) as owner ', async () => {
    Owner = await contract.owner();            
    assert.equal((Owner), addr0);
  });
});

describe('should CREATE a new game', () => {
  before(async () => {
            signer1 = await ethers.provider.getSigner(1);
            addr1 = await signer1.getAddress();              
            await contract.connect(signer1).createNewGame({value:ticketPrice});           
  });

  it('should have created new game with gameID as 1 ', async () => {
             assert.equal((await contract.gameID()), 1);       
  });

  it('should have created Games[1] with GameState.setup, numPlayer=1 and gameMoney=1 ETH ', async () => {
    let {numPlayers,gameMoney,state} = await contract.getGameInfo(1);   
    //console.log(await state);    
    assert.equal(state, STATES.SETUP);
    assert.equal(numPlayers, 1);
    console.log("Number of Players: " +await numPlayers.toNumber());
    assert.equal(ethers.utils.formatEther(gameMoney), 1.0);
    console.log("Game Money (ETH): " + await ethers.utils.formatEther(gameMoney));
  }); 
  
  it('should have added signer1 as 1st player in players array at 0th index ', async () => {
    player1 = await contract.players(0); 
    console.log("Player1: " + await player1);           
    assert.equal((player1), addr1);
  });   
});



describe('should allow Players to JOIN game', () => {
  before(async () => {
    signer2 = await ethers.provider.getSigner(2);
    addr2 = await signer2.getAddress(); 
    await contract.connect(signer2).joinGame(1, {value:ticketPrice}); 
    
    signer3 = await ethers.provider.getSigner(3);
    addr3 = await signer3.getAddress(); 
    await contract.connect(signer3).joinGame(1, {value:ticketPrice});

    signer4 = await ethers.provider.getSigner(4);
    addr4 = await signer4.getAddress();
    await contract.connect(signer4).joinGame(1, {value:ticketPrice});

    signer5 = await ethers.provider.getSigner(5);
    addr5 = await signer5.getAddress();
    await contract.connect(signer5).joinGame(1, {value:ticketPrice});

    // ** This is triggering startGame so giving Error: Transaction reverted: function call to a non-contract account
    // ** Commented for time being
    signer6 = await ethers.provider.getSigner(6);
    addr6 = await signer6.getAddress();
    await contract.connect(signer6).joinGame(1, {value:ticketPrice});
    
});

it('should have added Players ', async () => {    
    for(i=1;i<5;i++){
    player2 = await contract.players(i); 
    console.log("Player" + (i+1) + " Joined: " + await player2);
    }
    let {numPlayers,gameMoney,state} = await contract.getGameInfo(1);   
    console.log("Number of Players: " +await numPlayers.toNumber());
    console.log("Game Money (ETH): " + await ethers.utils.formatEther(gameMoney));    
  });
});

describe('should NOT allow Player to CREATE a new game when previous game has not ended', () => {
  before(async () => {
            signer1 = await ethers.provider.getSigner(1);
            addr1 = await signer1.getAddress();              
                       
  });
  it('should not have created a new game ', async () => {              
             let ex;
            try {
              await contract.connect(signer1).createNewGame({value:ticketPrice});
              assert.equal((await contract.gameID()), 2);
            }
            catch (_ex) {
                ex = _ex;
            }
            assert(ex, "Previous game has not ended!");
            console.log("Contract Revert Message: " + ex);       
  }); 
  
});

describe('should NOT allow Player to CREATE a new game with INSUFFICIENT Ticket Price', () => {
  before(async () => {
            signer1 = await ethers.provider.getSigner(1);
            addr1 = await signer1.getAddress();              
                       
  });
  it('should not have created a new game ', async () => {              
             let ex;
            try {
              await contract.connect(signer1).createNewGame({value:ethers.utils.parseEther("0.5")});
              assert.equal((await contract.gameID()), 2);
            }
            catch (_ex) {
                ex = _ex;
            }
            assert(ex, "Insufficient amount of Ether sent");
            console.log("Contract Revert Message: " + ex);       
  }); 
  
});

describe('should NOT allow DUPLIACTE Players', () => {
  before(async () => {
            signer1 = await ethers.provider.getSigner(1);
            addr1 = await signer1.getAddress();              
                       
  });
  it('should not allow player to join ', async () => {              
             let ex;
            try {
              await contract.connect(signer1).joinGame(1, {value:ticketPrice});               
            }
            catch (_ex) {
                ex = _ex;
            }
            assert(ex, "Player already joined.");
            console.log("Contract Revert Message: " + ex);       
  }); 

  describe('should check revert conditions for Join Game', () => {
    let signer7;
    before(async () => {
              signer7 = await ethers.provider.getSigner(6);
              let addr7 = await signer7.getAddress();              
                         
    });
    it('Should require that a game is already created', async () => {              
               let ex;
              try {
                await contract.connect(signer1).joinGame(2, {value:ticketPrice});               
              }
              catch (_ex) {
                  ex = _ex;
              }
              assert(ex, "Invalid Game Id, No such game exists");
              console.log("Contract Revert Message: " + ex);       
    }); 

    it('Should require that the player has sufficient balance', async () => {              
      let ex;
     try {
       await contract.connect(signer7).joinGame(1, {value:ethers.utils.parseEther("0.5")});               
     }
     catch (_ex) {
         ex = _ex;
     }
     assert(ex, "Insufficient amount of Ether sent");
     console.log("Contract Revert Message: " + ex);
    /* 
     it('Should require that the game is not full', async () => {              
      let ex;
     try {
       await contract.connect(signer7).joinGame(1, {value:ticketPrice});               
     }
     catch (_ex) {
         ex = _ex;
     }
     assert(ex, "Max players added. Please join next game.");
     console.log("Contract Revert Message: " + ex);
     */
  }); 
});
  
});

});