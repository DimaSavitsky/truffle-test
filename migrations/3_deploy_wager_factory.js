var WagerFactory = artifacts.require("./WagerFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(WagerFactory);
};
