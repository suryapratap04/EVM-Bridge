// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20{
    mapping(address => uint) tokenMapping;
    address public owner;
    constructor() ERC20("EthToken", "ETKN") {
        owner=msg.sender;
    }
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
 }

