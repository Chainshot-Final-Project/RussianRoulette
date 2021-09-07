const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

//These test scripts need a lot of work 

describe("Rroulette", function () {
  it("Should deploy the contract", async function () {
    const initialSupply = ethers.utils.parseEther("");
    const Roulette = await ethers.getContractFactory("Rroulette");
    const roulette = await Roulette.deploy();
    await roulette.deployed()
  });

  it(" contract should be funded initially", async function() {
    let balance = await ethers.provider.getBalance(roulette.address);
    assert.equal(balance.toString(), initialSupply.toString());
  });


  describe("creating a game", function () {
    it('Should require player has sufficient funds', async function()  {
      const ticketPrice = ethers.utils.parseEther(".25")
      const player1 = players[0]
      const players = await roulette.players()
     await roulette.deployed() 
     assert(await roulette.balanceOf(player1) >= ticketPrice)
  
});

it('should accept payment from initial player', async () => {
   await roulette.createNewGame({
    from: players[0],
    value: ('0.25', 'ether')
})
});
    
       
describe("joining a newly created game", function() {

  it('Should allow other players to join', async () => {
    const players = await roulette.players()
    await roulette.createNewGame()
     assert(await players == 5)
     await roulete.joinGame({
       from: players[1,2,3,4],
       value:('.25', 'ether')
     
     })
    });
  

  describe("starting and playing the game", function() {
    it("should update the balance of the contract", async () => {
      
      const balance = await ethers.provider.getBalance(roulette.address)
      const expectedBalance = ethers.utils.parseEther("1"); //.25 x 5
      assert.equal(balance.toString(), expectedBalance.toString());
    });

    it("should initiate first round, spin chamber, and eliminate 1 player"), async () => {
      const spinChamber = await roulette.spinChamber()
      const players = await roulette.players()
      const pullTrigger = await roulette.pullTrigger()
       await roulette.startGame()
      assert(spinChamber)
      for(i=0; i = players.length; i++){
        if(pullTrigger == false){
          await roulettte.nextPlayer()
        }else{
          players--
        }
      }

    
      it("should initiate round 2, spin chamber, and eliminate another player"), async () => {
        expect(players == 4)
        await roulette.startGame()
      assert(spinChamber)
      for(i=0; i = players.length; i++){
        if(pullTrigger == false){
          await roulettte.nextPlayer()
        }else{
          players--
        }
      }
    

      describe("Paying winner", function () {
        it("Should pay the winner at the end of the game", async function () {
          //
        
      
      
    

  

