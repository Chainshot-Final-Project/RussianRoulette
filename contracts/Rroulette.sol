//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "contracts/rng.sol";

/**
 * @title Russian Roulette game
 * @author Jul-Sep 2021 Chainshot Bootcamp Team (Chris, Daniel, Dilan, Shivali)
 **/
contract Rroulette {
    
    address public owner;
    uint public ticketPrice;
    uint public totalNumofPlayers;
    
    enum GameState {setup, play, end}
   
    struct Game{
        uint numOfPlayers;
        uint totalAmount;       
        GameState state;
    }
 
   uint public gameID;
   mapping(uint => Game) Games;
   
   address [] public players;

   struct Player {
       address playerAddress;
       uint seatPosition; //0-5
   }
   
    struct Gun{
        int bulletLocation; //0-5
	    uint shotsFired;
    }
    
    mapping(address => bool) eliminatedPlayers;
    mapping(uint => address) winners;        //GameId => Winner Address

    event NewGameCreated(uint gameId);
    event PlayerJoinedGame(uint gameId, address joinee);
    event GameEnded(uint gameId);

    constructor(uint _ticketPrice, uint _totalNumofPlayers) {	
        owner = msg.sender;
        ticketPrice = _ticketPrice;
        totalNumofPlayers = _totalNumofPlayers;	
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
      require(Games[_gameId].state == GameState.setup, "Game is already started. Please try again.");
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
        //if(Games[gameID].state ==GameState.setup || Games[gameID].state ==GameState.play) revert("Please join the existing game");
        ++gameID;
        Game storage game = Games[gameID];                
        game.state = GameState.setup;
        ++game.numOfPlayers;
        game.totalAmount +=msg.value;
        players.push(msg.sender);        
        Games[gameID] = game;
        emit NewGameCreated(gameID);
        return gameID;        
}

/**
 * @notice New game has been created and players are now joining the game
 * @dev if the required number of players joined the game then trigger the startGame function from here 
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
        startGame(_gameId);
    }    
} 

function startGame(uint _gameId) internal returns(address){
    //@dev Daniel please continue from here assume gamecreate and players joined
			} 

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

function changeOwnership(address _newowner) external onlyOwner{
    owner = _newowner;
}

receive() external payable{

}

}