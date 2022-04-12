// SPDX-License-Identifier: MIT
// Maffaz.One 2022
// john@maffaz.com
// Validator Dao Governance Token v2.0.0

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VDaoGovToken is Ownable {
    mapping(address => uint256) private _balances;

    uint256 private _totalSupply;
    uint8 public _quorumPercentage = 51;

    string private _name;
    string private _symbol;

    event AmountsUpdated(
        bool Result,
        uint256 totalSupply,
        uint256 numberAddressesUpdated
    );

    constructor() {
        _name = "Validator Dao Governance Token";
        _symbol = "VDAOG";
    }

    // ERC20 standard funtions we will use

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return 18;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function setQuorumPercentage(uint8 _quorum) public onlyOwner {
        require(_quorum <= 100, "Max 100%");
        _quorumPercentage = _quorum;
    }

    // calculate Quorum of the total current supply
    function quorumAmount() public view returns (uint256) {
        uint256 supply = totalSupply();
        return (supply / 100) * _quorumPercentage;
    }

    // Update Token amounts by amount staked
    function setAmountStakedByAddress(
        address[] memory _validators,
        uint256[] memory _amounts
    ) public onlyOwner returns (bool) {
        require(_validators.length == _amounts.length, "Lengths do not match");
        _totalSupply = 0;
        uint256 totalSupply;
        for (uint256 i = 0; i < _validators.length; i++) {
            _balances[_validators[i]] = _amounts[i];
            totalSupply += _amounts[i];
        }
        _totalSupply = totalSupply;

        emit AmountsUpdated(true, totalSupply, _validators.length);
        return true;
    }

    // Functions from the ERC20 standard that will revert if called..
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        revert("Transfer Function not available");
        return false;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        revert("Transfer Function not available");
        return false;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        revert("Approve Function not available");
        return false;
    }

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256 remaining)
    {
        revert("allowance Function not available");
        return 0;
    }

    // Unused Events from the ERC20 standard
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
}
