require("@nomiclabs/hardhat-waffle");
require('dotenv').config();


module.exports = {
  solidity: "0.8.0",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: [process.env.RINKEBY_URL],
      accounts: [process.env.PRIVATE_KEY]
    },
    ropsten: {
      url: [process.env.ROPSTEN_URL],
      accounts: [process.env.PRIVATE_KEY]
    },
    kovan: {
      url: [process.env.KOVAN_URL],
      accounts: [process.env.PRIVATE_KEY]
  }
}
};
