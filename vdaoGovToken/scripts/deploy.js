vc = require("./js/constants");
common = require("./js/common");
logFile = require("./js/logFile");

logFile.consoleLogToFile({
  logFilePath: "./logs/deploy.log",
});

owner = '0x4F966e4DB9d4a9dD22bb19CBe4f7Bd9d75eE6254';
doAirdrop = false;

// check balances
notCorrect = {}
totalSupply = 0

async function main() {
  function logContractAddresses() {
    console.log("vdaogovToken address:", vdaogovToken.address);
  }
  [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  vdaogovToken = await common.deployToken("VDaoGovToken")

  // Load up balances
  await common.UpdateAmounts(vdaogovToken, vc.validators_array, vc.amount_staked_array)

  await common.addAddressesLoop()

  console.log(`Anything not correct?\n ${notCorrect}`)

  _totalSupply = await common.supplyCheck()
  await common.calcQuorumFromSupply(_totalSupply)

  logContractAddresses()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.error);
    process.exit(1);
  });

