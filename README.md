# 🗳️ Secure Blockchain-Based Voting System

<p align="center">
  A transparent, decentralized, and tamper-resistant voting platform
  built with <b>Ethereum, Solidity, Hardhat, React, and MetaMask</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Solidity-0.8.x-363636?style=for-the-badge&logo=solidity" />
  <img src="https://img.shields.io/badge/Ethereum-Sepolia-627EEA?style=for-the-badge&logo=ethereum" />
  <img src="https://img.shields.io/badge/Hardhat-Development-FFF100?style=for-the-badge&logo=hardhat" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/MetaMask-Web3-F6851B?style=for-the-badge&logo=metamask" />
</p>

---

## 📌 Overview

Traditional voting systems rely heavily on centralized infrastructure, making transparency, auditability, and tamper resistance challenging to achieve.

**Secure Blockchain-Based Voting System** explores how blockchain technology can be used to create a voting platform where election data and vote transactions are recorded on the Ethereum blockchain.

The system combines:

- 🔐 Wallet-based voter authentication
- ⛓️ Immutable blockchain vote recording
- 🗳️ Smart-contract-based election management
- 👥 Administrative voter and candidate registration
- 🔎 Transparent result verification
- 📊 Real-time election statistics
- 🦊 MetaMask wallet integration
- 🌐 Remote web-based voting

> ⚠️ **Educational Project:** This project is intended for demonstration and learning purposes and is not designed to replace legally compliant governmental election infrastructure.

---

# ✨ Key Features

## 🔐 Secure Voter Authentication

Voters connect their **MetaMask wallet**, providing a blockchain address that acts as their voting identity.

The smart contract verifies whether the connected address is an eligible registered voter before allowing a vote.

```text
MetaMask Wallet
       │
       ▼
Ethereum Address
       │
       ▼
Voter Verification
       │
       ▼
Eligible → Vote
