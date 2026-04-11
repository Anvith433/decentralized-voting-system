import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [voterId, setVoterId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Send credentials to Spring Boot (MySQL check)
            const res = await axios.post('http://localhost:8080/api/voting/login', { 
                voterId, 
                password 
            });

            // 2. Save Voter ID and Registered Wallet to localStorage for later use on Dashboard
            localStorage.setItem('voterId', voterId);
            
            // We store the wallet address returned by the DB so the Dashboard 
            // knows which MetaMask account to look for later.
            if (res.data.walletAddress) {
                localStorage.setItem('registeredWallet', res.data.walletAddress);
            }

            // 3. Success Animation and Navigation
            setTimeout(() => {
                setLoading(false);
                navigate('/dashboard');
            }, 1000);

        } catch (err) {
            setLoading(false);
            if (err.response && err.response.status === 401) {
                setError('Invalid Voter ID or Password.');
            } else {
                setError('Authentication Failed. Unable to connect to security server.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0A0F1F]">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                <div className="glass-card flex flex-col items-center p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/10"
                    >
                        <ShieldCheck size={50} strokeWidth={1.5}/>
                    </motion.div>
                    
                    <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">Voter Access</h2>
                    <p className="text-slate-400 mb-10 text-center max-w-sm">
                        Secure Identity Verification Portal. Authenticate using your official credentials.
                    </p>
                    
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-xl mb-8 text-sm flex gap-3 items-center"
                        >
                           <KeyRound size={20}/> {error}
                        </motion.div>
                    )}
                    
                    <form onSubmit={handleLogin} className="w-full space-y-6">
                        <div className="relative group">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
                                Official Voter ID
                            </label>
                            <User className="absolute left-4 top-[41px] text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input 
                                type="text" 
                                value={voterId}
                                onChange={e => setVoterId(e.target.value)} 
                                required 
                                placeholder="e.g. VTR-123-456"
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                            />
                        </div>
                        
                        <div className="relative group">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
                                Secure Password
                            </label>
                            <Lock className="absolute left-4 top-[41px] text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)} 
                                required 
                                placeholder="••••••••"
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                            />
                        </div>
                        
                        <motion.button 
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            disabled={loading}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 text-lg"
                        >
                            {loading ? "Verifying Identity..." : (
                                <>Authorize Access <ArrowRight size={22}/></>
                            )}
                        </motion.button>
                    </form>
                    
                    <div className="mt-12 text-center text-xs text-slate-600 tracking-wider">
                        SECURED VIA CRYPTOGRAPHIC PROTOCOLS
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;