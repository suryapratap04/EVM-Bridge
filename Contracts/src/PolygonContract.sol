// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// PTKN Contract - Only PBridge can mint/burn
contract PTKN is ERC20 {
    address public pBridge;
    address public bOwner;

    constructor() ERC20("Polygon Token", "PTKN")  {
        bOwner=msg.sender;
    }

    function setPBridge(address _pBridge) external {
        require(msg.sender == bOwner, "Only bOwner can set PBridge");
        pBridge = _pBridge;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == pBridge, "Only PBridge can mint");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == pBridge, "Only PBridge can burn");
        _burn(from, amount);
    }
}

interface Token {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;

}

// PBridge Contract - Mints PTKN upon receiving LayerZero message and burns for returning to Ethereum
contract PBridge is NonblockingLzApp {
    address public ptkn;
    address public eBridge;

    event Minted(address indexed user, uint256 amount);
    event Burned(address indexed user, uint256 amount);

    constructor(address _lzEndpoint, address _ptkn) NonblockingLzApp(_lzEndpoint) Ownable(msg.sender) {
        ptkn = _ptkn;
    }

    function setEBridge(address _eBridge) external onlyOwner {
        eBridge = _eBridge;
    }

    function setTrustRemote(uint16 _remoteChainId, bytes memory _trustedRemote) public onlyOwner() {
        trustedRemoteLookup[_remoteChainId] = _trustedRemote;
    }

    function _nonblockingLzReceive(uint16, bytes memory _srcAddress, uint64, bytes memory payload) internal override {
        require(keccak256(_srcAddress) == keccak256(abi.encodePacked(eBridge)), "Only EBridge can mint");
        (address user, uint256 amount) = abi.decode(payload, (address, uint256));
        Token(ptkn).mint(user, amount);
        emit Minted(user, amount);
    }

    function burn(uint16 _dstChainId,uint256 amount) external payable {
        Token(ptkn).burn(msg.sender, amount);
        bytes memory payload = abi.encode(msg.sender, amount);
        _lzSend(_dstChainId, payload, payable(msg.sender), address(0), bytes(""), msg.value);
        emit Burned(msg.sender, amount);
    }
}
