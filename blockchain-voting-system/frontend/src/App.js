import React, { useContext, useEffect } from "react";
import Navbar from "./components/Navbar";
import ElectionStatus from "./components/ElectionStatus";
import VotingPanel from "./components/VotingPanel";
import Results from "./components/Results";
import { Web3Context } from "./context/Web3Context";
import "./styles/App.css";

function App() {
  const { contract, account, getElectionStatus, electionStatus, error } =
    useContext(Web3Context);

  useEffect(() => {
    const interval = setInterval(() => {
      getElectionStatus();
    }, 5000); // Refresh every 5 seconds

    // Initial load
    getElectionStatus();

    return () => clearInterval(interval);
  }, [contract, getElectionStatus]);

  return (
    <div className="App">
      <Navbar />

      <main className="main-content">
        {error && <div className="global-error">{error}</div>}

        <section className="status-section">
          <ElectionStatus status={electionStatus} />
        </section>

        <section className="voting-section">
          {!account ? (
            <div className="connection-prompt">
              <h2>Welcome to Secure Blockchain Voting</h2>
              <p>
                Please connect your MetaMask wallet to participate in the
                election.
              </p>
              <div className="features-list">
                <h3>Key Features:</h3>
                <ul>
                  <li>✓ Secure voter authentication on blockchain</li>
                  <li>✓ Transparent and immutable voting records</li>
                  <li>✓ Real-time election tracking</li>
                  <li>✓ Decentralized vote tallying</li>
                  <li>✓ Privacy-preserved voting system</li>
                  <li>
                    ✓ Complete auditability of all transactions
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <VotingPanel />
              <Results />
            </>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 Secure Blockchain Voting System</p>
          <p>Built with Solidity, React, and Web3</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
