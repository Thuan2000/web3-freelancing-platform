async function main() {
  const [deployer] = await ethers.getSigners();

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
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});