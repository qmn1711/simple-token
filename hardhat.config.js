require("@nomiclabs/hardhat-waffle");
require('dotenv').config()
const { task } = require('hardhat/config');

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require('./tasks/faucet');

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

module.exports = {
  solidity: "0.7.3",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_RPC_URL,
      accounts: [`0x${process.env.ROPSTEN_PRIVATE_KEY}`],
    }
  }
};
