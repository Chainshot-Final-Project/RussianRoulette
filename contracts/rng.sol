//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//imports
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";


contract rng is VRFConsumerBase {

   bytes32 internal keyHash;
   uint internal fee;
   uint public randomResult;
   uint public lotteryID;
   address [] public players;
   uint public shot;
  constructor () VRFConsumerBase(
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, // VRF Coordinator rinkeby
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709  // LINK Token rinkeby
        ) 
    {
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311; //rinkeby
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
        
    }



  function getRandomNumber() public returns (bytes32 requestId){
    require(LINK.balanceOf(address(this)) >= fee,"Need more LINK");
    return requestRandomness(keyHash, fee);
    
    }
  
 function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {  
    randomResult = (randomness % players.length) + 1;
    shot = randomResult;
 }
}