
vc = require("./js/constants");
common = require("./js/common");
logFile = require("./js/logFile");

logFile.consoleLogToFile({
    logFilePath: "./logs/deploy.log",
});

VDaoGovTokenAddress = "0x7E3074Da5CF3B2B9b93248D95A4D5Ac03d8d0e9D"
amountInOne = '0.2'
doAirdrop = true

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

  // total supply check
  _totalSupply = await vdaogovToken.totalSupply()
  console.log(`Total Supply check: expected ${totalSupply} | actual ${_totalSupply}`)


  logContractAddresses()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.error);
    process.exit(1);
  });

