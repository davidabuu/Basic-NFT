const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat.config");
const { storeImages } = require("../utils/uploadToPinata");
const imagesLocation = './images/randomNft'
const metadataTemplate = {
    name:'',
    description:'',
    image:'',
    attributes: [
        {
            trait_type:'Cuteness',
            value:100,
        }
    ]
}
module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  if(process.env.UPLOAD_TO_PINATA == 'true'){
    tokenUris = await handleTokenUris()
  }
  let VRFCoordinatorV2Address, subscriptionId;
  if (developmentChains.includes(network.name)) {
    const VRFCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    VRFCoordinatorV2Address = VRFCoordinatorV2Mock.address;
    const tx = await VRFCoordinatorV2Mock.createSubscription();
    const txReceipt = tx.wait(1);
    subscriptionId = txReceipt.events[0].args.subId;
  }else{
    VRFCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
  }
  log('---------------------------------------')
  await storeImages(imagesLocation)
  const args = [VRFCoordinatorV2Address, subscriptionId, networkConfig[chainId].gasLane,  networkConfig[chainId].callbackGasLimit, networkConfig[chainId].mintFee,]
};

async function handleTokenUris(){
 
}
module.exports.tags = ['all', 'ra']