# Decentralized Voting System

A **secure, transparent, and auditable blockchain-based voting platform** built with a **Spring Boot backend** and a **Vite + React frontend**. The system leverages blockchain tools such as **MetaMask, Ganache, and Remix** to ensure vote immutability, decentralized verification, and end-to-end transparency.

---

## 🚀 Project Overview

Traditional voting systems face challenges like fraud, tampering, lack of transparency, and limited accessibility. This project solves these issues using **blockchain technology**.

### Key Highlights

* 🔐 **Secure voter authentication** using Voter ID + BCrypt password hashing
* 🗳️ **Immutable vote storage** on blockchain smart contracts
* 🌐 **Frontend integration with MetaMask** for wallet connectivity
* ⛓️ **Ganache local blockchain** for development and testing
* 📜 **Smart contract deployment via Remix**
* 📊 **Audit logs** for transparent vote verification
* ⚡ **Spring Boot REST APIs** for voter operations
* 🎯 **Modern React UI** for login, dashboard, and voting flow

---

## 🏗️ Repository Structure

```text
/decentralized-voting-system
├── backend/
│   ├── src/main/java/com/blockchain/voting
│   │   ├── config/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   └── VotingApplication.java
│   ├── src/main/resources/
│   ├── pom.xml
│   └── mvnw
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── assets/
    │   └── utils/
    ├── public/
    ├── package.json
    └── vite.config.js
```

---

## 🛠️ Tech Stack

### Frontend

* React + Vite
* Tailwind CSS
* JavaScript (ES6)
* MetaMask integration

### Backend

* Spring Boot
* Spring Security
* BCrypt
* Spring Data JPA
* MySQL

### Blockchain

* Solidity
* Remix IDE
* Ganache
* MetaMask
* Web3 / Ethers.js

---

## 🔐 Core Features

### 1) Voter Authentication

* Voter login using **Voter ID + password**
* Passwords securely hashed with **BCrypt**
* Session/token-based protected APIs

### 2) Blockchain Vote Casting

* Votes are submitted as **blockchain transactions**
* Each transaction stores:

  * voter reference
  * candidate ID
  * transaction hash
  * timestamp

### 3) Transparency & Auditability

* Immutable blockchain records
* Backend audit logs
* Real-time vote verification

### 4) Frontend Dashboard

* Secure login page
* Candidate selection UI
* Wallet connection via MetaMask
* Voting confirmation and transaction status

---

## ⚙️ Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```


## ⚛️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## ⛓️ Blockchain Setup

### Ganache

* Start Ganache local blockchain
* Copy RPC URL and test accounts

### Remix

* Compile and deploy Solidity voting smart contract
* Copy contract ABI to:

```text
frontend/src/pages/contractABI.json
```

### MetaMask

* Connect MetaMask to Ganache RPC
* Import test account private key

---

## 📸 Modules Implemented

### Backend Modules

* Config Layer
* Security Layer
* Model Layer
* Repository Layer
* Service Layer
* Controller Layer
* Audit Logging

### Frontend Modules

* Login Page
* Dashboard
* Blockchain utility integration
* Smart contract ABI support

---

## 🎯 Future Enhancements

* Zero-knowledge proof based privacy
* OTP / biometric voter authentication
* Election analytics dashboard
* Multi-candidate live results
* Cloud deployment
* IPFS ballot storage

---

## 👨‍💻 Author

**Anvith Shetty**
Student, PES University

---

## 📄 License

This project is developed for **academic and learning purposes**.
