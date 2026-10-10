import React, { useContext, useEffect } from "react";
import Navbar from "./components/Navbar";
import ElectionStatus from "./components/ElectionStatus";
import VotingPanel from "./components/VotingPanel";
import Results from "./components/Results";
import { CheckIcon, CloseIcon } from "./components/Icons";
import { Web3Context } from "./context/Web3Context";
import "./styles/App.css";

const FEATURES = [
  "Secure voter authentication on blockchain",
  "Transparent and immutable voting records",
  "Real-time election tracking",
  "Decentralized vote tallying",
  "Privacy-preserved voting system",
  "Complete auditability of all transactions",
];

const STEPS = [
  {
    title: "Connect your wallet",
    text: "Use the MetaMask account that was registered for this election.",
  },
  {
    title: "Pick a candidate",
    text: "Read through the ballot and choose the person you want to support.",
  },
  {
    title: "Confirm the transaction",
    text: "Approve it in MetaMask. Once it is mined, your vote is final.",
  },
];

function App() {
  const {
    contract,
    account,
    connectWallet,
    getElectionStatus,
    electionStatus,
    error,
    setError,
    loading,
  } = useContext(Web3Context);

  useEffect(() => {
    const interval = setInterval(() => {
      getElectionStatus();
    }, 5000); // Refresh every 5 seconds

    // Initial load
    getElectionStatus();

    return () => clearInterval(interval);
  }, [contract, getElectionStatus]);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  return (
    <div className="App">
      <Navbar />

      <main className="main-content">
        {error && (
          <div className="global-error" role="alert">
            <span className="global-error-text">{error}</span>
            <button
              className="icon-button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        )}

        {!account ? (
          <div className="connection-prompt">
            <section className="intro">
              <div className="intro-text">
                <h2>Your vote, recorded on the blockchain.</h2>
                <p className="intro-lead">
                  Connect your MetaMask wallet to see the ballot and take part
                  in the election. Every vote is an Ethereum transaction, so
                  the count is public and can&rsquo;t be changed afterwards.
                </p>
                <div className="intro-actions">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleConnect}
                    disabled={loading}
                  >
                    {loading ? "Connecting…" : "Connect wallet"}
                  </button>
                  <span className="intro-note">
                    Requires MetaMask on the Sepolia network
                  </span>
                </div>
              </div>

              <div className="intro-steps">
                <h3>How voting works</h3>
                <ol>
                  {STEPS.map((step, i) => (
                    <li key={step.title}>
                      <span className="step-number">{i + 1}</span>
                      <div>
                        <strong>{step.title}</strong>
                        <p>{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="features-list">
              <h3>Key features</h3>
              <ul>
                {FEATURES.map((feature) => (
                  <li key={feature}>
                    <CheckIcon size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : (
          <>
            <section className="status-section">
              <ElectionStatus status={electionStatus} />
            </section>

            <section className="voting-section">
              <VotingPanel />
              <Results />
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 Secure Blockchain Voting System</p>
          <p>Built with Solidity, React and Web3</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
