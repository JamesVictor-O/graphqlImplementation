import React, { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { useWriteContract } from "wagmi";
import { contractAddress } from "../utils/contractAddress";
import contractAbi from "../contractAbi";
import { useQuery } from "@apollo/client";
import { GET_MY_ENTITIES } from "../utils/queries";
import TokenCards from "../components/TokenCards";
import NFTCards from "../components/Nfts";

const LandingPage = () => {
  const [tokenType, setTokenType] = useState("erc20");
  const [deployERC20Info, setDeployERC20Info] = useState({
    name: "",
    symbol: "",
    totalSupply: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [deployedAddress, setDeployedAddress] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { address, isConnected, chain } = useAccount();
  const { writeContractAsync, isPending, isErrorWrite } = useWriteContract();
  const { data: hash, error: writeError } = useWriteContract();

  const getExplorerUrl = (hash) => {
    const chainId = chain?.id || 1;
    const explorerUrls = {
      1: "https://sepolia.etherscan.io/",
    };

    const baseUrl =
      explorerUrls[chainId] || "https://sepolia-blockscout.lisk.com";
    return `${baseUrl}/tx/${hash}`;
  };

  const getTokenExplorerUrl = (address) => {
    const chainId = chain?.id || 1;
    const explorerUrls = {
      1: "https://sepolia.etherscan.io/",
    };

    const baseUrl = explorerUrls[chainId] || "https://sepolia.etherscan.io/";
    return `${baseUrl}/token/${address}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deployERC20Info.name.trim()) {
      alert("Please enter a token name");
      return;
    }

    if (!deployERC20Info.symbol.trim()) {
      alert("Please enter a token symbol");
      return;
    }

    if (
      !deployERC20Info.totalSupply ||
      isNaN(Number(deployERC20Info.totalSupply))
    ) {
      alert("Please enter a valid number for total supply");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to deploy a token with the following details?\n\nName: ${deployERC20Info.name}\nSymbol: ${deployERC20Info.symbol}\nTotal Supply: ${deployERC20Info.totalSupply}`
    );

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: contractAbi,
        functionName: tokenType === "erc20" ? "deployErc20" : "deployErc721",
        args:
          tokenType === "erc20"
            ? [
                deployERC20Info.name,
                deployERC20Info.symbol,
                deployERC20Info.totalSupply,
              ]
            : [deployERC20Info.name, deployERC20Info.symbol, address, baseUrl],
      });
      setTransactionHash(hash);

      // const receipt = await waitForTransactionReceipt({ hash });

      try {
        const iface = new ethers.Interface(contractAbi);
        const log = receipt.logs.find(
          (log) => log.address.toLowerCase() === contractAddress.toLowerCase()
        );
        if (log) {
          const parsedLog = iface.parseLog(log);
          if (parsedLog && parsedLog.args && parsedLog.args.tokenAddress) {
            setDeployedAddress(parsedLog.args.tokenAddress);
          }
        }
      } catch (error) {
        console.error("Error parsing logs:", error);
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error details:", error);
      alert("Failed to deploy token. See console for details.");
    } finally {
      setIsSubmitting(false);
      setDeployERC20Info((prev) => ({
        ...prev,
        name: "",
        symbol: "",
        totalSupply: "",
      }));
    }
  };

  const { data, loading } = useQuery(GET_MY_ENTITIES, {
    pollInterval: 30000,
  });

  const tokens = data?.erc20TokenDeployeds;
  const Nfts = data?.erc721TokenDeployeds;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
              Token Launch
            </h1>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg px-4 py-2  border border-yellow-600 shadow-sm hover:shadow-glow-gold transition-all duration-300">
              <ConnectButton.Custom>
                {({ account, openAccountModal, openConnectModal, mounted }) => {
                  const connected = mounted && account;

                  return (
                    <div>
                      {connected ? (
                        <button
                          onClick={openAccountModal}
                          className="flex items-center"
                        >
                          <span className="text-white font-medium">
                            {account.displayName}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={openConnectModal}
                          className="flex items-center"
                        >
                          <span className="text-white font-medium">
                            Connect Wallet
                          </span>
                        </button>
                      )}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                Launch Your Token to the Moon 🚀
              </h2>

              <div className="flex mb-6 bg-gray-900/80 rounded-lg p-1">
                <button
                  className={`flex-1 py-2 px-4 rounded-md transition-all ${
                    tokenType === "erc20"
                      ? "bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setTokenType("erc20")}
                >
                  ERC-20 Token
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-md transition-all ${
                    tokenType === "erc721"
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setTokenType("erc721")}
                >
                  ERC-721 NFT
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Token Name
                    </label>
                    <input
                      type="text"
                      value={deployERC20Info.name}
                      onChange={(e) =>
                        setDeployERC20Info((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g. Cosmic Coin"
                      className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Token Symbol
                    </label>
                    <input
                      type="text"
                      value={deployERC20Info.symbol}
                      onChange={(e) =>
                        setDeployERC20Info((prev) => ({
                          ...prev,
                          symbol: e.target.value,
                        }))
                      }
                      placeholder="e.g. COSM"
                      className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Total Supply
                    </label>
                    <input
                      type="text"
                      value={deployERC20Info.totalSupply}
                      onChange={(e) =>
                        setDeployERC20Info((prev) => ({
                          ...prev,
                          totalSupply: e.target.value,
                        }))
                      }
                      placeholder={
                        tokenType === "erc20" ? "e.g. 1000000" : "e.g. 10000"
                      }
                      className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  {tokenType === "erc721" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Base URL (for metadata)
                      </label>
                      <input
                        type="text"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder="e.g. https://mynft.com/metadata/"
                        className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  )}

                  <div className="pt-4">
                    {isConnected ? (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                          !isConnected
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : isSubmitting
                            ? "bg-gradient-to-r from-purple-700 to-indigo-600 text-white cursor-wait animate-pulse"
                            : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-pink-500/25"
                        }`}
                      >
                        {isSubmitting ? "Launching... 🚀" : "Launch Token 🚀"}
                      </button>
                    ) : (
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg px-4 py-2  border border-yellow-600 shadow-sm hover:shadow-glow-gold transition-all duration-300">
                        <ConnectButton.Custom>
                          {({
                            account,
                            openAccountModal,
                            openConnectModal,
                            mounted,
                          }) => {
                            const connected = mounted && account;

                            return (
                              <div>
                                {connected ? (
                                  <button
                                    onClick={openAccountModal}
                                    className="flex items-center"
                                  >
                                    <span className="text-white font-medium">
                                      {account.displayName}
                                    </span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={openConnectModal}
                                    className="flex items-center"
                                  >
                                    <span className="text-white font-medium">
                                      Connect Wallet
                                    </span>
                                  </button>
                                )}
                              </div>
                            );
                          }}
                        </ConnectButton.Custom>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              {!isConnected && (
                <p className="mt-4 text-sm text-gray-400 text-center">
                  Please connect your wallet to launch a token
                </p>
              )}
            </div>
            <div className="px-6 py-4 bg-gradient-to-r from-gray-900 to-indigo-900/50 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                Gas fees will apply when deploying your token contract
              </p>
            </div>
          </div>
        </main>
        {loading ? (
          <div>loading...</div>
        ) : tokenType === "erc20" ? (
          <TokenCards events={tokens} />
        ) : (
          <NFTCards events={Nfts} />
        )}
      </div>

      {/* Success Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-indigo-900 border border-purple-500 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  Deployment Successful! 🎉
                </h3>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 animate-pulse rounded-lg" />
                <div className="bg-gray-800/80 border border-green-500/50 rounded-lg p-4 relative">
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-center text-white mb-2">
                    {tokenType === "erc20" ? "Token" : "NFT Collection"}{" "}
                    Deployed Successfully!
                  </h4>

                  <div className="space-y-3 mt-4">
                    <div>
                      <p className="text-sm text-gray-400">Name:</p>
                      <p className="text-white font-medium">
                        {deployERC20Info.name || "Your Token"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Symbol:</p>
                      <p className="text-white font-medium">
                        {deployERC20Info.symbol || "TKN"}
                      </p>
                    </div>

                    {deployedAddress && (
                      <div>
                        <p className="text-sm text-gray-400">
                          Contract Address:
                        </p>
                        <p className="text-white font-medium break-all">
                          {deployedAddress}
                        </p>
                      </div>
                    )}

                    {transactionHash && (
                      <div>
                        <p className="text-sm text-gray-400">
                          Transaction Hash:
                        </p>
                        <p className="text-white font-medium break-all">
                          {transactionHash}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col space-y-3">
                {transactionHash && (
                  <a
                    href={getExplorerUrl(transactionHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg text-white font-medium text-center transition-all flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    View Transaction on Explorer
                  </a>
                )}

                {deployedAddress && (
                  <a
                    href={getTokenExplorerUrl(deployedAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 rounded-lg text-white font-medium text-center transition-all flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    View {tokenType === "erc20" ? "Token" : "NFT Collection"} on
                    Explorer
                  </a>
                )}

                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium text-center transition-all"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 text-xs text-center text-gray-400">
                Share your new{" "}
                {tokenType === "erc20" ? "token" : "NFT collection"} with your
                community! 🚀
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
