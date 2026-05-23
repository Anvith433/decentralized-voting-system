# 📑 Project Files Guide

## 📖 Getting Started (Start Here!)

Read these files first in this order:

1. **[README.md](README.md)** - Complete project overview & features
2. **[SETUP.md](SETUP.md)** - Step-by-step installation guide
3. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - What's been built summary
4. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Commands & troubleshooting

---

## 🔗 Smart Contract Files

### Main Contract

| File | Purpose | Location |
|------|---------|----------|
| **SecureVoting.sol** | Main voting smart contract (500+ lines) | `blockchain/contracts/` |
| Full contract documentation included in file | - | - |

**Key sections in SecureVoting.sol:**
- State variables (candidate, voter, vote data structures)
- Access control modifiers
- Candidate registration functions
- Voter registration functions
- Election management functions
- Voting functions
- Query/view functions
- Admin functions

### Deployment & Configuration

| File | Purpose | Location |
|------|---------|----------|
| **hardhat.config.js** | Hardhat configuration for compilation & deployment | `blockchain/` |
| **package.json** | Node.js dependencies for blockchain | `blockchain/` |
| **.env.example** | Template for environment variables | `blockchain/` |
| **.gitignore** | Prevents committing sensitive files | `blockchain/` |

---

## 🧪 Testing & Scripts

### Testing

| File | Purpose | Location |
|------|---------|----------|
| **voting.test.js** | Comprehensive test suite (23 tests) | `blockchain/test/` |

**Test coverage:**
- Deployment
- Candidate registration
- Voter registration
- Election management
- Vote casting
- Results queries
- Access control
- Error handling

### Helper Scripts

| File | Purpose | Location |
|------|---------|----------|
| **deploy.js** | Deploy contract to blockchain | `blockchain/scripts/` |
| **register-candidates.js** | Register test candidates | `blockchain/scripts/` |
| **register-voters.js** | Register test voters | `blockchain/scripts/` |
| **manage-election.js** | Start/end elections, view results | `blockchain/scripts/` |

**Helper scripts usage:**
```bash
npm run deploy:sepolia                    # Deploy contract
npm run scripts/register-candidates.js    # Register candidates
npm run scripts/register-voters.js        # Register voters
npm run scripts/manage-election.js start 1 # Start 1-hour election
```

---

## ⚛️ React Frontend Files

### Core Components

| File | Purpose | Location | Lines |
|------|---------|----------|-------|
| **Navbar.js** | Wallet connection & network display | `frontend/src/components/` | ~80 |
| **CandidateCard.js** | Individual candidate voting card | `frontend/src/components/` | ~90 |
| **ElectionStatus.js** | Live election metrics display | `frontend/src/components/` | ~100 |
| **VotingPanel.js** | Main voting interface | `frontend/src/components/` | ~150 |
| **Results.js** | Election results & winner display | `frontend/src/components/` | ~180 |

### Context & Utilities

| File | Purpose | Location | Functions |
|------|---------|----------|-----------|
| **Web3Context.js** | Blockchain connection & contract logic | `frontend/src/context/` | 10+ |
| **constants.js** | ABI & network configuration | `frontend/src/utils/` | Contract ABI |
| **helpers.js** | Utility functions (formatting, conversion) | `frontend/src/utils/` | 15+ |

**Key context functions:**
- `connectWallet()` - Connect MetaMask
- `getCandidates()` - Fetch all candidates
- `castVote()` - Submit vote to blockchain
- `getElectionStatus()` - Get live election data
- `getVoterStatus()` - Check if voter exists

### Application Files

| File | Purpose | Location |
|------|---------|----------|
| **App.js** | Main application component | `frontend/src/` |
| **index.js** | React entry point | `frontend/src/` |
| **index.html** | HTML template | `frontend/public/` |
| **package.json** | Node.js dependencies for frontend | `frontend/` |
| **.env.example** | Environment template | `frontend/` |
| **.gitignore** | Git ignore rules | `frontend/` |

### Styling Files

| File | Purpose | Lines |
|------|---------|-------|
| **index.css** | Global styles & responsive design | ~100 |
| **Navbar.css** | Navbar component styles | ~100 |
| **CandidateCard.css** | Candidate card styles | ~150 |
| **ElectionStatus.css** | Election status styles | ~120 |
| **VotingPanel.css** | Voting panel styles | ~80 |
| **Results.css** | Results display styles | ~200 |

