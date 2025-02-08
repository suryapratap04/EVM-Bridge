// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


interface IToken{
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

contract PolBridge {
    address public tokenAddress;

    mapping (address => uint256) tokenAmount;
    // layerzero implementation for receiving from eth
    function mint(address to , uint256 amount)public{
        // check that only call from the eth bridge
        IToken(tokenAddress).mint(to, amount);
        tokenAmount[to]+=amount;
    }


    function burn(address from , uint256 amount) public {
        require(tokenAmount[msg.sender]>=amount,"Insufficient Tokens");
        // check certain checkpoints
        IToken(tokenAddress).burn(from,amount);
        // layer zero implementation for unlock the token on eth side 
    }
}

