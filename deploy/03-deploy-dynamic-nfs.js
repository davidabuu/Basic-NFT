const { deployments, network, getNamedAccounts, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat.config");
const fs = require("fs");
module.exports = async () => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let ethUsdPriceAddress;
  if (developmentChains.includes(network.name)) {
    const EthUsdAggregator = await ethers.getContract("MockV3Aggregator");
    ethUsdPriceAddress = EthUsdAggregator.address;
  } else {
    ethUsdPriceAddress = networkConfig[chainId].ethUsdPrice;
  }
  log('---------------------------------')
  const lowSvg = await fs.readFileSync("./images/dynamicNft/frown.svg", {
    encoding: "utf-8",
  });
  const highSvg = await fs.readFileSync("./images/dynamicNft/happy.svg", {
    encoding: "utf-8",
  });
  const args = [ethUsdPriceAddress, lowSvg, highSvg];
  const dynamicNft = await deploy("DynamicSvgNft", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
};

module.exports.tags = ['all', 'dynamicSvg', 'main']