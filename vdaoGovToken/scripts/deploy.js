const { assert } = require("chai");

vc = require("./js/constants");
logFile = require("./js/logFile");

logFile.consoleLogToFile({
  logFilePath: "./logs/deploy.log",
});

owner = '0x4F966e4DB9d4a9dD22bb19CBe4f7Bd9d75eE6254';


async function deployToken(_name, ..._args) {
  console.log(`Deploying ${_name} ...`);
  try {
    Contract = await ethers.getContractFactory(_name);
    contractDeployed = await Contract.deploy(..._args);
    console.log(`${_name} Deployed at:  ${contractDeployed.address}`);
    return contractDeployed
  } catch (error) {
    console.error(error)
  }

}

async function callFunctionWithEvent(func, eventName) {
  receipt = await func.wait()
  resultEvent = receipt.events?.filter((x) => { return x.event == eventName })
  try {
    let e = resultEvent[0].args
    console.log(e);
    return e
  } catch (error) {
    console.error(error.error)
    return error
  }
}

async function checkBalances(vdaogovToken, _address, expected) {
  // check balance of contract for tokens
  totalSupply += parseInt(expected)
  try {
    balance = await vdaogovToken.balanceOf(_address)
    console.log(`VDaoGovToken: Balance of ${_address} = ${balance}  | expected = ${expected}  |  matched = ${balance == expected}`)
    if (balance != expected) {
      notCorrect[_address] = (balance, expected)
    }
  } catch (error) {
    console.error(`Error checking balances:  ${error.error}`)

  }

}

async function UpdateAmounts(vdaogovToken, validators, amounts) {
  console.log("Updating amounts..")
  try {
    result = await vdaogovToken.setAmountStakedByAddress(validators, amounts)
    await callFunctionWithEvent(result, "AmountsUpdated")
    console.log("Amounts Updated successfully..")
  } catch (error) {
    console.error(`Error updating amounts.. ${error.error}`)
  }
}


async function main() {
  function logContractAddresses() {
    console.log("vdaogovToken address:", vdaogovToken.address);
  }
  [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  vdaogovToken = await deployToken("VDaoGovToken")

  // Load up balances
  await UpdateAmounts(vdaogovToken, vc.validators_array, vc.amount_staked_array)

  // check balances
  notCorrect = {}
  totalSupply = 0

  for (i = 0; i < vc.validators_array.length; i++) {
    v = vc.validators_array[i]
    a = vc.amount_staked_array[i]
    console.log(`checking address: ${v} with value ${a}`)
    try {
      await checkBalances(vdaogovToken, v, a)
    } catch (error) {
      console.error(`Error Checking balanceOf address: ${a}\nError: ${error.error}`)
    }
  }

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

