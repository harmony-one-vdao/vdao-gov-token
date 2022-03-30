
vc = require("./js/constants");
common = require("./js/common");
logFile = require("./js/logFile");

logFile.consoleLogToFile({
    logFilePath: "./logs/deploy.log",
});

// VDaoGovTokenAddress = "0x7E3074Da5CF3B2B9b93248D95A4D5Ac03d8d0e9D" // Testnet
VDaoGovTokenAddress = "0x03FaF53b8Add920261CF34BcD7c68583eEc05281" // Mainnet
amountInOne = '0.2'
doAirdrop = false

// check balances
notCorrect = {}
totalSupply = 0
quorum = 51

function calcQuorumFromSupply(_totalSupply) {
  qPerc =  ethers.BigNumber.from(_totalSupply).div(100)
  console.log(qPerc)
  qPercQuorum = ethers.BigNumber.from(qPerc).mul(quorum)
  console.log(qPercQuorum)
  qPercOne = ethers.utils.formatEther(qPercQuorum)

    console.log(`Quorum amount: ${qPercOne}`)
}

async function main() {
  function logContractAddresses() {
    console.log("vdaogovToken address:", vdaogovToken.address);
  }

  vdaogovToken = await common.attachAddressToContract("VDaoGovToken", VDaoGovTokenAddress)

  // Load up balances
  // await common.UpdateAmounts(vdaogovToken, vc.validators_array, vc.amount_staked_array)

  // await common.addAddressesLoop()

  console.log(`Anything not correct?\n ${notCorrect}`)

  // total supply check
  _totalSupply = await vdaogovToken.totalSupply()
  console.log(`Total Supply check: expected ${totalSupply} | actual ${_totalSupply}`)

  calcQuorumFromSupply(_totalSupply)

  logContractAddresses()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.error);
    process.exit(1);
  });

