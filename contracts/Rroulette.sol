//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "contracts/rng.sol";

contract Rroulette {
   address public owner;
   uint public initialFunding;

   struct Player {
       address playerAddress;
       uint gameId;
   }
   
   struct Game {
        uint id;
        uint numOfPlayers;
        uint totalAmount;
    }
    
    struct Gun{
        int bulletLocation;
	    uint shotsFired;
    }

    enum states {open, calculating, closed}

    mapping(address => bool) public eliminatedPlayers;
    mapping(uint => address) public winners;


constructor(address _owner) payable {	
        owner = _owner;	
		initialFunding = msg.value;
	}

function createNewGame(uint _numOfPlayers) external returns(int){
                /*
                1. If first game then gameId = 1
                2. gameId > 1 then check state to be closed
                3. Game game = Game[]
                */  
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

}
