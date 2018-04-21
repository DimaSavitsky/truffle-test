pragma solidity ^0.4.21;

import './Wager.sol';

contract WagerFactory {
    address public factoryOwner;
    address[] public wagers;
    uint8 public testValue;

    function WagerFactory() public {
        factoryOwner = msg.sender;
        testValue = 0;
    }

    function getWagersCount() public view returns(uint) {
        return wagers.length;
    }

    function incrementTestValue() public {
        testValue = testValue + 1;
    }

    function offerWager() public payable {
        require(msg.sender != factoryOwner);
        Wager newWager = (new Wager).value(msg.value)(msg.sender, factoryOwner);
        wagers.push(address(newWager));
    }
}
