// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EthToken is ERC20{
    mapping(address => uint) tokenMapping;
    address public owner;
    constructor() ERC20("EthToken", "ETKN") {
        owner=msg.sender;
    }
    function mint(address to, uint256 amount) public {
        require(tokenMapping[msg.sender]<10,"You have reached the maximum limit");
        require(amount<10,"Amount should be less than 10");
        _mint(to, amount);
        tokenMapping[msg.sender]+=amount;
    }
 }

