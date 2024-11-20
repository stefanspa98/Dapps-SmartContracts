// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DynamicNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter = 1; 
    
    struct Patent {
        string patentName;
        string ownerName;
        string expiryDate;
    }
    
    mapping(uint256 => Patent) public patents; 
    mapping(string => bool) public patentNames; 

    event PatentMinted(uint256 tokenId, string patentName, address owner);
    event PatentUpdated(uint256 tokenId, string ownerName, string expiryDate);

    constructor() ERC721("DynamicPatentNFT", "dNFT") Ownable(msg.sender) {}

    function mintNFT(string memory patentName) public returns (uint256) {
        require(!patentNames[patentName], "Patent name already exists");
        
        uint256 tokenId = _tokenIdCounter++;

        _mint(msg.sender, tokenId);

        patents[tokenId] = Patent({
            patentName: patentName,
            ownerName: "",
            expiryDate: ""
        });

        patentNames[patentName] = true;

        emit PatentMinted(tokenId, patentName, msg.sender);
        return tokenId;
    }

    function updatePatent(uint256 tokenId, string memory ownerName, string memory expiryDate) public {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only the owner can update");

        patents[tokenId].ownerName = ownerName;
        patents[tokenId].expiryDate = expiryDate;

        emit PatentUpdated(tokenId, ownerName, expiryDate);
    }

    function getPatentDetails(uint256 tokenId) public view returns (Patent memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return patents[tokenId];
    }
}
