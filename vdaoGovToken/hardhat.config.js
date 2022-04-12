/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

const PRIVATE_KEY_TESTNET = process.env.PRIVATE_KEY_TESTNET;
const PRIVATE_KEY_MAINNET = process.env.PRIVATE_KEY_MAINNET;

module.exports = {

  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      },
      
    }
  },
  networks: {
    testnet: {
      url: `https://api.s0.b.hmny.io`,
      accounts: [`0x${PRIVATE_KEY_TESTNET}`]
    },
    mainnet: {
      url: `https://rpc.hermesdefi.io`,
      accounts: [`0x${PRIVATE_KEY_MAINNET}`]
    }
  }

};
