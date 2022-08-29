const {network, ethers} = require('hardhat');
const { developmentChains } = require('../helper-hardhat.config');
const BASE_FEE = ethers.utils.parseEther('0.25')
const GAS_PRICE_LINK = 1e9;
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts()
    console.log(deployer)
    const args = [BASE_FEE, GAS_PRICE_LINK]
    if(developmentChains.includes(network.name)){
        log('Local Network Detected! Deploy Mocks')
        await deploy('VRFCoordinatorV2Mock', {
            from: deployer,
            args,
            log:true
        })
        log('Mock Deployed')
        log('-----------------------------------')
    }
    
}
module.exports.tags = ['all', 'mocks']