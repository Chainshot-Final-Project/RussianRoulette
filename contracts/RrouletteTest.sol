//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
//import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
/**
 * @title Russian Roulette game
 * @author Jul-Sep 2021 Chainshot Bootcamp Team (Chris, Daniel, Dilan, Shivali)
 * @notice THIS CONTRACT IS USED BY THE test.js FILE TO DEMONSTRATE TEST CASES
 **/

contract RrouletteTest is VRFConsumerBase {

   address public owner;
   uint public ticketPrice;
   uint public totalNumofPlayers;

   bytes32 internal keyHash;
   uint internal fee;
   uint public randomResult;
   uint public fullfillCounter;
   bytes32[] public requestIdCounter;
   mapping(uint => uint) public requestToResults;

    enum GameState {end, setup, play}

    struct Game{
        uint numOfPlayers;
        uint totalAmount;
        GameState state;
    }

   uint public gameID;
   mapping(uint => Game) games;

   address [] public players;
    
    mapping(uint => address) winners;        //GameId => Winner Address
    address payable winner;

    event NewGameCreated(uint gameId);
    event ChairPosition(uint chairPosition);
    event BulletPosition(uint BulletPlace);
    event PlayerJoinedGame(uint gameId, address joinee);
    event RequestNumber(bytes32 indexed requestId);
    event RequestFulFilled(bytes32 indexed requestId, uint256 indexed result);
    event PlayerShot(uint chairShooting, address player);
    event GameEnded(uint gameId, address indexed winner);
    event PaidWinner(address from, address winner, uint amount);

    constructor(uint _ticketPrice, uint _totalNumofPlayers, address _vrfCoordinator) VRFConsumerBase(
            _vrfCoordinator, // VRF Coordinator
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
      require(games[_gameId].state == GameState.setup, "Game is already setup. Please try again.");
      _;
    }

    modifier isGameStarted(uint _gameId){
      require(games[_gameId].state == GameState.play, "Game has not started. Please try again.");
      _;
    }

    modifier noDuplicatePlayer(address _player){
      bool found;
      for(uint i=0;i<players.length;i++){
          if(players[i]== _player) found = true;
      }

      require(found==false, "Player already joined.");
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
        require(games[gameID].state ==GameState.end, "Previous game has not ended!");
        //if(Games[gameID].state ==GameState.end) revert("Previous game has not ended!");

        gameID += 1;
        Game storage game = games[gameID];
        game.state = GameState.setup;
        ++game.numOfPlayers;
        game.totalAmount +=msg.value;
        delete players;
        players.push(msg.sender);
        games[gameID] = game;
        emit NewGameCreated(gameID);
        return gameID;
}

/**
 * @notice New game has been created and players can join the game
 * @dev if the required number of players joined the game then trigger the startGame function from here
 * @param _gameId uint
 **/
function joinGame(uint _gameId) payable external hasValue gameExists(_gameId) isGameSetup(_gameId) noDuplicatePlayer(msg.sender){

    Game storage game = games[_gameId];
    require(msg.value == ticketPrice, "Insufficient amount of Ether sent");
    require(game.numOfPlayers < totalNumofPlayers, "Max players added. Please join next game.");
    ++game.numOfPlayers;
    game.totalAmount += msg.value;
    players.push(msg.sender);
    emit PlayerJoinedGame(_gameId, msg.sender);
    //If #of players joined is equal to totalNumofPlayers then request random numbers from chainlink VRF & change the state to 'play'
    if(game.numOfPlayers==totalNumofPlayers) {
        //for(uint i=1;i<totalNumofPlayers;i++){
        for(uint i=0;i<totalNumofPlayers-1;i++){
            requestIdCounter.push(getRandomNumber());
        }
        game.state = GameState.play;
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
    fullfillCounter++;
    randomResult = (randomness % 6);        // mod six as the gun will have 6 chambers
    requestToResults[fullfillCounter]=randomResult;
    emit RequestFulFilled(requestId, randomResult);
}

/**
     * @notice Function used to play the game and determine winner
     * @dev Player at index 0 will start the game and use the random number from Chainlink VRF stored in 'requestToResults' as bullet position
     * Bullet Position will decrease by one as players take the shot. When the bullet position is at 0 index, the player taking the shot will get eliminated
     * @param _gameId uint
*/
//function startGame(uint _gameId) external gameExists(_gameId) isGameStarted(_gameId){
function startGame(uint _gameId) external onlyOwner isGameStarted(_gameId){  
    Game storage game = games[_gameId];    
    address[] storage playersList = players;

    uint playersRemaining = totalNumofPlayers;
    
    uint chairShooting; //initialized to 0
    uint bulletPlace;   //any number from 0 to 5 
    address dead = 0x0000000000000000000000000000000000000000;
    uint counter = 1;
    //Continue while number of players is greater than 1
    while (playersRemaining  > 1) {
      
      //bulletPlace = requestToResults[playersRemaining-1]; // This number tell which chamber the bullet is loaded
      bulletPlace = requestToResults[counter]; // This number tell which chamber the bullet is loaded

      emit ChairPosition(chairShooting);
      emit BulletPosition(bulletPlace);
      //while (bulletPlace != 0 ) {
      while (bulletPlace > 0 || players[chairShooting] == dead) { 
        chairShooting++;
        if(chairShooting == totalNumofPlayers) {    //chairShooting == totalNumofPlayers then reset to 0 because index 0, 1,2.. to read from players array
          chairShooting = 0;  
          continue;
        }
        if(players[chairShooting] == dead)  {  //is dead?
          continue;
        }
        if(bulletPlace != 0){
            bulletPlace--;
        }     
      }
     
      emit PlayerShot(chairShooting, players[chairShooting]);
      playersList[chairShooting] = dead;
      counter++;
      playersRemaining--;
    }

    //change game state & store winner
    game.state = GameState.end;
    winner = payable(getWinner(_gameId));
    winners[_gameId] = winner;
    emit GameEnded(_gameId, winner);

    //reset random number variables
    randomResult =0;
    fullfillCounter=0;
    for(uint j=1;j<totalNumofPlayers;j++){
        delete requestToResults[j];          
    }

    //Pay winner    
    payWinner();
   
}

/**
     * @notice Function to get winner's address
     * @dev Game state should be 'end' to determine the winner
     * @param _gameId uint
*/
function getWinner(uint _gameId) internal view gameExists(_gameId) returns(address _winner) {
   Game storage game = games[_gameId];
   require(game.state==GameState.end, "Game has not ended.");
   for (uint i=0; i < players.length;i++) {
   if (players[i] != 0x0000000000000000000000000000000000000000) {
      _winner = players[i];
    }
   }
}

/**
     * @notice Function to get winner's history for gameIds
     * @param _gameId uint
*/
function getWinnerForGameId(uint _gameId) public view returns(address _winner) {
   return winners[_gameId];
}

/**
     * @notice Function to get Game Information
     * @dev Return the Game struct information from Games mapping
     * @param _gameId uint
*/
function getGameInfo(uint _gameId) public view returns(uint numPlayers, uint gameMoney, GameState state) {
    numPlayers =  games[_gameId].numOfPlayers;
    gameMoney =  games[_gameId].totalAmount;
    state = games[_gameId].state;
}

/**
     * @notice Function to get Game Information
     * @dev Return the requestToResults mapping information
     * @param _counter uint
*/
function getFullFillInfo(uint _counter) public view returns(uint) {
    return requestToResults[_counter];
}


/**
     * @notice Function to pay the prize money to winner's address
     * @dev Game state should be 'end' to determine the winner
*/
function payWinner() internal {
    address payable payTo = winner;
    uint amount = address(this).balance;
    delete winner;
    payTo.transfer(amount);  //pay winner
    emit PaidWinner(address(this), payTo, amount);
}

function changeOwnership(address _newowner) external onlyOwner{
    owner = _newowner;
}

receive() external payable{

}
}
