
// SPDX-License-Identifier: SEE LICENSE IN LICENSE

pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721.sol";
import "base64-sol/base64.sol";
contract DynamicSvgNft is ERC721{
    uint256 private s_tokenCounter;
    string private immutable i_lowSvg;
    string private immutable i_highSvg;
    string private constant base64EncodedSvgPrefix = "data:image/svg+xml;base64,";
    constructor(string memory lowSvg, string memory highSvg)ERC721("DynamicSvgNft","DSN"){
        s_tokenCounter = 0;
        i_highSvg =highSvg;
        i_lowSvg = lowSvg;
    }
    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter+= s_tokenCounter;
    } 
      function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function svgToImageUrl(string memory svg) public pure returns (string memory){
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string(abi.encodePacked((base64EncodedSvgPrefix, svgBase64Encoded)));
    }
function tokenURI (uint256 tokenId) public view override returns (string memory){
    require(_exists(tokenId), "URI Query for nonexistent token");
      return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name(), // You can add whatever name here
                                '", "description":"An NFT that changes based on the Chainlink Feed", ',
                                '"attributes": [{"trait_type": "coolness", "value": 100}], "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
}
}