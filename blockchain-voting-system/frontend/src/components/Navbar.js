import React, { useContext } from "react";
import { Web3Context } from "../context/Web3Context";
import { formatAddress } from "../utils/helpers";
import { NETWORK_CONFIG } from "../utils/constants";
import { BallotIcon } from "./Icons";
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

  const networkName = network
    ? NETWORK_CONFIG[Number(network.chainId)]?.name ||
      (network.name && network.name !== "unknown"
        ? network.name
        : `Chain ${network.chainId}`)
    : null;

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-mark">
            <BallotIcon size={20} />
          </span>
          <h1>
            Secure <span className="brand-long">Blockchain </span>Voting
          </h1>
        </div>

        <div className="navbar-info">
          {networkName && (
            <span className="network-badge" title="Connected network">
              <span className="network-dot" />
              {networkName}
            </span>
          )}

          <button
            className={`wallet-button ${account ? "connected" : ""}`}
            onClick={handleWalletClick}
            disabled={loading && !account}
            title={account ? "Disconnect wallet" : undefined}
          >
            {account ? (
              <>
                <span className="wallet-dot" />
                <span className="wallet-address">
                  {formatAddress(account)}
                </span>
                <span className="wallet-disconnect">Disconnect</span>
              </>
            ) : loading ? (
              "Connecting…"
            ) : (
              "Connect wallet"
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
