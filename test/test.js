const hre = require("hardhat");
const { assert } = require("chai");
const { ethers } = require("ethers");

const STATES = {
  END: 0,
  SETUP: 1,
  PLAY: 2,
}
//const ethernal = require('hardhat-ethernal');
const { abi } = require('/Users/dhana/Documents/GitHub/RussianRoulette/src/artifacts/@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol/LinkTokenInterface.json')

describe("Russian Roulette", function () {
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
  let vrfCoordinatorMock , linkContract;
  let requestId;
  let ramdomness;
  
  before(async () => {    
    signer0 = await hre.ethers.provider.getSigner(0);
    addr0 = await signer0.getAddress(); 
    
    const linkTokenAddress = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';    //rinkeby LINK Token address
    linkContract = new hre.ethers.Contract(linkTokenAddress, abi, signer0);

    const VRFCoordinatorMock = await hre.ethers.getContractFactory("VRFCoordinatorMock"); //Deploy VRF Coordinator
    vrfCoordinatorMock = await VRFCoordinatorMock.deploy(linkTokenAddress);
        
    const Rroulette = await hre.ethers.getContractFactory("RrouletteTest");
    contract = await Rroulette.deploy(ticketPrice,totalNumOfPlayers, vrfCoordinatorMock.address); //Deploy RrouletteTest.sol for test cases
    
    console.log("**************DEPLOYMENTS**************");
    console.log("Contract deployed at: "+ contract.address);
    console.log("Contract Balance (ETH): "+ await hre.ethers.provider.getBalance(contract.address));
    console.log("VRFCoordinatorMock deployed at: "+ vrfCoordinatorMock.address);
      
      
    //Add LINK Tokens
    const to = await contract.address;
    const value = ethers.utils.parseEther('10');
    const transferTx = await linkContract.transfer(to, value);
    await transferTx.wait();
    //console.log('Transfer tx hash', transferTx.hash);
    const x = await linkContract.balanceOf(contract.address);  
    console.log("Contract's LINK Token Balance: "+ await (ethers.utils.formatEther(x)));
    console.log("****************************************");
  });
 

describe('Verify Constructor Arguments are set correctly', () => {
  it('should have set number of players to 6 ', async () => {
    const x = await contract.totalNumofPlayers();    
    assert.equal((x), 6);
  }); 
  
  it('should have set ticket price to 1.0 ETH', async () => {
    const y = ethers.utils.formatEther(await contract.ticketPrice());            
    assert.equal((y), 1);
  }); 

  it('should have set signer(0) as Owner ', async () => {
    Owner = await contract.owner();            
    assert.equal((Owner), addr0);
  });  
});


describe('Player 1: CREATE a new game', () => {
  before(async () => {
            signer1 = await hre.ethers.provider.getSigner(1);
            addr1 = await signer1.getAddress();              
            await contract.connect(signer1).createNewGame({value:ticketPrice}); 
            console.log("********CREATE A NEW GAME***************");          
  });

  it('should have created a new game with gameID as 1 ', async () => {
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

describe('Remaining Players 2-6 JOIN game', () => {
  before(async () => {
    
    signer2 = await hre.ethers.provider.getSigner(2);
    addr2 = await signer2.getAddress(); 
    await contract.connect(signer2).joinGame(1, {value:ticketPrice}); 
    
    signer3 = await hre.ethers.provider.getSigner(3);
    addr3 = await signer3.getAddress(); 
    await contract.connect(signer3).joinGame(1, {value:ticketPrice});

    signer4 = await hre.ethers.provider.getSigner(4);
    addr4 = await signer4.getAddress();
    await contract.connect(signer4).joinGame(1, {value:ticketPrice});

    signer5 = await hre.ethers.provider.getSigner(5);
    addr5 = await signer5.getAddress();
    await contract.connect(signer5).joinGame(1, {value:ticketPrice});

    signer6 = await hre.ethers.provider.getSigner(6);
    addr6 = await signer6.getAddress();
    await contract.connect(signer6).joinGame(1, {value:ticketPrice});  
      
    console.log("********JOIN GAME***************"); 
});

it('should have added Players ', async () => {    
    for(i=1;i<6;i++){
    player2 = await contract.players(i); 
    console.log("Player" + (i+1) + " Joined: " + await player2);
    }
    let {numPlayers,gameMoney,state} = await contract.getGameInfo(1);   
    console.log("Number of Players: " +await numPlayers.toNumber());
    console.log("Game Money (ETH): " + await ethers.utils.formatEther(gameMoney));  
    const x = await hre.ethers.provider.getBalance(contract.address);
    console.log("Contract Balance (ETH): "+ await ethers.utils.formatEther(x));
    console.log("****************************************");
    console.log("********CHAINLINK VRF GET RANDOM NUMBERS***************");
  });
});

describe('Should make game state == PLAY & Request Random Numbers', () => { 
  it('should have changed the game state == play ', async () => {    
   let {numPlayers,gameMoney,state} = await contract.getGameInfo(1);   
   //console.log(await state);    
   assert.equal(state, STATES.PLAY);  
  });

  it('should have requested five random numbers from chainlink vrf logging out the bytes 32 requestIDs & results ', async () => {    
    for(i=0;i<5;i++){
      requestId = await contract.requestIdCounter(i);       
      console.log("Bytes 32 RequestId: " + (i+1) + ": " + await requestId);
    }
    ramdomness = '23411';
    await vrfCoordinatorMock.callBackWithRandomness(await contract.requestIdCounter(0), ramdomness, contract.address);
    console.log("****************************************");
    console.log("RandomResult 1: " + await contract.requestToResults(1)); 
    
    ramdomness = '654';
    await vrfCoordinatorMock.callBackWithRandomness(await contract.requestIdCounter(1), ramdomness, contract.address);
    console.log("RandomResult 2: " + await contract.requestToResults(2)); 

    ramdomness = '3339';
    await vrfCoordinatorMock.callBackWithRandomness(await contract.requestIdCounter(2), ramdomness, contract.address);
    console.log("RandomResult 3: " + await contract.requestToResults(3)); 

    ramdomness = '234235';
    await vrfCoordinatorMock.callBackWithRandomness(await contract.requestIdCounter(3), ramdomness, contract.address);
    console.log("RandomResult 4: " + await contract.requestToResults(4));

    ramdomness = '932';
    await vrfCoordinatorMock.callBackWithRandomness(await contract.requestIdCounter(4), ramdomness, contract.address);
    console.log("RandomResult 5: " + await contract.requestToResults(5));
     
    //await new Promise(resolve => setTimeout(resolve, 10000))  
  });

  it('should have incremented fullfillCounter', async () => {    
    const fulfillCounter = await contract.fullfillCounter();
    console.log(fulfillCounter.toNumber());
    const x = await linkContract.balanceOf(contract.address);  
    console.log("Contract's LINK Token Balance: "+ await (ethers.utils.formatEther(x)));         
   });  
});

describe('should trigger startGame function', () => {
 
  it('Game Started: ', async () => {    
    console.log("****************************************");
    console.log("************GAME STARTED****************");   
     await contract.connect(signer0).startGame(1);       
  });   

  it('should have a WINNER & Paid out the prize money', async () => {    
    for(i=0;i<6;i++){
    player2 = await contract.players(i); 
    //console.log("Player Address Afterwards: " + (i+1)+ " " + await player2);    
    }
    let {numPlayers,gameMoney,state} = await contract.getGameInfo(1);  
    console.log("****************************************"); 
    //console.log("Number of Players: " +await numPlayers.toNumber());
    //console.log("Game Money (ETH): " + await ethers.utils.formatEther(gameMoney));
    //console.log("Game State: " + await state);
    const winnerAddress = await contract.connect(signer0).getWinnerForGameId(1);   
    console.log("WINNER of Game 1 is: " + winnerAddress);
    console.log("Contract Balance (ETH): "+ await hre.ethers.provider.getBalance(contract.address));      
    console.log("****************************************");     
  });
});

// Test Cases for revert conditions
/*
describe('should NOT allow Player to CREATE a new game when previous game has not ended', () => {
  before(async () => {
            signer1 = await hre.ethers.provider.getSigner(1);
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
*/
describe('should NOT allow Player to CREATE a new game with INSUFFICIENT Ticket Price', () => {
  before(async () => {
            signer1 = await hre.ethers.provider.getSigner(1);
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
            signer1 = await hre.ethers.provider.getSigner(1);
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
});
  describe('should check revert conditions for Join Game', () => {
    let signer7;
    before(async () => {
              signer7 = await hre.ethers.provider.getSigner(6);
              let addr7 = await signer7.getAddress();              
                         
    });
    it('Should require that a game is already created', async () => {              
               let ex;
              try {
                await contract.connect(signer7).joinGame(2, {value:ticketPrice});               
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
    }); 
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
  }); 
  
});

});