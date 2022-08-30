const pinataSDK = require('@pinata/sdk');
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const pinataApiKey = process.env.PINATA_API_KEY;
const pinatsApiSecret = process.env.PINATA_API_SECRET;
const pinata = pinataSDK(pinataApiKey, pinatsApiSecret);
async function storeImages(imagesFilePath) {
  const fullImagesPath = path.resolve(imagesFilePath);
  const files = fs.readdirSync(fullImagesPath);
  let responses = [];
  console.log("Uploading To IPFS", files);
  for (fileIndex in files) {
    console.log(`Working on ${fileIndex}.....`)
    const readableStreamForFile = fs.createReadStream(
      `${fullImagesPath}/${files[fileIndex]}`
    );
    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile);
      responses.push(response);
    } catch (error) {
      console.log(error);
    }
  }
  return { responses, files };
}
async function storeTokenUriMetaData(metadata){
  try {
    const response = await pinata.pinJSONToIPFS(metadata)
    return response
  } catch (error) {
    console.log(error)
  }
  return null
}
module.exports = { storeImages, storeTokenUriMetaData };
