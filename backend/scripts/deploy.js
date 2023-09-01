async function main() {

   const [deployer] = await ethers.getSigners();

   console.log("Deploying contracts with the account:", deployer.address);

   console.log("Account balance:", (await deployer.getBalance()).toString());
   
   const serviceInUse = await ethers.getContractFactory("serviceInUse");

   // Start deployment, returning a promise that resolves to a contract object
   const contract = await serviceInUse.deploy();
   console.log("Contract deployed to address:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });