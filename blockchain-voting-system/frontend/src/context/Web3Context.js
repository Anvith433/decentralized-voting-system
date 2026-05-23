import React, { createContext, useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, APP_CONFIG } from "../utils/constants";
import {
  getProvider,
  requestAccountAccess,
  getCurrentNetwork,
  switchNetwork,
  getContractInstance,
} from "../utils/helpers";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [electionStatus, setElectionStatus] = useState(null);

  // Initialize provider and connect to wallet
  const initializeConnection = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      const newProvider = getProvider();
      setProvider(newProvider);

      const currentNetwork = await getCurrentNetwork();
      setNetwork(currentNetwork);

      if (currentNetwork.chainId !== APP_CONFIG.REQUIRED_NETWORK) {
        await switchNetwork(APP_CONFIG.REQUIRED_NETWORK);
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const newSigner = await newProvider.getSigner();
        setSigner(newSigner);

        if (CONTRACT_ADDRESS) {
          const contractInstance = getContractInstance(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            newSigner
          );
          setContract(contractInstance);
        }
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Initialization error:", err);
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const accounts = await requestAccountAccess();
      setAccount(accounts);

      const newProvider = getProvider();
      const newSigner = await newProvider.getSigner();
      setSigner(newSigner);

      if (CONTRACT_ADDRESS) {
        const contractInstance = getContractInstance(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          newSigner
        );
        setContract(contractInstance);
      }

      setLoading(false);
      return accounts;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount("");
    setSigner(null);
    setContract(null);
    setElectionStatus(null);
    setError("");
  }, []);

  // Get election status
  const getElectionStatus = useCallback(async () => {
    try {
      if (!contract) return null;

      // Note: Destructuring based on your Smart Contract's getElectionStatus returns
      const [active, timeRemaining, totalVotes] = await contract.getElectionStatus();
      const candidateCount = await contract.candidateCount();
      const registeredVoters = await contract.registeredVoters();

      const status = {
        electionActive: active, // Standardized naming for ElectionStatus component
        timeRemaining: timeRemaining.toString(),
        totalVotesCast: totalVotes.toString(), // Matches your UI prop names
        candidateCount: candidateCount.toString(),
        registeredVoters: registeredVoters.toString(),
        electionEnd: (Date.now() / 1000) + Number(timeRemaining) // For the countdown helper
      };

      setElectionStatus(status);
      return status;
    } catch (err) {
      console.error("Error getting election status:", err);
      return null;
    }
  }, [contract]);

  // Cast vote
  const castVote = useCallback(
    async (candidateId) => {
      try {
        setLoading(true);
        setError("");

        if (!contract || !signer) {
          throw new Error("Contract or signer not initialized");
        }

        const tx = await contract.vote(candidateId);
        const receipt = await tx.wait();

        // Refresh data immediately after blockchain confirmation
        await getElectionStatus();

        setLoading(false);
        return receipt;
      } catch (err) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    [contract, signer, getElectionStatus]
  );

  // Get all candidates
  const getCandidates = useCallback(async () => {
    try {
      if (!contract) return [];
      const candidates = await contract.getAllCandidates();
      return candidates.map((c) => ({
        id: c.id.toString(),
        name: c.name,
        description: c.description,
        votes: c.voteCount.toString(),
        registrationTime: c.registrationTime.toString(),
      }));
    } catch (err) {
      console.error("Error getting candidates:", err);
      return [];
    }
  }, [contract]);

  // Voter/Results/Winner functions
  const getVoterStatus = useCallback(async (voterAddress) => {
    try {
      if (!contract) return null;
      const [isRegistered, hasVoted] = await contract.getVoterStatus(voterAddress);
      return { isRegistered, hasVoted };
    } catch (err) { return null; }
  }, [contract]);

  const getResults = useCallback(async () => {
    try {
      if (!contract) return [];
      const results = await contract.getElectionResults();
      return results.map((r) => ({
        id: r.id.toString(),
        name: r.name,
        votes: r.voteCount.toString(),
      }));
    } catch (err) { return []; }
  }, [contract]);

  const getWinner = useCallback(async () => {
    try {
      if (!contract) return null;
      const winner = await contract.getWinner();
      return {
        id: winner.id.toString(),
        name: winner.name,
        votes: winner.voteCount.toString(),
      };
    } catch (err) { return null; }
  }, [contract]);

  
  useEffect(() => {
    if (!contract) return;

    getElectionStatus(); // Initial call

    const interval = setInterval(() => {
      getElectionStatus();
    }, 10000); 

    return () => clearInterval(interval);
  }, [contract, getElectionStatus]);

  
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) setAccount(accounts[0]);
        else disconnectWallet();
      });
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
    return () => {
      if (window.ethereum) window.ethereum.removeAllListeners();
    };
  }, [disconnectWallet]);

  useEffect(() => {
    initializeConnection();
  }, [initializeConnection]);

  const value = {
    account, provider, signer, contract, network, loading, error, electionStatus,
    connectWallet, disconnectWallet, getElectionStatus, getCandidates,
    getVoterStatus, castVote, getResults, getWinner, setError,
  };

  return (
    <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
  );
};

export default Web3Provider;