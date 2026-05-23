require("dotenv").config();
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment...\n");

  // Get the connected signer
  const [deployer] = await hre.ethers.getSigners();
  console.log(`📦 Deploying contract from address: ${deployer.address}`);

  // Get account balance
  const balance = await deployer.provider.getBalance(deployer.address)
  console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} ETH\n`);

  // Deploy the SecureVoting contract
  console.log("📝 Deploying SecureVoting contract...");
  const SecureVoting = await hre.ethers.getContractFactory("SecureVoting");
  
  
  const secureVoting = await SecureVoting.deploy(deployer.address);
  await secureVoting.waitForDeployment();

  const votingAddress = await secureVoting.getAddress();
  console.log(`✅ SecureVoting deployed to: ${votingAddress}\n`);

 
  const deploymentTx = secureVoting.deploymentTransaction();
  console.log(`📋 Deployment Transaction Hash: ${deploymentTx.hash}`);
  console.log(`⛽ Gas Used: ${deploymentTx.gasLimit.toString()}\n`);

  
  const deploymentInfo = {
    network: hre.network.name,
    contractName: "SecureVoting",
    contractAddress: votingAddress,
    deployerAddress: deployer.address,
    deploymentHash: deploymentTx.hash,
    timestamp: new Date().toISOString(),
    blockNumber: deploymentTx.blockNumber,
  };

  
  const outputDir = path.join(__dirname, "../deployment");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const filename = `${hre.network.name}-deployment-${Date.now()}.json`;
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 Deployment info saved to: ${filepath}\n`);

  
  console.log("🧪 Testing deployed contract...\n");

  try {
   
    const electionActive = await secureVoting.electionActive();
    console.log(`✓ Contract callable`);
    console.log(`✓ Election active: ${electionActive}`);

    const candidateCount = await secureVoting.candidateCount();
    console.log(`✓ Candidate count: ${candidateCount}`);

    const registeredVoters = await secureVoting.registeredVoters();
    console.log(`✓ Registered voters: ${registeredVoters}\n`);

    console.log("✅ Deployment successful!\n");
    console.log("📌 Next steps:");
    console.log(`1. Add the contract address to your .env file:`);
    console.log(`   VOTING_CONTRACT_ADDRESS=${votingAddress}`);
    console.log(`2. Update frontend/src/utils/constants.js with the contract address`);
    console.log(`3. Register candidates using: yarn hardhat run scripts/register-candidates.js`);
    console.log(`4. Register voters using: yarn hardhat run scripts/register-voters.js\n`);
  } catch (error) {
    console.error("❌ Error testing contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
