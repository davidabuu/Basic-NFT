const { getNamedAccounts } = require("hardhat");
const { getWeth } = require("./getWeth");

async function main() {
  await getWeth();
  const { deployer } = await getNamedAccounts();
  //Lending Pool Address 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  async  function getLendingPool() {

  }