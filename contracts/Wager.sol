pragma solidity ^0.4.21;

import "../ethereum-api/oraclizeAPI_0.5.sol";

contract Wager is usingOraclize {
    bool public pending;
    bool public resolved;
    address public judge;
    address public initiator;
    address public acceptor;
    address public winner;
    uint public amount;

    OraclizeAddrResolverI private OAR;

    function Wager(address initiatorAddress, address judgeAddress) public payable {
        require(msg.value > 0);
        require(initiatorAddress != judgeAddress);

        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);

        amount = msg.value;
        pending = true;
        resolved = false;
        initiator = initiatorAddress;
        judge = judgeAddress;
    }

    function viewConditions() public view returns (uint, address, address) {
        return (amount, judge, initiator);
    }

    modifier onlyPending() {
        require(!resolved);
        require(pending);
        _;
    }

    modifier onlyNotPending() {
        require(!resolved);
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
        require(msg.sender != initiator);
        require(msg.sender != judge);
        acceptor = msg.sender;
        pending = false;
    }

    function pickWinner() public payable onlyNotPending onlyJudge {
        oraclize_query("URL", "json(http://api.icndb.com/jokes/random).value.id");
    }

    function _callback(bytes32 , string result) public {
        require(msg.sender == oraclize_cbAddress());

        winner = (bytes(result).length / 2 == 1) ? initiator : acceptor;
        winner.transfer(address(this).balance);
        resolved = true;
    }
}
