// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract OurToken is ERC20{
    constructor(uint256 initalSupply) ERC20("OurToken", "OT"){
        //The mint function is used to allow us to create Tokens
        //By default we dont't have any token so we have to mint it
        _mint(msg.sender, initalSupply);
    }
}