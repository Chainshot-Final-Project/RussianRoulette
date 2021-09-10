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
      chainId: 1337,
      //forking: {
      //  url: "https://eth-rinkeby.alchemyapi.io/v2/zTwOnqdjaDVxJxx9Q5FCfueX-Q4PJK0L",
      //  blockNumber: 9170421
      //}
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
