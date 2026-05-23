const hre = require("hardhat");

async function main() {
  console.log("📝 Registering candidates...\n");

  const deploymentFile = require("../deployment/sepolia-deployment-latest.json");
  const contractAddress = deploymentFile.contractAddress;

  console.log(`Contract Address: ${contractAddress}\n`);

  const candidates = [
    {
      name: "Alice Smith",
      description: "Democratic candidate with focus on education and healthcare",
    },
    {
      name: "Bob Johnson",
      description: "Republican candidate focused on economy and security",
    },
    {
      name: "Charlie Brown",
      description: "Independent candidate promoting environmental policies",
    },
    {
      name: "Diana Lee",
      description: "Green party candidate for sustainable development",
    },
  ];

  const [commissioner] = await hre.ethers.getSigners();
  console.log(`Commissioner: ${commissioner.address}\n`);

  const SecureVoting = await hre.ethers.getContractFactory("SecureVoting");
  const contract = SecureVoting.attach(contractAddress);

 
  console.log("🔍 Checking existing candidates on-chain...");
  const existingCandidates = await contract.getAllCandidates();
  const existingNames = existingCandidates.map(c => c.name.toLowerCase());

  console.log(`⏳ Processing ${candidates.length} candidate requests...\n`);

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];

   
    if (existingNames.includes(candidate.name.toLowerCase())) {
      console.log(`⏩ Skipping: ${candidate.name} (Already Registered)`);
      continue; 
    }

    try {
      console.log(`🚀 Registering: ${candidate.name}...`);
      const tx = await contract.registerCandidate(
        candidate.name,
        candidate.description
      );
      const receipt = await tx.wait();

      console.log(`    Registered | Hash: ${receipt.hash}`);
      console.log(`    Gas Used: ${receipt.gasUsed.toString()}\n`);
    } catch (error) {
      console.error(`    Error registering ${candidate.name}:`, error.message);
    }
  }

 
  console.log("\n--- Final Candidate List ---");
  const allCandidates = await contract.getAllCandidates();
  allCandidates.forEach((candidate, index) => {
    console.log(`${index + 1}. ${candidate.name} (ID: ${candidate.id.toString()})`);
  });

  console.log(`\nTotal Candidates on Contract: ${allCandidates.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal Error:", error);
    process.exit(1);
  });