// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {NonblockingLzApp} from "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";

contract EthBridge is NonblockingLzApp {
    
    address public tokenAddress;
    address public bridgeOwner;

    mapping(address => uint256) public lockValue;
    mapping (address => uint256) public refundValue;
    mapping(uint16 => bytes) public  remoteLookup;


    event LockandSend(address indexed account,uint256 amount);
    event Unlock(address indexed account,uint256 amount);
    event Refund(address indexed account, uint256 amount);


    constructor(
        address _tokenAddress,
        address _layerZeroEndpoint
    ) NonblockingLzApp(_layerZeroEndpoint) Ownable(msg.sender) {
        tokenAddress = _tokenAddress;
        bridgeOwner = msg.sender;
    }
    
    // Approch Lock and Mint 
    // Lock
    function lock( uint16 _dstChainId, address _receiver,uint256 _amount) external payable {
        require(IERC20(tokenAddress).balanceOf(msg.sender) >= _amount, "Insufficient balance");
        require(IERC20(tokenAddress).allowance(msg.sender, address(this)) >= _amount, "Approve tokens first");
        require(IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount), "Token transfer failed");

        lockValue[msg.sender] += _amount;
        emit LockandSend(msg.sender, _amount);

        // Prepare LayerZero payload        
        bytes memory payload = abi.encode(_receiver, _amount);

        // Send message to Polygon bridge contract
        _lzSend(
            _dstChainId,
            payload,
            payable(msg.sender),
            address(0),
            bytes(""),
            msg.value
        );
    }
    // Unlock
    function _nonblockingLzReceive(uint16 _srcChainId, bytes memory _from, uint64, bytes memory _payload) internal override {
        require(keccak256(_from) == keccak256(remoteLookup[_srcChainId]), "Invalid sender");
        (address receiver, uint256 amount) = abi.decode(_payload, (address, uint256));

        require(lockValue[receiver] >= amount, "Insufficient locked balance");

        lockValue[receiver] -= amount;
        require(IERC20(tokenAddress).transfer(receiver, amount), "Unlock failed");

        emit Unlock(receiver, amount);
    }


    // refund 
    function refund(address to,uint256 amount) public payable  {
        require(refundValue[msg.sender] >= amount, "Insufficient refund balance");
        require(IERC20(tokenAddress).transfer(to, amount), "Refund failed");
        refundValue[msg.sender] -= amount;
        emit Refund(to, amount);
    }

    // function to change the values and addresses and laye zero endpoints
    function changeEndpoint(address _tokenAddress,uint16 _dstChainId, bytes calldata _remoteAddress) public {
        require(msg.sender==bridgeOwner,"Not a valid Owner");
        tokenAddress=_tokenAddress;
        remoteLookup[_dstChainId] = _remoteAddress;
    }
}

