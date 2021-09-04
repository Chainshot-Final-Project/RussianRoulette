//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "contracts/rng.sol";

contract Rroulette {
    
   enum GameState {Closed, Open}
   GameState public state;
   address public owner;
   uint public initialFunding;
   uint public gameID;
   address [] public players;

   struct Player {
       address playerAddress;
       uint id;
   }
   
    struct Gun{
        int bulletLocation;
	    uint shotsFired;
    }
    
    
    mapping(address => bool) public eliminatedPlayers;
    mapping(uint => address) public winners;
constructor() payable {	
        owner = msg.sender;	
	    gameID = 0;
        
	}

function createNewGame(uint _numOfPlayers) external returns(uint _gameID) {
    require(state == GameState.Closed && _numOfPlayers == 5);
    gameID = _gameID; 
    state = GameState.Open;
    players.push(msg.sender);
    gameID += 1;
}


function joinGame() external returns(int){
    /*
    -- should check if existing game active & has space available else ask player to wait till the game finishes??
    -- trigger startGame if #of Players meet
    */
			} 

function startGame(uint _gameId) internal returns(address){
    //should we return address of the player who will shoot first
			} 

function nextPlayer(uint _gameId, address _currentPlayer) internal returns(address){
    
			} 

//after someone is eliminated, reloadGun for nextRound
//Or, rollchamber for next player's turn
function rollChamber(uint _gameId) public returns(int){

			} 

function pullTrigger(uint _gameId) external returns(bool){ 
    //return true or false based on survival
}  

function payWinner(address _winner) internal { 
    
}

function changeOwnership(address _newowner) external restricted{
    owner = _newowner;
}

receive() external payable{

}

modifier restricted() {
        if (msg.sender == owner) _;
    }

 modifier isState(GameState _state) {
		require(state == _state, "Wrong state");
		_;
  } 

}