#!/bin/bash

# Navigate to the Hardhat project directory
cd /home/azureuser/web3lancer

# Start the Hardhat node, binding to all interfaces
npx hardhat node --hostname 0.0.0.0
# The command is: "pm2 start hardhat-node.sh --name hardhat-node"