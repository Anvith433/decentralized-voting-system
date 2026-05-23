const hre = require("hardhat");

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function main() {
    
    const deploymentFile = require("../deployment/sepolia-deployment-latest.json");
    const contractAddress = deploymentFile.contractAddress; 
    const [commissioner] = await hre.ethers.getSigners();
    
    const SecureVoting = await hre.ethers.getContractFactory("SecureVoting");
    const contract = SecureVoting.attach(contractAddress);
    
  
    const [active, endTime, totalVotes] = await contract.getElectionStatus();
    if (!active) {
        console.log(" Error: Election is NOT active. Start it first using manage-election.js");
        return;
    }

    const candidateCount = await contract.candidateCount();
    console.log(`\n Starting Royal Voting Simulation for ${candidateCount} candidates...`);

    
    const voterCount = 5; 
    const virtualVoters = [];
    for (let i = 0; i < voterCount; i++) {
        virtualVoters.push(hre.ethers.Wallet.createRandom().connect(hre.ethers.provider));
    }

    const voterAddresses = virtualVoters.map(v => v.address);

    
    console.log(`\n🔗 STEP 1: Whitelisting ${voterCount} voters on-chain...`);
    try {
        const regTx = await contract.registerMultipleVoters(voterAddresses);
        await regTx.wait();
        console.log(" Whitelisting confirmed.");
    } catch (e) {
        console.error(" Whitelisting failed.");
    }
    
   
    console.log("\n💰 STEP 2: Funding voters with 0.0035 ETH each...");
    const fundingAmount = hre.ethers.parseEther("0.0035"); 

    for (let i = 0; i < virtualVoters.length; i++) {
        const fundTx = await commissioner.sendTransaction({
            to: virtualVoters[i].address,
            value: fundingAmount
        });
        await fundTx.wait();
        console.log(`    Voter ${i + 1} funded.`);
    }

    console.log("\n Waiting 20s for Sepolia network to catch up...");
    await sleep(20000); 

   
    console.log("\n  STEP 3: Casting Ballots...");
    
    for (let i = 0; i < virtualVoters.length; i++) {
        const voter = virtualVoters[i];
        const candidateId = Math.floor(Math.random() * Number(candidateCount)) + 1;
        
        try {
            console.log(`    Voter ${i + 1} (${voter.address.substring(0,6)}) voting for ID: ${candidateId}...`);
            
            const voteTx = await contract.connect(voter).vote(candidateId);
            await voteTx.wait();
            
            console.log(`    Success! Voter ${i + 1} ballot cast.`);
        } catch (e) { 
            console.log(`     Voter ${i + 1} failed: ${e.reason || "Transaction Reverted"}`); 
        }
        
        await sleep(2000); 
    }

    console.log("\n Simulation Complete. Check the Results page!");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});