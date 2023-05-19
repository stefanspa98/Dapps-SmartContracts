// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

//Importing the console.log package
import "../node_modules/hardhat/console.sol";

contract Greeter {
    string private greeting;

    constructor(string memory defaultMessage){
       console.log("Deploying the Greeter smart contract", defaultMessage);
       greeting = defaultMessage;
    }

    // First function: returns a greet
    function greet() public view returns (string memory){
        return greeting;
    }

    // Function: this will allow us to change the greeting message
    function setGreeting(string memory newMessage) public {
        console.log("Changing the Greeting message from %s to %s", greeting, newMessage);
        greeting = newMessage;
    }

}




