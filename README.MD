Idea for our final project

We would implement a game of Russian roulette.
First player will be a kind of host and decide how much would it cost to participate and the numbers of player that would participate.
Then others players will join, paying the entrance to the contract. They will choose a seat
That table will be draw in the "front end" showing the first n characters of players wallets as identification. A private suicide attempt.
Game begins with first player decided by random (1/numbers of players).
(Random functions will be implemented as first alternative from chainlink oracle. )
He will roll the chamber of the gun (1 bullet in six positions) (another random function)
. Then he will shoot. If he survives the turn pass to next player in the table conserving the state of the gun
(position of the bullet updated). Next players could take the decision of rolling again the chamber or shooting with previous state updated.
If he gets killed he is out of the game and another round begins.
Winner can be one or many(another possible decision by the host.
Money of the game is payed to the last survivor (or survivors).

(This project is a "little lottery" that would give us experience for next step....a "big  no-loss lottery based in real world lottery oracles  perhaps inside pooltogether".)


In principle i would keep it as simple as possible avoiding unnecessary choices. So just one winner in principle

I think we can achieve a short and entertained game in one week that would give a good experience to our audience in our presentation.


Tasks

solidity contract
test cases
implementation of test cases in javascript
text design
screen design
front end implementation
optional documentation (type of gun, type of play, history of the game...)
design of the final presentation.

(Perhpas logs of random numbers generated...for final users...demonstrating real or good randomness. If this is possible of course)
