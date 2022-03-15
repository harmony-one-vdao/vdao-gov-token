# Validator Dao Governance Token

**Contracts**

**TestNet**: *0x7E3074Da5CF3B2B9b93248D95A4D5Ac03d8d0e9D*
**MainNet** : *TBA*
# Update with new amounts 

1. run `./scripts/py/save_stake_amounts.py` file to gather amounts
2. check the file in `./scripts/py/data/TODAYS_DATE.csv`
3. run `npx hardhat run ./scripts/update_amounts.js --network testnet` OR `--network mainnet`
4. Analyse results.


# Setup local

Create Dir and install Hardhat

>  Tutorial: https://hardhat.org/tutorial/

```
mkdir vdao_gov_token
cd vdao_gov_token
npm init --yes
npm install --save-dev hardhat
```

In the same directory where you installed Hardhat run:

`npx hardhat`


# hardhat.config.js

```javascript

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
      url: `https://harmony-0-rpc.gateway.pokt.network`,
      accounts: [`0x${PRIVATE_KEY_MAINNET}`]
    }
  }

};


 ```

Install OpenZeppellin, waffle and EtherJs

`npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai @openzeppelin/contracts`

# Clean and compile

```
    npx hardhat clean
    npx hardhat compile
```

# Deploy to Mainnet

`npx hardhat run scripts/deploy.js --network mainnet`

# Deploy to testnet

`npx hardhat run scripts/deploy.js --network testnet`

OR

# Setup local blockchain with Hardhat

`npx hardhat node`

deploy

`npx hardhat run scripts/deploy.js --network localhost`

network

> localhost:8545

# For logging use console.log

Example:

```solidity

    pragma solidity ^0.8.0;

    import "hardhat/console.sol";

    contract Token {
    //...


    function transfer(address to, uint256 amount) external {
        console.log("Sender balance is %s tokens", balances[msg.sender]);
        console.log("Trying to send %s tokens to %s", amount, to);
    //...
        }
    }

```

# Flatten

`npx hardhat flatten ./contracts/VdaoGovToken.sol > ./flattened/VdaoGovToken-flat.sol`

