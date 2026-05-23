require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      metadata: {
        useLiteralContent: true,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      // Direct injection to bypass .env loading issues
      url: "https://sepolia.infura.io/v3/ff6bf1a980c741f59c76e53cd2a0608c",
      accounts: ["0x4c2bbb7dcf9e2c47fd51fbc83775709a2a494e3f26f02a35f9f5d2e71a068ab2"],
      chainId: 11155111,
      timeout: 60000
    },
    localhost: {
      chainId: 31337,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};