task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  console.log('Here it is:')
  console.log(accounts[0]);
  // for (const account of accounts) {
  //   console.log(account.address);
  // }
});