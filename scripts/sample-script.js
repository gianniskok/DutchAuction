// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const DutchAuction = await hre.ethers.getContractFactory("DutchAuction");
  const dutchAuction = await DutchAuction.deploy(12, 5000, 2000, 20);

  await dutchAuction.deployed();

  console.log("DutchAuction deployed to:", dutchAuction.address);

  const AuctionToken = await hre.ethers.getContractFactory("AuctionToken");
  const auctionToken = await AuctionToken.deploy(dutchAuction.address, 20);

  await auctionToken.deployed();

  console.log("AuctionToken deployed to:", auctionToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
