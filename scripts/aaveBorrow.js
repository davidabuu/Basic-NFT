const { getNamedAccounts, ethers } = require("hardhat");
const { getWeth, AMOUNT } = require("./getWeth");

async function main() {
  await getWeth();
  const { deployer } = await getNamedAccounts();
  //Lending Pool Address 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
  const lendingPool = await getLendingPool(deployer);
  console.log(lendingPool.address);
  //Deposit
  const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  //Approve
  await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer);
  await approveErc20.deposit(wethTokenAddress, AMOUNT, deployer, 0);
  let { availableBorrowETH, totalDebtETH } = await getBorrowUserData(
    lendingPool,
    deployer
  );
  //Borrow Time
  const daiPrice = await getDaiPrice()
}
async function getDaiPrice() {
  const daiEthPriceFeed = await ethers.getContractAt(
    "AggregatorV3Interface",
    "0x773616E4d11A78F511299002da57A0a94577F1f4"
  );
  const price = (await daiEthPriceFeed.latestRoundData())[1];
  console.log("The Dai ETH Price is", price.toString());
}
async function getBorrowUserData(lendingPool, account) {
  const { totalCollateralEth, totalDebtETH, availableBorrowETH } =
    await lendingPool.getBorrowUserData(account);
  return {
    availableBorrowETH,
    totalDebtETH,
  };
}
async function getLendingPool(account) {
  const lendingPoolAddressProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5 ",
    account
  );
  const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    account
  );
  return lendingPool;
}
async function approveErc20(
  erc20Address,
  spenderAddress,
  amountToSpend,
  account
) {
  const erc20Token = await ethers.getContractAt(
    "IERC20",
    erc20Address,
    account
  );
  const tx = await erc20Token.approve(spenderAddress, amountToSpend);
  await tx.wait(1);
  console.log("Approved");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
