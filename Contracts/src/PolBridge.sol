// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {NonblockingLzApp} from "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";


interface  Token {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract PolygonBridge is NonblockingLzApp {
    address public tokenAddress;
    address public bridgeOwner;

    mapping(uint16 => bytes) public remoteLookup;
    
    event Mint(address indexed account, uint256 amount);
    event Burn(address indexed account, uint256 amount);
    
    constructor(
        address _tokenAddress,
        address _layerZeroEndpoint,
    ) NonblockingLzApp(_layerZeroEndpoint) Ownable(msg.sender) {
        tokenAddress = _tokenAddress;
        bridgeOwner = msg.sender;
    }

    // Mint tokens on Polygon when receiving messages from Ethereum
    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _from,
        uint64,
        bytes memory _payload
    ) internal override {
        require(keccak256(_from) == keccak256(remoteLookup[_srcChainId]), "Invalid sender");
        (address receiver, uint256 amount) = abi.decode(_payload, (address, uint256));

        Token(tokenAddress).mint(receiver, amount);
        emit Mint(receiver, amount);
    }

    // Burn tokens when sending back to Ethereum
    function burn(uint16 _dstChainId, address _receiver, uint256 _amount) external payable {
        require(Token(tokenAddress).balanceOf(msg.sender) >= _amount, "Insufficient balance");
        require(Token(tokenAddress).transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        Token(tokenAddress).burn(msg.sender, _amount);
        emit Burn(msg.sender, _amount);

        bytes memory payload = abi.encode(_receiver, _amount);
        _lzSend(
            _dstChainId,
            payload,
            payable(msg.sender),
            address(0),
            bytes(""),
            msg.value
        );
    }

    function changeEndpoint(address _tokenAddress, address _ethBridge, uint16 _dstChainId, bytes calldata _remoteAddress) public {
        require(msg.sender == bridgeOwner, "Not a valid Owner");
        tokenAddress = _tokenAddress;
        remoteLookup[_dstChainId] = _remoteAddress;
    }
}
