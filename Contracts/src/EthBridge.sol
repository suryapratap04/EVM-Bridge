// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract EthBridge {
    address public tokenAddress;

    mapping(address => uint256) public lockValue;
    mapping (address => uint256) public refundValue;

    event LockandSend(address indexed account,uint256 amount);
    event FailToken(address indexed account,uint256 ammount);
    event Unlock(address indexed account,uint256 amount);

    constructor(address _tokenAddress){
        tokenAddress=_tokenAddress;
    }
    // Approch Lock and Mint 
    // Lock
    function lock(address _tokenAddress, uint256 amount) public payable {
        require(tokenAddress==_tokenAddress,"Invalid token address");
        require(IERC20(tokenAddress).balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(IERC20(tokenAddress).allowance(msg.sender, address(this)) >= amount);
        require(IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount));

        lockValue[msg.sender]+=amount;
        emit LockandSend(msg.sender, amount);
        // Performe the layerZero for transfering function call to polygon chain and refund if fails 
        
        if(1!=0){ //if transfer fails
            emit FailToken(msg.sender,amount);
            refundValue[msg.sender]+=amount;
            // revert the transaction
        }
    }
    // Unlock
    // layerzero implementation for receiving the calling function from polugon chain
    function withDraw(address to, uint256 amount) public payable  {
        // check that it comes or call by layerzero 
        require(lockValue[to]<=amount,"Insufficient Balance");

        IERC20(tokenAddress).transfer(to,amount);
        emit Unlock(to, amount);
    }
    // refund 
    function refund(address to,uint256 amount) public payable  {
        require(refundValue[msg.sender]>=lockValue[msg.sender],"insufficient Balance");
        IERC20(tokenAddress).transfer(to,amount);
    }

    // function to change the values and addresses and laye zero endpoints

}

