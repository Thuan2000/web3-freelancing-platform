const path = require("path");

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ JobMarketplace: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("JobMarketplace");

  fs.writeFileSync(
    path.join(contractsDir, "JobMarketplace.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

/**
 * This script will do 3 things:
 * Step 1: deploy the smart contract.
 * Step 2: send some ETHs to the accounts.
 * Step 3: seed the data. (not done yet)
 */
async function main() {
  const [deployer, account1] = await ethers.getSigners();

  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  const JobMarketplace = await ethers.getContractFactory("JobMarketplace");
  const jobMarketplace = await JobMarketplace.deploy();

  console.log("✍️ Contract address:", jobMarketplace.address);
  saveFrontendFiles(jobMarketplace);

  const receivers = [
    "0xed04199cED60602756A8191e8ce1d48b1Ad210F4", // Account 1
    "0x96f25dF936E6425e053Ff268Ce6B66CB485abba4", // Account 2
    "0xAfb7455603E77bC10Bf6695EC186fb0d9EaF7ECD", // Account 3
    "0xbE8B349920679664dA2728dE02b8658c31457F39", // Account 4
    "0x4DD95718BEA42F19C3838389B8f9a2036Ad8F765", // Account 5
    "0xeaF09AE0397DF0b8bca13AD4a29a6aa943bC1e4f", // Account 6
    "0xBAFc66CC19dA5138189631f264dFCA468206f728", // Account 7
    "0xC1f8597372851d18Ec0CeB3d96073a4A6ea7b425", // Account 8
    "0x1FA22E5fae5f0E5F5Bf0BC07792fb901439FE48e", // Account 9
    "0x199FeF4Cc9f5A3Ff4432FfD9A8585B11a3108473", // Account 10
    "0x851dA9a9Ea51de688De83b3F5d9eA222FaC5dAC7", // Account 11
    "0x2E4B411bc522c387ACE49316B89392d4Bb374E4E", // Account 12
    "0x8DE1c165e0FB1B87220F33C3BA2f397daEC8e370", // Account 13
    "0x35e255Aeb882d685D5B4c512Ac65285590cDD59a" // Account 14
  ];

  const amountInEther = "50";
  const transactions = receivers.map(async (receiver) => {
    console.log(`Sending ${amountInEther} ETH from ${deployer.address} to ${receiver}`);

    const tx = await deployer.sendTransaction({
      to: receiver,
      value: ethers.utils.parseEther(amountInEther),
    });

    await tx.wait(); // Wait for the transaction to be mined
    return tx;
  });
  // Execute all transactions in parallel and wait for them to be confirmed
  const transactionReceipts = await Promise.all(transactions);

  transactionReceipts.forEach((tx, index) => {
    console.log(`Transaction ${index + 1} hash: ${tx.hash}`);
  });

  console.log("All ETH sent successfully");

  // TODO: Provide an example of posting a job with account #1. (note: come up with dummy security credentials if needed, I'll fill them later)
  /**
   * // Posting a job with account #1
    console.log("Posting a job with account #1");

    // Use account1 to interact with the contract
    const jobDescription = "Develop a full-stack dApp";
    const jobTitle = "Full-stack dApp Developer Needed";
    const jobPayment = ethers.utils.parseEther("10"); // Payment in ETH

    const registerTx = await jobMarketplace.connect(account1).registerUser("Account1");
    await registerTx.wait(); // Wait for the transaction to be mined

    const postJobTx = await jobMarketplace.connect(account1).postJob(jobDescription, jobTitle, { value: jobPayment });
    await postJobTx.wait(); // Wait for the transaction to be mined

    console.log("Job posted successfully with account #1");
   */
  // jobMarketplace.connect();

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });