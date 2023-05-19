// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract  MyToken {
   string public name="KLOP";
   string public symbol="KLP";
   uint  public decimals=18;
   uint public totalSupply=10000;

   mapping (address=>uint) public balances;

   mapping (address => mapping (address=>uint)) public  allowance;

   event Transfer(address indexed from, address indexed to, uint amount);
   
   event Approval (address indexed owner, address indexed reciever, uint amount);
     
   constructor() {
       balances[msg.sender]= totalSupply;
       emit Transfer(address(0), msg.sender, totalSupply);
   }

   // Function for returning the ballacne of user

 function balanceOf(address checking) public  view returns (uint balance){
   return balances[checking];
 }
    // Function for approving the amout sent
 function approve (address reciever, uint amount) public returns (bool){
    allowance[msg.sender][reciever]=amount;
    emit Approval(msg.sender, reciever, amount);
    return true;
      }
      // Funciton for transfering an amount from owner of the contract
  function transfer(address reciever, uint amount) public  {
      require( balances[msg.sender] >= amount,"The amount that u want to transfer is greater than your balance");
      require(reciever != address(0),"Invalid adress");

      balances[msg.sender] -= amount;
      balances[reciever] +=amount;
      emit Transfer(msg.sender, reciever, amount);
  }
     // Function for transfering an amount between 2 addreses
  function transferFrom (address sender, address reciever, uint amount) public {
    require(reciever != address(0),"Invalid adress");
    allowance[sender][msg.sender] -= amount;
    balances[sender] -= amount;
    balances[reciever] += amount;
    emit Transfer(sender, reciever, amount);
  }    
}