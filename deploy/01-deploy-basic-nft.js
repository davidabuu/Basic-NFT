const { deployments,network, getNamedAccounts } = require("hardhat");

module.exports = async () => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log('-----------------------')
  const args = []
  const basicNft = await deploy('BasicNft', {
    from:deployer,
    args,
    log:true,
    waitConfirmations: network.config.blockConfirmations || 1
  })
  log('----------------------------------------')
};