**All CSS files located in:** `frontend/src/styles/`

---

## 📚 Documentation Files

### Main Documentation

| File | Purpose | Page Count |
|------|---------|------------|
| **README.md** | Complete project overview, setup, features | ~450 lines |
| **SETUP.md** | Step-by-step installation guide | ~350 lines |
| **QUICK_REFERENCE.md** | Commands, shortcuts, troubleshooting | ~400 lines |
| **PROJECT_SUMMARY.md** | What's been built summary | ~300 lines |
| **FILES_GUIDE.md** | This file - project structure guide | ~400 lines |

### Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| **.gitignore** | Prevents accidental commits | Root |
| **.gitignore** | Prevents accidental commits | `blockchain/` |
| **.gitignore** | Prevents accidental commits | `frontend/` |
| **.env.example** | Environment variable template | `blockchain/` |
| **.env.example** | Environment variable template | `frontend/` |

---

## 📊 File Structure Overview

```
blockchain-voting-system/
│
├── 📄 README.md                    ← Start here! Main documentation
├── 📄 SETUP.md                     ← Installation guide
├── 📄 PROJECT_SUMMARY.md           ← Summary of what's built
├── 📄 QUICK_REFERENCE.md           ← Commands & troubleshooting
├── 📄 FILES_GUIDE.md               ← This file
├── 📄 .gitignore                   ← Git configuration
│
├── 📁 blockchain/
│   ├── 📁 contracts/
│   │   └── 📄 SecureVoting.sol     ← Main smart contract
│   │
│   ├── 📁 test/
│   │   └── 📄 voting.test.js       ← Test suite (23 tests)
│   │
│   ├── 📁 scripts/
│   │   ├── 📄 deploy.js            ← Deploy script
│   │   ├── 📄 register-candidates.js
│   │   ├── 📄 register-voters.js
│   │   └── 📄 manage-election.js
│   │
│   ├── 📄 hardhat.config.js        ← Configuration
│   ├── 📄 package.json             ← Dependencies
│   ├── 📄 .env.example             ← Environment template
│   └── 📄 .gitignore               ← Git configuration
│
└── 📁 frontend/
    ├── 📁 public/
    │   └── 📄 index.html           ← HTML template
    │
    ├── 📁 src/
    │   ├── 📁 components/
    │   │   ├── 📄 Navbar.js
    │   │   ├── 📄 CandidateCard.js
    │   │   ├── 📄 ElectionStatus.js
    │   │   ├── 📄 VotingPanel.js
    │   │   └── 📄 Results.js
    │   │
    │   ├── 📁 context/
    │   │   └── 📄 Web3Context.js   ← Blockchain connection
    │   │
    │   ├── 📁 utils/
    │   │   ├── 📄 constants.js     ← ABI & configuration
    │   │   └── 📄 helpers.js       ← Utility functions
    │   │
    │   ├── 📁 styles/
    │   │   ├── 📄 index.css
    │   │   ├── 📄 Navbar.css
    │   │   ├── 📄 CandidateCard.css
    │   │   ├── 📄 ElectionStatus.css
    │   │   ├── 📄 VotingPanel.css
    │   │   └── 📄 Results.css
    │   │
    │   ├── 📄 App.js               ← Main component
    │   └── 📄 index.js             ← Entry point
    │
    ├── 📄 package.json
    ├── 📄 .env.example
    └── 📄 .gitignore
```

---

## 🎯 Quick Navigation

### I want to...

**...understand the project**
→ Read [`README.md`](README.md)

**...install & set up**
→ Follow [`SETUP.md`](SETUP.md)

**...find a command**
→ Check [`QUICK_REFERENCE.md`](QUICK_REFERENCE.md)

**...understand the smart contract**
→ Open [`blockchain/contracts/SecureVoting.sol`](blockchain/contracts/SecureVoting.sol)

**...run tests**
→ Execute: `cd blockchain && npm run test`

**...edit components**
→ Go to: [`frontend/src/components/`](frontend/src/components/)

**...change colors/styling**
→ Edit: [`frontend/src/styles/`](frontend/src/styles/)

**...understand Web3 integration**
→ Read: [`frontend/src/context/Web3Context.js`](frontend/src/context/Web3Context.js)

