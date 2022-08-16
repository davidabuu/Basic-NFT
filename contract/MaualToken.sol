// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

contract ManualToken {
     mapping(address => uint256) public balanceOf;
     mapping(address => mapping(address => uint256)) public allowance;
     function _transfer(address from, address to, uint256 amount) public{
        balanceOf[from] = balanceOf[from] - amount;
        balanceOf[to] += amount;
     }
     function transferForm() public {

     }
}