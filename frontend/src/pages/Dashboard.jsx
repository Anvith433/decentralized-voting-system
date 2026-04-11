import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import abi from '../pages/contractABI.json';
import { LogOut, RefreshCw, ShieldCheck, Wallet, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

// ✅ Latest deployed contract address
const CONTRACT_ADDRESS = "0x9EE3ca0f95Bb982827C2EE3F911D02b10e231fdC";

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [currentAccount, setCurrentAccount] = useState('');
    const [chainId, setChainId] = useState('');

    const voterId = localStorage.getItem('voterId');

    // ✅ CONNECT WALLET
    const connectWallet = async () => {
        try {
            setLoading(true);
            setStatus({ type: '', msg: '' });

            if (!window.ethereum) {
                setStatus({
                    type: 'error',
                    msg: 'MetaMask not detected. Please install it.'
                });
                return;
            }

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const currentChain = await window.ethereum.request({
                method: 'eth_chainId'
            });

            setChainId(currentChain);

            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);

                setStatus({
                    type: 'success',
                    msg: `Wallet connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
                });
            }
        } catch (err) {
            console.error("Wallet connect error:", err);
            setStatus({
                type: 'error',
                msg: err.message || 'Wallet connection failed.'
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ RESTORE WALLET + LISTENERS
    useEffect(() => {
        if (!window.ethereum) return;

        const restoreWallet = async () => {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_accounts'
                });

                const currentChain = await window.ethereum.request({
                    method: 'eth_chainId'
                });

                setChainId(currentChain);

                if (accounts.length > 0) {
                    setCurrentAccount(accounts[0]);
                }
            } catch (err) {
                console.error("Wallet restore failed:", err);
            }
        };

        const handleAccountsChanged = (accounts) => {
            setCurrentAccount(accounts[0] || '');
            setStatus({
                type: 'info',
                msg: 'Wallet account changed.'
            });
        };

        const handleChainChanged = (newChainId) => {
            setChainId(newChainId);
            window.location.reload();
        };

        restoreWallet();

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
    }, []);

    // ✅ HANDLE VOTE
    const handleVote = async (candidateId, name) => {
        if (!currentAccount) {
            setStatus({
                type: 'error',
                msg: 'Please connect your wallet first!'
            });
            return;
        }

        try {
            setLoading(true);
            setStatus({
                type: 'info',
                msg: `Submitting vote for ${name} using voter ID ${voterId}...`
            });

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                abi,
                signer
            );

            // ✅ UPDATED voterId-based smart contract call
            const tx = await contract.vote(candidateId, voterId);

            setStatus({
                type: 'info',
                msg: 'Transaction submitted. Waiting for blockchain confirmation...'
            });

            await tx.wait();

            // ✅ Backend audit + DB sync
            await axios.post('http://localhost:8080/api/voting/vote', {
                voterId,
                candidateId,
                txHash: tx.hash
            });

            setStatus({
                type: 'success',
                msg: `Vote successfully cast for ${name}`
            });

            alert(`Your vote for ${name} has been securely recorded.`);
        } catch (err) {
            console.error("Vote failed:", err);

            setStatus({
                type: 'error',
                msg:
                    err.reason ||
                    err.shortMessage ||
                    err.message ||
                    'Vote transaction failed.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0F1F] text-white p-6 md:p-12">
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto p-6 rounded-3xl flex justify-between items-center mb-12 border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl"
            >
                <div className="flex items-center gap-4">
                    <ShieldCheck className="text-blue-400" size={32} />
                    <div>
                        <h1 className="text-2xl font-bold">Decentralized Ballot</h1>
                        <p className="text-slate-500 text-xs font-mono">
                            ID: {voterId}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={connectWallet}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border ${
                            currentAccount
                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                : 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                        }`}
                    >
                        <Wallet size={16} />
                        {currentAccount
                            ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`
                            : 'Connect Wallet'}
                    </button>

                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/';
                        }}
                        className="px-6 py-2.5 rounded-xl hover:bg-red-500/20"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </motion.nav>

            {status.msg && (
                <div className="max-w-md mx-auto mb-10 p-4 rounded-2xl border text-center">
                    {status.msg}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {[
                    { id: 1, name: "Alice" },
                    { id: 2, name: "Bob" }
                ].map((c) => (
                    <div
                        key={c.id}
                        className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center"
                    >
                        <h3 className="text-3xl font-bold mb-6">{c.name}</h3>

                        <button
                            disabled={loading}
                            onClick={() => handleVote(c.id, c.name)}
                            className="w-full bg-blue-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <RefreshCw className="animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle2 size={20} />
                                    Confirm Ballot
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <footer className="mt-20 text-center text-xs text-slate-600 uppercase tracking-[0.2em] font-mono">
                Contract: {CONTRACT_ADDRESS.slice(0, 10)}... | Chain: {chainId}
            </footer>
        </div>
    );
};

export default Dashboard;