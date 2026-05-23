const hre = require("hardhat");

async function main() {
  const action = "end"; 
  const durationInHours = 2; 

  let contractAddress;
  try {
    const deploymentFile = require("../deployment/sepolia-deployment-latest.json");
    contractAddress = deploymentFile.contractAddress;
  } catch {
    contractAddress = "0x85932dD65F1e838E34b7e87203b602c90D409bc6";
  }

  console.log(`\n🔗 Connecting to SecureVoting at: ${contractAddress}`);

  const [signer] = await hre.ethers.getSigners();
  console.log(`👤 Commissioner: ${signer.address}\n`);

  const SecureVoting = await hre.ethers.getContractFactory("SecureVoting");
  const contract = SecureVoting.attach(contractAddress);

  switch (action.toLowerCase()) {
    case "status":
      await getStatus(contract);
      break;

    case "start":
      await startElection(contract, durationInHours);
      break;

    case "end":
      await endElection(contract);
      break;

    case "results":
      await getResults(contract);
      break;

    default:
      console.log(" Invalid action.");
  }
}

async function startElection(contract, duration) {
  console.log(` Attempting to START election for ${duration} hour(s)...`);
  
  try {
    // 1. Pre-check: Ensure there are candidates
    const count = await contract.candidateCount();
    if (Number(count) === 0) {
      console.log(" Error: You cannot start an election with 0 candidates. Run register-candidates.js first!");
      return;
    }

    console.log(` Verified: ${count} candidates registered. Proceeding to start...`);

    // 2. Send the transaction
    // We don't check for voter count here, we just fire the transaction.
    const tx = await contract.startElection(duration);
    
    console.log(" Transaction sent. Waiting for confirmation...");
    const receipt = await tx.wait();
    
    console.log(` SUCCESS: Election is now LIVE until ${new Date(Date.now() + duration * 3600000).toLocaleString()}`);
    console.log(` Hash: ${receipt.hash}`);
  } catch (error) {
   
    console.error(" Start Failed!");
    if (error.message.includes("revert")) {
      console.error(" Reason: The Smart Contract rejected the start. Check if your Solidity code requires voters to be registered first.");
    } else {
      console.error(` Error details: ${error.message}`);
    }
  }
}



async function getStatus(contract) {
  console.log(" Fetching Election Status...");
  try {
    const [active, endTime, totalVotes] = await contract.getElectionStatus();
    const now = Math.floor(Date.now() / 1000);
    const expired = now >= Number(endTime);

    console.log("-----------------------------------------");
    console.log(`On-Chain Active: ${active ? "YES" : "NO"}`);
    console.log(`Time Expired:    ${expired ? "YES (Time is up)" : "NO"}`);
    console.log(`Total Votes:     ${totalVotes.toString()}`);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error(" Error getting status:", error.message);
  }
}

async function endElection(contract) {
  console.log(` Manually ending/finalizing election...`);
  try {
    const tx = await contract.endElection();
    await tx.wait();
    console.log(` Election ended successfully.`);
  } catch (error) {
    console.error(" End Failed:", error.message);
  }
}

async function getResults(contract) {
  console.log(" Fetching Final Election Results...");
  try {
    const results = await contract.getElectionResults();
    console.log("\n--- OFFICIAL STANDINGS ---");
    results.forEach((candidate, index) => {
      console.log(`${index + 1}. ${candidate.name.padEnd(15)} : ${candidate.voteCount.toString()} votes`);
    });
    console.log("---------------------------\n");
  } catch (error) {
    console.error(" Results Error:", error.message);
  }
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});