// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/EthToken.sol";

contract TestContract is Test {
    EthToken c;

    function setUp() public {
        c = new EthToken();
    }

    function testMint() public {
        c.mint(address(this), 5);
        assertEq(c.balanceOf(address(this)), 5 ,"ok");
        assertEq(c.balanceOf(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f), uint256(0) ,"ok");

        c.mint(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f, 5);
        assertEq(c.balanceOf(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f), 5, "ok");
    }

    function testTransfer() public {
        c.mint(address(this), 5);
        c.transfer(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f, 2);
        
        assertEq(c.balanceOf(address(this)), 3);
        assertEq(c.balanceOf(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f), 2);

        vm.prank(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f);
        c.transfer(address(this), 2);

        assertEq(c.balanceOf(address(this)), 5);
        assertEq(c.balanceOf(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f), 0);
    }

    function testApprovals() public {
        c.mint(address(this), 5);

        c.approve(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f, 1);

        assertEq(c.allowance(address(this), 0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f), 1);
        assertEq(c.allowance(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f, address(this)), 0);
        
        vm.prank(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f);
        c.transferFrom(address(this), 0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f, 1);

        assertEq(c.balanceOf(address(this)), 4, "ok");
        assertEq(c.balanceOf(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f), 1, "ok");
    }

    function testFailApprovals() public {
        c.mint(address(this), 5);
        c.approve(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f, 3);
        
        vm.prank(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f);
        c.transferFrom(address(this), 0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f, 100);
    }

    function testFailTransfer() public {
        c.mint(address(this), 20);
        c.transfer(0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f, 100);
    }
}
