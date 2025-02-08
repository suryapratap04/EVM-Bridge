// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20{
    address public owner;
    address public ownMint;
    constructor(address _ownMint) ERC20("PolToken", "PTKN") {
        owner=msg.sender;
        ownMint=_ownMint;
    }
    function mint(address to, uint256 amount) public {
        require(msg.sender==ownMint,"Not Have Permission to Mint");
        _mint(to, amount);
    }
    function burn(address from, uint256 amount) public {
        require(msg.sender==ownMint,"Not Have Permission to Burn");
        _burn(from, amount);
    } 
    function changeMintOwner(address _ownMint) public{
        require(msg.sender==owner,"Not a valid Owner");
        ownMint=_ownMint;
    }
}

