const {network, ethers} = require('hardhat');
const { developmentChains } = require('../helper-hardhat.config');
const BASE_FEE = ethers.utils.parseEther('0.25')
const GAS_PRICE_LINK = 1e9;
const DECIMALS ='18';
const INITAL_PRICE = ethers.utils.parseUnits('2000', 'ether')
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
        await deploy('MockV3Aggregator', {
            from: deployer,
            log:true,
            args: [DECIMALS, INITAL_PRICE]
        })
        log('Mock Deployed')
        log('-----------------------------------')
    }
    
}
module.exports.tags = ['all', 'mocks']