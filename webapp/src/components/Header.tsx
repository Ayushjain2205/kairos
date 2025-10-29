import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Logo from "./Logo";
import CreateMarketModal from "./CreateMarketModal";

export default function Header() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check if already connected
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <header className="border-b-4 border-gray-800 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="flex gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="sketchy-btn bg-white hover:bg-gray-50 text-gray-800 px-5 py-2.5 border-gray-800 font-bold transition-colors shadow-md hover:shadow-lg"
              >
                Create Market
              </button>
              {account ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="sketchy-btn bg-primary hover:bg-orange-600 text-white px-5 py-2.5 border-gray-800 font-bold transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    {formatAddress(account)}
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 z-20 animate-fadeIn">
                        <div className="sketchy-border bg-white border-gray-800 shadow-lg">
                          <button
                            onClick={() => {
                              disconnectWallet();
                              setShowDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 font-bold text-gray-800 hover:bg-gray-100 transition-colors"
                            style={{ fontFamily: "Neucha, cursive" }}
                          >
                            Disconnect
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="sketchy-btn bg-primary hover:bg-orange-600 text-white px-5 py-2.5 border-gray-800 font-bold transition-colors shadow-md hover:shadow-lg"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <CreateMarketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
