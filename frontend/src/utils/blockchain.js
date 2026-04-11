import { ethers } from 'ethers';
import abi from '../pages/contractABI.json';

// UPDATE THIS with the address from Remix (Deploy & Run tab)
const CONTRACT_ADDRESS = "0x9EE3ca0f95Bb982827C2EE3F911D02b10e231fdC"; 

export const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask not detected");
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};

// Helper to check if the current wallet has already voted
export const checkVoterStatus = async (address) => {
    const contract = await getContract();
    return await contract.hasVoted(address);
};

// Helper to get live counts for the results section
export const fetchLiveVotes = async (id) => {
    const contract = await getContract();
    const count = await contract.getVotes(id);
    return Number(count);
};