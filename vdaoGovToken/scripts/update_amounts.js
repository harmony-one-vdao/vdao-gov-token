vc = require("./js/constants");
common = require("./js/common");
logFile = require("./js/logFile");

logFile.consoleLogToFile({
    logFilePath: "./logs/deploy.log",
});

// VDaoGovTokenAddress = "0x4e54253EF3d7BA046089bf1623DB204d6Cd119E9" // Testnet
VDaoGovTokenAddress = "0x808d9C84Bd4886BB8B40A06E4F50F8Ee45E3D9c4" // Mainnet
amountInOne = '0.2'
doAirdrop = false

// check balances
notCorrect = {}
totalSupply = 0

async function main() {
  function logContractAddresses() {
    console.log("vdaogovToken address:", vdaogovToken.address);
  }

  vdaogovToken = await common.attachAddressToContract("VDaoGovToken", VDaoGovTokenAddress)

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

