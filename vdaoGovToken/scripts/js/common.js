

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

async function airdropOne(_address) {
    [owner] = await ethers.getSigners();
    console.log(`Sending 0.2 ONE to ${_address}..`)
    // ONE  amount to send
    let amountInOne = '0.2'
    try {
        tx = await owner.sendTransaction({
            to: _address,
            // Convert currency unit from ether to wei
            value: ethers.utils.parseEther(amountInOne)
        })

    } catch (error) {
        console.error(`Error sending ONE: ${error.error}`)
    }
    await callFunctionWithEvent(tx, "Transfer")
}

async function addAddressesLoop() {

    for (i = 0; i < vc.validators_array.length; i++) {
        v = vc.validators_array[i]
        a = vc.amount_staked_array[i]
        console.log(`checking address: ${v} with value ${a}`)
        try {
            await checkBalances(vdaogovToken, v, a)
        } catch (error) {
            console.error(`Error Checking balanceOf address: ${a}\nError: ${error.error}`)
        }
        if (doAirdrop) {
            await airdropOne(v)
        }
    }
}

async function attachAddressToContract(contractName, contractAddress) {
    [signer] = await ethers.getSigners();
    // const Contract = await ethers.getContractFactory(contractName);
    const contract = await ethers.getContractAt(contractName, contractAddress, signer);
    // const contract = await Contract.attach(contractAddress);
    console.log(`${contractName} Attached at:  ${contractAddress}`);
    return contract
}


async function calcQuorumFromSupply(_totalSupply) {

    // Quorum check
    q = await vdaogovToken._quorumPercentage()
    qPerc = ethers.BigNumber.from(_totalSupply).div(100)
    console.log(qPerc)
    qPercQuorum = ethers.BigNumber.from(qPerc).mul(q)
    console.log(qPercQuorum)
    qPercOne = ethers.utils.formatEther(qPercQuorum)

    _quorum = await vdaogovToken.quorumAmount()
    _quorumOne = ethers.utils.formatEther(_quorum)
    console.log(`Quorum check WEI: expected ${qPercQuorum}  | actual ${ethers.BigNumber.from(_quorum).mul(1)}    | ${qPercQuorum == _quorum}`)
    console.log(`Quorum check ONE: expected ${qPercOne}     | actual ${_quorumOne} | ${qPercOne == _quorumOne}`)
}

async function supplyCheck() {
    // total supply check
    _totalSupply = await vdaogovToken.totalSupply()
    console.log(`Total Supply check: expected ${totalSupply} | actual ${_totalSupply}`)
    return _totalSupply
}

module.exports = {
    deployToken: deployToken,
    callFunctionWithEvent: callFunctionWithEvent,
    UpdateAmounts: UpdateAmounts,
    checkBalances: checkBalances,
    attachAddressToContract: attachAddressToContract,
    addAddressesLoop: addAddressesLoop,
    calcQuorumFromSupply: calcQuorumFromSupply,
    supplyCheck: supplyCheck
}