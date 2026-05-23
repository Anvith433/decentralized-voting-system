import { ethers } from "ethers";

// Format address for display (show first 6 and last 4 characters)
export const formatAddress = (address) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

// Convert wei to ether
export const weiToEther = (wei) => {
  return ethers.formatEther(wei);
};

// Convert ether to wei
export const etherToWei = (ether) => {
  return ethers.parseEther(ether.toString());
};

// Format timestamp to readable date
export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleString();
};

/**
 * Calculate time remaining
 * UPDATED: Returns "Expired" to trigger automatic smart contract 
 * finalization in the ElectionStatus component.
 */
export const calculateTimeRemaining = (endTime) => {
  if (!endTime || endTime === 0) return "00h 00m 00s";

  const now = Math.floor(Date.now() / 1000);
  const remaining = parseInt(endTime) - now;
  
  // CRITICAL: This string must match the check in ElectionStatus.js
  if (remaining <= 0) return "Expired"; 
  
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  
  // Pad with zeros for a professional look: 01h 05m 09s
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');
  
  return `${h}h ${m}m ${s}s`;
};

// Validate Ethereum address
export const isValidAddress = (address) => {
  return ethers.isAddress(address);
};

// Create a contract instance
export const getContractInstance = (address, abi, signer) => {
  return new ethers.Contract(address, abi, signer);
};

// Get provider from window.ethereum (Ethers v6 syntax)
export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error("MetaMask is not installed");
};

// Request account access
export const requestAccountAccess = async () => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    throw new Error("User denied account access");
  }
};

// Get current network
export const getCurrentNetwork = async () => {
  const provider = getProvider();
  const network = await provider.getNetwork();
  return network;
};

// Switch network
export const switchNetwork = async (chainId) => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error) {
    if (error.code === 4902) {
      throw new Error("Chain not added to MetaMask");
    }
    throw error;
  }
};

// Hash voter ID (privacy preservation)
export const hashVoterId = (voterId) => {
  return ethers.keccak256(ethers.toUtf8Bytes(voterId));
};

// Verify transaction
export const verifyTransaction = async (transactionHash) => {
  try {
    const provider = getProvider();
    const receipt = await provider.getTransactionReceipt(transactionHash);
    return receipt ? receipt.status === 1 : false;
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return false;
  }
};

// Get gas estimate
export const getGasEstimate = async (contract, functionName, args) => {
  try {
    const gasEstimate = await contract[functionName].estimateGas(...args);
    return gasEstimate;
  } catch (error) {
    console.error("Error estimating gas:", error);
    return null;
  }
};