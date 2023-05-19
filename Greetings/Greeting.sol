// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;


contract Greeter {
    string private greeting;

    constructor(string memory defaultMessage){
       greeting = defaultMessage;
    }

    // First function: returns a greet
    function greet() public view returns (string memory){
        return greeting;
    }

    // Function: this will allow us to change the greeting message
    function setGreeting(string memory newMessage) public {
        greeting = newMessage;
    }

}




