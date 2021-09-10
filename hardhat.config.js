require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
//require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");


module.exports = {
  solidity: "0.8.0",
  paths: {
    artifacts: './src/artifacts',
  },
  etherscan: {
    apiKey: "MRBKDFMDUWQG2YQS5MGDAF9BXV4YGSX5NX"
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_FORK,
      }
    },
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    ropsten: {
      url: process.env.ROPSTEN_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    kovan: {
      url: process.env.KOVAN_URL,
      accounts: [process.env.PRIVATE_KEY]
  }
},

};
