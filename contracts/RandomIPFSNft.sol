
// SPDX-License-Identifier: SEE LICENSE IN LICENSE

pragma solidity ^0.8.7;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
error RandomIpfsNft__RangeOutOfBound();
error RandomIpfsNft__NotEnoughEthPaid();
contract RandomIpfsNft is VRFConsumerBaseV2, ERC721URIStorage, Ownable {
    //Users have to pay to mint an NFT
    //uint256 internal immutable i_mintFee;
    //Type Declaration
    enum Breed {
      PUG, 
      SKIBA_TNU,
      ST_BERNARD
    }
    string[] internal s_dogTokenUris;
    //Chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
     bytes32 private immutable i_gasLane;
  uint64 private immutable i_subscriptionId;
  uint16 private constant REQUEST_CONFRIMATIONS = 3;
  uint32 private immutable i_callbackGasLimit;
  uint32 private constant NUM_WORDS = 1;
  uint256 internal immutable i_mintFee;
   //VRF Helpers
   mapping (uint256 => address) s_requestIdToSender;
   uint256 public s_tokenCounter;
   uint256 internal constant MAX_CHANCE_VALUE = 100;
  constructor(
    address vrfCoordinatorV2,
    uint256 entranceFee,
    bytes32 gasLane,
    uint64 subscriptionId,
    uint32 callbackGasLimit,
    uint256 interval,
    uint256 mintFee,
    string[3] memory tokenUris
  ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("DogNft", "DOG") {
    i_mintFee = mintFee;
    i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
    i_gasLane = gasLane;
    s_dogTokenUris =  tokenUris;
   
    //The subscription Id will be used for funding the request
    i_subscriptionId = subscriptionId;
    i_callbackGasLimit = callbackGasLimit;

  }
    function requestNft() public payable returns (uint256 requestId){
      if(msg.value < i_mintFee){
        revert RandomIpfsNft__NotEnoughEthPaid();
      }
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, i_subscriptionId, REQUEST_CONFRIMATIONS, i_callbackGasLimit, NUM_WORDS
        );
        s_requestIdToSender[requestId] = msg.sender;  
    }
    function fulfillRandomWords(uint256 requestId, uint256 [] memory randomWords) internal override{
        address dogOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
    
        uint256 moddeRng = randomWords[0] % MAX_CHANCE_VALUE;
        Breed dogBreed = getBreedFromModdedRng((moddeRng));
            _safeMint(dogOwner, newTokenId);
            _setTokenURI(newTokenId, s_dogTokenUris[uint256(dogBreed)]);
    }
    function getBreedFromModdedRng(uint256 moddedRng) public pure returns (Breed){
      uint256 cumulativeSum = 0;
      uint256[3] memory chanceArray = getChanceArray();
      for(uint256 i = 0; i < chanceArray.length; i++){
        if(moddedRng >= cumulativeSum && moddedRng < cumulativeSum + chanceArray[i]){
          return Breed(i);
        }
        cumulativeSum += chanceArray[i];
      }
      revert RandomIpfsNft__RangeOutOfBound(); 
    }
    function getChanceArray() public pure returns(uint256[3] memory){
      return [10, 30, MAX_CHANCE_VALUE];
    }
    function tokenURI(uint256) public view override returns(string memory) {}
 }