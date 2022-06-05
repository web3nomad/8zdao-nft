// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "../src/NFT8ZDAO.sol";

contract ContractTest is DSTest {
    address constant EOA1 = address(uint160(uint256(keccak256('user account 1'))));
    NFT8ZDAO nft8ZDAO;

    function setUp() public {
        nft8ZDAO = new NFT8ZDAO();
    }

    function testExample() public {
        assertTrue(true);
    }

    function testMint() public {
        nft8ZDAO.mintTo(EOA1);
    }

    function testTokenURI() public {
        for (uint256 i=0; i<60; ++i) {
            nft8ZDAO.mintTo(EOA1);
        }
        string memory tokenURI;
        for (uint256 i=1; i<=60; ++i) {
            tokenURI = nft8ZDAO.tokenURI(i);
            // emit log(tokenURI);
        }
    }
}
