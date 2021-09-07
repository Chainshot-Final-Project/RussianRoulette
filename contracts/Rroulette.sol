//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

/**
 * @title Russian Roulette game
 * @author Jul-Sep 2021 Chainshot Bootcamp Team (Chris, Daniel, Dilan, Shivali)
 **/

contract Rroulette is VRFConsumerBase {

   address public owner;
   uint public ticketPrice;
   uint public totalNumofPlayers;

   bytes32 internal keyHash;
   uint internal fee;
   uint public randomResult;

    enum GameState {end, setup, play}

    struct Game{
        uint numOfPlayers;
        uint totalAmount;
        GameState state;
    }

   uint public gameID;
   mapping(uint => Game) Games;

   address [] public players;
   //uint public shot;

   //struct Player {
     //  address playerAddress;
      // uint seatPosition; //0-5
   //}

   // struct Gun{
    //    int bulletLocation; //0-5
	//    uint shotsFired;
  //  }

    //mapping(address => bool) eliminatedPlayers;
    mapping(bytes32 => uint) requestIdsToPlayerRemaining;
    mapping(uint => address) winners;        //GameId => Winner Address
    address payable winner;


    event NewGameCreated(uint gameId);
    event PlayerJoinedGame(uint gameId, address joinee);
    event RequestNumber(bytes32 indexed requestId);
    event RequestFulFilled(bytes32 indexed requestId, uint256 indexed result);
    event PlayerShot(uint chairShooting, address player);
    event GameEnded(uint gameId, address indexed winner);
    event PaidWinner(address from, address winner);

    constructor(uint _ticketPrice, uint _totalNumofPlayers) VRFConsumerBase(
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B,     // VRF Coordinator rinkeby
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709      // LINK Token rinkeby
        )
    {
        owner = msg.sender;
        ticketPrice = _ticketPrice;
        totalNumofPlayers = _totalNumofPlayers;
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311; //rinkeby
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
	}

    modifier hasValue() {
        require(msg.value > 0, "Ether required");
        _;
    }

   modifier gameExists(uint _gameId){
        require(_gameId == gameID, "Invalid Game Id, No such game exists");
        _;
    }
    modifier isGameSetup(uint _gameId){
      require(Games[_gameId].state == GameState.setup, "Game is already setup. Please try again.");
      _;
    }

    modifier isGameStarted(uint _gameId){
      require(Games[_gameId].state == GameState.play, "Game has not started. Please try again.");
      _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized!");
        _;
    }

 /**
 * @notice First player to start the game will act as host and will create a new Game instance
 * @dev Check if the there is existing game. if yes, dont create a new instance instead ask player to join the existing game
 **/
function createNewGame() payable external returns(uint) {
        require(msg.value == ticketPrice, "Insufficient amount of Ether sent");
        //if(Games[gameID].state ==GameState.end) revert("Previous game has not ended!");
        ++gameID;
        Game storage game = Games[gameID];
        game.state = GameState.setup;
        ++game.numOfPlayers;
        game.totalAmount +=msg.value;
        delete players;
        players.push(msg.sender);
        Games[gameID] = game;
        emit NewGameCreated(gameID);
        return gameID;
}

/**
 * @notice New game has been created and players can join the game
 * @dev if the required number of players joined the game then trigger the startGame function from here
 * @param _gameId uint
 **/
function joinGame(uint _gameId) payable external hasValue gameExists(_gameId) isGameSetup(_gameId){

    Game storage game = Games[_gameId];
    require(msg.value == ticketPrice, "Insufficient amount of Ether sent");
    require(game.numOfPlayers < totalNumofPlayers, "Max players added. Please join next game.");
    ++game.numOfPlayers;
    game.totalAmount += msg.value;
    players.push(msg.sender);
    emit PlayerJoinedGame(_gameId, msg.sender);
    if(game.numOfPlayers==totalNumofPlayers) {
        game.state = GameState.play;
        startGame(_gameId);
    }
}


///@notice Requests randomness

function getRandomNumber() public returns (bytes32 requestId){
    require(LINK.balanceOf(address(this)) >= fee,"Need more LINK");
    requestId = requestRandomness(keyHash, fee);
    emit RequestNumber(requestId);
    }

/**
     * @notice Callback function used by VRF Coordinator to return the random number
     * to this contract.
     * @dev Some action on the contract state should be taken here, like storing the result.
     * @dev The VRF Coordinator will only send this function verified responses, and the parent VRFConsumerBase
     * contract ensures that this method only receives randomness from the designated VRFCoordinator.
     * @param requestId bytes32
     * @param randomness The random result returned by the oracle
*/
 function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    randomResult = (randomness % 6) + 1;        // mod six as the gun will have 6 chambers
    //shot = randomResult;
    emit RequestFulFilled(requestId, randomResult);
 }

/**
     * @notice Function used to play the game and determine winner
     * @dev Player at index 0 will start the game and contract will get a random number from Chainlink VRF that will be the bullet potion
     * Bullet Position will decrease by one as players take the shot. When the bullet position is at 0 index, the player taking the shot will get eliminated
     * @param _gameId uint
*/
function startGame(uint _gameId) internal gameExists(_gameId) isGameStarted(_gameId){
    Game storage game = Games[_gameId];

    uint playersRemaining = totalNumofPlayers;
    //getRandomNumber();
    //uint chairShooting = randomResult - 1;      //This number tell which player will go first from players array[0,1,2..5] that's why -1 here

    uint chairShooting; //initialized to 0
    uint bulletPlace;
    address dead = 0x0000000000000000000000000000000000000000;


    while (playersRemaining  > 1) {
      bytes32 reqId = getRandomNumber();
      requestIdsToPlayerRemaining[reqId]=playersRemaining;

      bulletPlace = randomResult; // This number tell which chamber the bullet is loaded
      while (bulletPlace != 0) {
        chairShooting++;

        if(chairShooting == totalNumofPlayers) {
          chairShooting = 0;  //or 1? dont remember....
          continue;
        }
        if(players[chairShooting] == dead)  {  //is dead?
          //chairShooting++;
          continue;
        }
        bulletPlace--;
      }
      emit PlayerShot(chairShooting, players[chairShooting]);
      players[chairShooting] = dead;
      playersRemaining--;
    }

    game.state = GameState.end;
    winner = payable(getWinner(_gameId));
    winners[_gameId] = winner;
    emit GameEnded(_gameId, winner);
}

function getWinner(uint _gameId) public view gameExists(_gameId) returns(address _winner) {
   Game storage game = Games[_gameId];
   require(game.state==GameState.end, "Game has not ended.");
   for (uint i=0; i < players.length;i++) {
   if (players[i] != 0x0000000000000000000000000000000000000000) {
      _winner = players[i];
    }
   }
}

function payWinner() external onlyOwner {
    address payable payTo = winner;
    delete winner;
    payTo.transfer(address(this).balance);  //pay winner
    emit PaidWinner(address(this), payTo);
}

function changeOwnership(address _newowner) external onlyOwner{
    owner = _newowner;
}

receive() external payable{

}

/*
function nextPlayer(uint _gameId, address _currentPlayer) internal returns(address){

			}

//after someone is eliminated, reloadGun for nextRound
//Or, rollchamber for next player's turn
function rollChamber(uint _gameId) public returns(int){

			}

function pullTrigger(uint _gameId) external returns(bool){
    //return true or false based on survival
    //eliminatedPlayers[msg.sender]=true/false;
}

function payWinner(address _winner) internal {

}
*/

}
