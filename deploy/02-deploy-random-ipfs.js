const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat.config");
const { storeImages, storeTokenUriMetaData } = require("../utils/uploadToPinata");
const imagesLocation = './images/randomNft'
let tokenUris;
const FUND_ME_AMOUNT = ethers.utils.parseEther('10')
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
  console.log(chainId)
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
    const txReceipt = await tx.wait(1);
    subscriptionId = txReceipt.events[0].args.subId;
    await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_ME_AMOUNT)
  }else{
    VRFCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
  }
  log('---------------------------------------')
  await storeImages(imagesLocation)
  const args = [VRFCoordinatorV2Address, subscriptionId, networkConfig[chainId].gasLane,  networkConfig[chainId].callbackGasLimit,tokenUris, networkConfig[chainId].mintFee,]
  const randomIpfsNft = await  deploy('RandomIpfsNft', {
    from: deployer,
    args,
    log:true,
    waitConfirmations: network.config.blockConfirmations || 1
  })
  log('----------------------------------')
};

async function handleTokenUris(){
    tokenUris = []
    const {responses: imageUploadResponses, files} = await storeImages(imagesLocation)
    for (image in imageUploadResponses){
      let tokenUriMetaData = {...metadataTemplate}
      tokenUriMetaData.name = files[image].replace('.png', '')
      tokenUriMetaData.description = `An Adorable ${tokenUriMetaData.name} pup!`
      tokenUriMetaData.image = `ipfs://${imageUploadResponses[image].IpfsHash}`
      const metadata = await storeTokenUriMetaData(tokenUriMetaData)
      tokenUris.push(`ipfs://${metadata.IpfsHash}`)

    }
    console.log(tokenUris)
    return tokenUris
 
}
module.exports.tags = ['all', 'ra']