// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./MetadataStorage.sol";

contract NFTMetadata is
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Burnable,
    Ownable,
    MetadataStorage
{
    //URI contract
    string private _contractUri;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        super.transferOwnership(msg.sender);
    }

    function safeMint(
        address to,
        uint256 tokenId,
        string memory uri
    ) public onlyOwner {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function safeMintMetadata(
        address to,
        uint256 tokenId,
        MetadataLibrary.Property[] memory properties,
        MetadataLibrary.Attribute[] memory attributes
    ) public onlyOwner {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, "");
        super.addProperties(tokenId, properties);
        super.addAttributes(tokenId, attributes);
    }

    function reloadTokenURI(uint256 tokenId, string calldata _uri) public {
        string memory uri;

        if (bytes(_uri).length == 0) {
            uri = getMetadataJSON(tokenId);
        } else {
            uri = _uri;
        }
        _setTokenURI(tokenId, uri);
    }

    //contract uri
    function setContractURI(string memory contractURi) public onlyOwner {
        _contractUri = contractURi;
    }

    function contractURI() public view returns (string memory) {
        return _contractUri;
    }

    // -----------------------------------------------------------------------

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        //super.tokenURI(tokenId);
        string memory uri;
        uri = getMetadataJSON(tokenId);
        return uri;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
