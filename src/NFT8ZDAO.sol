// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate/tokens/ERC721.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";
import "openzeppelin-contracts/contracts/utils/Base64.sol";

contract NFT8ZDAO is ERC721 {
    uint256 public currentTokenId;

    string[] private TIAN_GAN = [
        unicode"甲",
        unicode"乙",
        unicode"丙",
        unicode"丁",
        unicode"戊",
        unicode"己",
        unicode"庚",
        unicode"辛",
        unicode"壬",
        unicode"癸"
    ];

    string[] private DI_ZHI = [
        unicode"寅",
        unicode"卯",
        unicode"辰",
        unicode"巳",
        unicode"午",
        unicode"未",
        unicode"申",
        unicode"酉",
        unicode"戌",
        unicode"亥",
        unicode"子",
        unicode"丑"
    ];

    constructor() ERC721("8Z DAO", "8Z") {}

    function mintTo(address recipient) public payable returns (uint256) {
        require(currentTokenId < 60, "Only 60 8Z NFT");
        uint256 newItemId = ++currentTokenId;
        _safeMint(recipient, newItemId);
        return newItemId;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_ownerOf[tokenId] != address(0), "ERC721Metadata: URI query for nonexistent token");
        string memory tiangan = TIAN_GAN[(tokenId - 1) % 10];
        string memory dizhi = DI_ZHI[((tokenId - 1) + 10) % 12];
        string memory word = string(abi.encodePacked(tiangan, dizhi));
        string[6] memory parts;
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: sans-serif; font-size: 128px; text-anchor: middle; dominant-baseline: middle; }</style><rect width="100%" height="100%" fill="black" />';
        parts[1] = '<text x="50%" y="50%" class="base" style="transform:translateX(-64px);">';
        parts[2] = tiangan;
        parts[3] = '</text><text x="50%" y="50%" class="base" style="transform:translateX(64px);">';
        parts[4] = dizhi;
        parts[5] = '</text></svg>';
        string memory svg = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]));
        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{"name": "',
            word,
            '", "description": "8Z #',
            Strings.toString(tokenId),
            '", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(svg)),
            '"}'
        ))));
        string memory output = string(abi.encodePacked('data:application/json;base64,', json));
        return output;
    }
}
