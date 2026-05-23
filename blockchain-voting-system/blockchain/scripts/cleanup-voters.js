const hre = require("hardhat");

async function main() {
    const contractAddress = "0x7eFb0Ba81Fd1b08b151f236c808740b178247538";
    const [commissioner] = await hre.ethers.getSigners();
    
    const SecureVoting = await hre.ethers.getContractFactory("SecureVoting");
    const contract = SecureVoting.attach(contractAddress);

    // PASTE THE ADDRESSES FROM ETHERSCAN LOGS HERE
    const addressesToRemove = [
        "0x...", 
        "0x...",
        "0x...",
        "0x...",
        "0x..."
    ];

    console.log(`Starting cleanup for ${addressesToRemove.length} addresses.`);

    for (const address of addressesToRemove) {
        try {
            // Check status first to avoid wasting gas on invalid calls
            const [isReg, hasVoted] = await contract.getVoterStatus(address);
            
            if (isReg && !hasVoted) {
                console.log(`Removing zombie voter: ${address}`);
                const tx = await contract.removeVoter(address);
                await tx.wait();
                console.log("Status: Successfully Removed");
            } else {
                console.log(`Skipping ${address}: Already removed or has voted.`);
            }
        } catch (error) {
            console.log(`Error removing ${address}: ${error.message.substring(0, 40)}`);
        }
    }

    const currentVoters = await contract.registeredVoters();
    console.log(`Cleanup complete. Active registered voters: ${currentVoters}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});