**...deploy contract**
→ Follow: [`blockchain/scripts/deploy.js`](blockchain/scripts/deploy.js)

**...troubleshoot an issue**
→ Check: [`QUICK_REFERENCE.md`](QUICK_REFERENCE.md) troubleshooting section

---

## 📈 File Statistics

### Code Files
- Smart Contracts: 1 (500+ lines)
- React Components: 5 (~600 lines)
- Context/Utils: 2 (~350 lines)
- Test File: 1 (~400 lines)
- Scripts: 4 (~500 lines)
- **Total Code: ~2,500+ lines**

### Styling
- CSS Files: 6 (~800 lines)
- Responsive Design: ✅ Yes
- Mobile Friendly: ✅ Yes

### Documentation
- Documentation files: 5 (~1,500 lines)
- Inline comments: 100+ lines
- Function documentation: Extensive

### Configuration
- .env templates: 2
- .gitignore files: 3
- Config files: 1

**Total Project: 40+ files**

---

## 🔐 Important Files

### ⚠️ DO NOT COMMIT
- `blockchain/.env` - Contains private keys
- `frontend/.env` - Contains API keys
- `node_modules/` - Dependencies (auto-installed)
- `artifacts/` - Build outputs (auto-generated)
- `cache/` - Cache files (auto-generated)

### ✅ ALWAYS COMMIT
- `blockchain/contracts/*.sol` - Source code
- `frontend/src/**/*.js` - React components
- `blockchain/test/*.js` - Tests
- `blockchain/scripts/*.js` - Helper scripts
- `.gitignore` - Git configuration
- `README.md` - Documentation
- `package.json` - Dependencies list

### 📝 TEMPLATES (.example files)
- `blockchain/.env.example` - Use as template
- `frontend/.env.example` - Use as template

---

## 🚀 Recommended Reading Order

### Day 1: Setup & Understanding
1. README.md (overview)
2. SETUP.md (installation)
3. PROJECT_SUMMARY.md (what's built)

### Day 2: Development
1. Smart contract (SecureVoting.sol)
2. Test file (voting.test.js)
3. React components (src/components/)

### Day 3: Deployment
1. Deploy script (scripts/deploy.js)
2. Helper scripts (register-*, manage-*)
3. QUICK_REFERENCE.md

### Day 4+: Customization
1. Modify candidates (in register-candidates.js)
2. Update styling (in src/styles/)
3. Customize components (in src/components/)

---

## 📞 File Locations for Common Tasks

| Task | File |
|------|------|
| Deploy contract | `blockchain/scripts/deploy.js` |
| Register candidates | `blockchain/scripts/register-candidates.js` |
| Register voters | `blockchain/scripts/register-voters.js` |
| Manage election | `blockchain/scripts/manage-election.js` |
| Change wallet address | `blockchain/.env` |
| Update contract address | `frontend/.env` |
| Modify styling | `frontend/src/styles/*.css` |
| Edit components | `frontend/src/components/*.js` |
| Create functions | `frontend/src/context/Web3Context.js` |
| Add tests | `blockchain/test/voting.test.js` |

---

## ✨ Key Features Summary

### Smart Contract Features
✅ Secure voting mechanism  
✅ Voter authentication  
✅ Candidate registration  
✅ Election lifecycle management  
✅ Vote tallying  
✅ Result verification  

### Frontend Features
✅ MetaMask integration  
✅ Real-time status updates  
✅ Responsive design  
✅ Error handling  
✅ User-friendly interface  
✅ Vote confirmation  

### Documentation Features
✅ Setup guide  
✅ Quick reference  
✅ Troubleshooting  
✅ Code comments  
✅ API documentation  
✅ Best practices  

---

## 🎓 Learning Path

1. **Blockchain Basics** → Read README.md
2. **Setup & Install** → Follow SETUP.md
3. **Smart Contracts** → Study SecureVoting.sol
4. **Testing** → Run and read voting.test.js
5. **Web3 Integration** → Review Web3Context.js
6. **React Components** → Study components/
7. **Styling** → Explore styles/
8. **Deployment** → Execute deploy scripts
9. **Troubleshooting** → Use QUICK_REFERENCE.md

---

**Happy coding! 🚀**

For questions, refer to the appropriate file listed above.
