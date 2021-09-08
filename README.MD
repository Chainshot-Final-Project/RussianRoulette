# Overview
A lot of smart contract games today use random number generation. Unfortunately, these random numbers can be tampered with or manipulated by people, miners, and smart contract developers. This problem can be solved by using Chainlink’s VRF, which publishes its proof on chain before being consumed by applications.
For our project, we decided to create a “Russian Roulette” game that uses Chainlink’s VRF to create a random number for every round. For v1, there will be 6 players. Each player will have their own ID, and a chance to pull the trigger. If their ID matches the random number(or the bullet in this case) that Chainlink sends back, then they are eliminated. This continues until there is one remaining player, who then takes home the prize.
We have not seen many games using chainlink’s VRF, so our team agreed that it would be a great opportunity to create one ourselves.

# How the Game Works
1. Each game will be initiated by a single player. That player will then decide how much it will cost to enter their game. They will do so by depositing a certain amount of ether of their choosing, which will then become the ticket price for other players to enter that specific game. 
2. Each game will require 6 players. Once the initiated game is filled, the game will begin.
3. The game will start by each player taking turns pulling the trigger. If player1 pulls the trigger and is not shot, then player 2 will shoot. This will continue until a player is shot, resulting in that player being eliminated. After a player is eliminated, the chamber will be re-rolled and a new round will be started with the remaining players. The last player standing wins! 

# Future Improvements
//will talk to the group about future of the game