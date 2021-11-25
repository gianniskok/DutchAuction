const { expect } = require("chai");
const { ethers } = require("hardhat");
const {SignerWithAddress} = require("@nomiclabs/hardhat-ethers/signers");
const {BN, expectRevert} = require('@openzeppelin/test-helpers');

describe("AuctionToken", function () {
  it("Should mint new Tokens when deployed", async function () {
    const AuctionToken = await ethers.getContractFactory("AuctionToken");
    const auctionToken = await AuctionToken.deploy('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', 30);
    await auctionToken.deployed();
    console.log("AuctionToken deployed to:", auctionToken.address);
    expect(await auctionToken.totalSupply()).to.equal(30);
    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("DutchAuction",function() {

  it("Should run a completed auction , ", async function() {
    const DutchAuction = await ethers.getContractFactory("DutchAuction");
    const dutchAuction = await DutchAuction.deploy(1637751608, 1637838008, 5000, 1000, 30); //24H Auction
    await dutchAuction.deployed();
    [owner, user1, user2, user3] = await ethers.getSigners();
    console.log("DutchAuction deployed to:", dutchAuction.address);
    expect(await dutchAuction.contractBalance()).to.equal(0); //0 tokens owned from the contract
    const tokentx = await dutchAuction.transferTokensToContract();
    await tokentx.wait()
    expect(await dutchAuction.contractBalance()).to.equal(30); //All tokens owned from the contract
    expect(await dutchAuction.getRate()).to.equal(166); //Rate per 24H
    expect(await dutchAuction.priceManager(1637755208)).to.equal(4834);
    expect(await dutchAuction.priceManager(1637758808)).to.equal(4668);
    
   
    var currentPrice = await dutchAuction.priceManager(1637753408);
    var makeBidTx = await dutchAuction.makeBid(1, 1637753408, {value: currentPrice * 10**9});
    await makeBidTx.wait() 
    var bids = await dutchAuction.newRes(0);
    expect(bids.currentPrice).to.equal(5000);
    expect(await dutchAuction.getSupply()).to.equal(29);
    

    currentPrice = await dutchAuction.priceManager(1637762408);

    makeBidTx = await dutchAuction.connect(user1).makeBid(15, 1637762408, {value: currentPrice * 15 * 10**9});
    await makeBidTx.wait()
    var bids = await dutchAuction.newRes(1);
    expect(bids.currentPrice).to.equal(4502);
    expect(await dutchAuction.getSupply()).to.equal(14);

    currentPrice = await dutchAuction.priceManager(1637769608);
    makeBidTx = await dutchAuction.connect(user2).makeBid(20, 1637769608, {value: currentPrice * 20 * 10**9});
    await makeBidTx.wait()
    var bids = await dutchAuction.newRes(2);
    expect(bids.currentPrice).to.equal(4170);
    expect(await dutchAuction.getSupply()).to.equal(0);
    expect(await dutchAuction.contractBalance()).to.equal(0); //All tokens transfered
    expect(await dutchAuction.connect(owner).balance()).to.equal(1);
    expect(await dutchAuction.connect(user1).balance()).to.equal(15);
    expect(await dutchAuction.connect(user2).balance()).to.equal(14);
    await expect(dutchAuction.connect(user2).makeBid(5,1637769608, {value: currentPrice * 15 * 10**9})).to.be.revertedWith('All tokens Are Sold');
  });
});
