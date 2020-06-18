const FonaToken = artifacts.require("FonaToken");

module.exports = function(deployer) {
  deployer.deploy(FonaToken);
};