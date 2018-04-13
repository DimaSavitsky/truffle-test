pragma solidity ^0.4.21;

contract Wager {
    bool public pending;
    address public judge;
    address public initiator;
    address public acceptor;
    uint public amount;

    event WagerProposed(address initiator, address judge, uint amount);
    event WagerTaken(address acceptor, uint amount);

    function Wager(address initiatorAdress, address trustedAddress) public payable {
      require(msg.value > 0);
      require(initiatorAdress != trustedAddress);
      amount = msg.value;
      pending = true;
      initiator = initiatorAdress;
      judge = trustedAddress;

      emit WagerProposed(initiator, judge, amount);
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
      emit WagerProposed(initiator, judge, amount);
    }

    function changeAmount(uint newAmount) public payable onlyInitiator onlyPending {
      require (newAmount < amount || (newAmount == amount + msg.value));
      if (newAmount < amount) {
        initiator.transfer(amount - newAmount);
      }
      amount = newAmount;
      emit WagerProposed(initiator, judge, amount);
    }

    function takeWager() public payable onlyPending {
      require(msg.value == amount);
      acceptor = msg.sender;
      pending = false;
      emit WagerTaken(acceptor, amount);
    }

    function pickWinner(bool initiatorWon) public onlyNotPending onlyJudge {
      address winnerAddress = initiatorWon ? initiator : acceptor;
      winnerAddress.transfer(address(this).balance);
      pending = true;
    }
}
