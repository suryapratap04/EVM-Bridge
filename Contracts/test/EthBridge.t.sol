// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/EthBridge.sol";
import "../src/EthToken.sol";

contract TestBridge is Test {
    EthBridge bridge;
    EthToken token;
    address constant LZ_ENDPOINT = address(0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675);

    function setUp() public {
        token = new EthToken();
        bridge = new EthBridge(
            address(token),
            LZ_ENDPOINT,
            address(0x1234)  // mock polygon bridge address
        );
    }
} 