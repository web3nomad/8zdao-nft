// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

import "forge-std/Test.sol";
import "../src/NFT8ZDAO.sol";
import "../src/NFT8ZDAORenderer.sol";

contract ContractTest is Test {
    NFT8ZDAO nft8ZDAO;
    NFT8ZDAORenderer nft8ZDAORenderer;
    address constant EOA1 = address(uint160(uint256(keccak256('user account 1'))));

    function setUp() public {
        nft8ZDAORenderer = new NFT8ZDAORenderer();
        nft8ZDAO = new NFT8ZDAO(address(nft8ZDAORenderer));
        hoax(EOA1, 10 ether);
    }

    function testExample() public {
        assertTrue(true);
    }

    function testMint() public {
        vm.prank(EOA1, EOA1);
        nft8ZDAO.mint{value: 0.1 ether}();
    }

    function testTokenURI() public {
        vm.startPrank(EOA1, EOA1);
        for (uint256 i=0; i<70; ++i) {
            nft8ZDAO.mint{value: 0.1 ether}();
        }
        emit log(nft8ZDAO.tokenURI(1));
        emit log(nft8ZDAO.tokenURI(10));
        emit log(nft8ZDAO.tokenURI(11));
        emit log(nft8ZDAO.tokenURI(61));
        emit log(nft8ZDAO.tokenURI(70));
    }

    function testMintOut() public {
        vm.startPrank(EOA1, EOA1);
        for (uint256 i=0; i<70; ++i) {
            nft8ZDAO.mint{value: 0.1 ether}();
        }
        vm.expectRevert("Only 70 8ZDAO NFT");
        nft8ZDAO.mint{value: 0.1 ether}();
    }
}
