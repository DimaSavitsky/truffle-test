pragma solidity ^0.4.21;

contract Wager {
    bool public pending;
    address public judge;
    address public initiator;
    address public acceptor;
    uint public amount;

    function Wager(address initiatorAdress) public payable {
      require(msg.value > 0);
      require(initiatorAdress != msg.sender);
      amount = msg.value;
      pending = true;
      initiator = initiatorAdress;
      judge = msg.sender;
    }

    function viewConditions() public view returns (uint, address, address) {
      return (amount, judge, initiator);
    }

    modifier onlyPending() {
      require(pending);
      _;
    }

    modifier onlyNotPending() {
      require(!pending);
      _;
    }

    modifier onlyInitiator() {
      require(msg.sender == initiator);
      _;
    }

    modifier onlyJudge() {
      require(msg.sender == judge);
      _;
    }

    function changeJudge(address newAddress) public onlyInitiator onlyPending {
      require(newAddress != judge);
      judge = newAddress;
    }

    function changeAmount(uint newAmount) public payable onlyInitiator onlyPending {
      require (newAmount < amount || (newAmount == amount + msg.value));
      if (newAmount < amount) {
        initiator.transfer(amount - newAmount);
      }
      amount = newAmount;
    }

    function takeWager() public payable onlyPending {
      require(msg.value == amount);
      acceptor = msg.sender;
      pending = false;
    }

    function pickWinner(bool initiatorWon) public onlyNotPending onlyJudge {
      address winnerAddress = initiatorWon ? initiator : acceptor;
      winnerAddress.transfer(address(this).balance);
      pending = true;
    }
}
