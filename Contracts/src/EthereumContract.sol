// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


// ETKN Contract - Anyone can mint
contract ETKN is ERC20 {
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10**18;
    constructor() ERC20("Ethereum Token", "ETKN") {}

    function mint(address to, uint256 amount) external {
        require(amount<100,"Amount should be less than 100");
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}

// EBridge Contract - Locks ETKN and sends message to Polygon for minting PTKN
contract EBridge is NonblockingLzApp {
    address public etkn;
    address public pBridge;
    mapping(address => uint256) public lockedAmounts;
    mapping(address => uint256) public lockTimestamps;


    event Locked(address indexed user, uint256 amount);
    event Unlocked(address indexed user, uint256 amount);
    event Refund(address indexed user, uint256 amount);
    event TrustedPBridgeSet(bytes trustedPBridge);


    constructor(address _lzEndpoint, address _etkn) NonblockingLzApp(_lzEndpoint) Ownable(msg.sender) {
        etkn = _etkn;
    }

    function setPBridge(address _pBridge) external onlyOwner {
        pBridge = _pBridge;
    }
    function setTrustRemote(uint16 _chainId, bytes memory _trustedRemote) public onlyOwner() {
        trustedRemoteLookup[_chainId] = _trustedRemote;
    }

    function lock(uint16 _dstChainId, uint256 amount) external payable {
        require(pBridge != address(0), "PBridge not set");
        require(IERC20(etkn).balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(IERC20(etkn).allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");
        require(IERC20(etkn).transferFrom(msg.sender, address(this), amount), "Transfer failed");

        lockedAmounts[msg.sender] += amount;
        lockTimestamps[msg.sender] = block.timestamp;
        emit Locked(msg.sender, amount);

        bytes memory payload = abi.encode(msg.sender, amount);
        _lzSend(
            _dstChainId,
            payload,
            payable(msg.sender),
            address(0),
            bytes(""),
            msg.value
        );
    }

    function _nonblockingLzReceive(uint16, bytes memory _srcAddress, uint64, bytes memory payload) internal override {
        require(keccak256(_srcAddress) == keccak256(abi.encodePacked(pBridge)), "Only PBridge can unlock");
        (address user, uint256 amount) = abi.decode(payload, (address, uint256));

        IERC20(etkn).transfer(user, amount);
        emit Unlocked(user, amount);
    }

    function refund() external {
        uint256 amount = lockedAmounts[msg.sender];
        require(amount > 0, "No locked amount to refund");
        require(block.timestamp >= lockTimestamps[msg.sender] + 1 hours, "Wait for 1 hour before refund");
        IERC20(etkn).transfer(msg.sender, amount);
        lockedAmounts[msg.sender] = 0;
        emit Refund(msg.sender, amount);
    }
}