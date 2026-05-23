import React, { useContext } from "react";
import { Web3Context } from "../context/Web3Context";
import { formatAddress } from "../utils/helpers";
import "../styles/Navbar.css";

const Navbar = () => {
  const { account, connectWallet, disconnectWallet, network, loading } =
    useContext(Web3Context);

  const handleWalletClick = async () => {
    if (account) {
      disconnectWallet();
    } else {
      try {
        await connectWallet();
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>🗳️ Secure Blockchain Voting</h1>
          <span className="tagline">Transparent • Decentralized • Secure</span>
        </div>

        <div className="navbar-info">
          {network && (
            <div className="network-info">
              <span className="network-badge">
                Network: {network.name || `Chain ${network.chainId}`}
              </span>
            </div>
          )}

          <button
            className={`wallet-button ${account ? "connected" : ""}`}
            onClick={handleWalletClick}
            disabled={loading}
          >
            {loading ? (
              "Connecting..."
            ) : account ? (
              <>
                <span className="wallet-icon">👛</span>
                {formatAddress(account)}
              </>
            ) : (
              "Connect Wallet"
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
