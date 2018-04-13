var WagerFactory = artifacts.require("./WagerFactory.sol");

contract('WagerFactory', function(accounts) {

  it("...deploys a wager", function() {
    return WagerFactory.deployed().then(function(instance) {
      wagerFactoryInstance = instance;
      return wagerFactoryInstance.offerWager({value: 100, from: accounts[1], gas: 3000000});
    }).then(function(result) {
      return wagerFactoryInstance.getWagersCount();
    }).then(function(length){
      assert.equal(length, 1, 'There is no wagers§.')
    });
  });
});
