# 8ZDAO NFT

## Forge

### Install

```bash
curl -L https://foundry.paradigm.xyz | bash
# This will download foundryup. Then install Foundry by running:
foundryup
```

### Compile

```bash
forge build
```

### Test

Run test with `-vv` to print logs

```bash
forge test -vv
```

### Gas report

Run testMintGasReport to mint 1 token and generate gas report for minting

```bash
forge test --match-test testMintGasReport --gas-report
```

### Install

```bash
forge install openzeppelin/openzeppelin-contracts@v4.4.2
forge install brockelmore/forge-std
```

### Deploy with Hardhat

Since remappings doesn't work with hardhat, I need change the dependencies structure to hardhat style and config remappings for Forge

```bash
yarn hardhat deploy --network rinkeby --tags nft
```

#### verify contracts

```bash
yarn hardhat etherscan-verify --network rinkeby
```

#### How to render base64 encoded svg for tokenURI
```
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
contract ERC721 {
    using Strings for uint256;
    function tokenURI(uint256 tokenId) public view returns (string memory) {
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
            tokenId.toString(),
            '", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(svg)),
            '"}'
        ))));
        string memory output = string(abi.encodePacked('data:application/json;base64,', json));
        return output;
    }
}
```
