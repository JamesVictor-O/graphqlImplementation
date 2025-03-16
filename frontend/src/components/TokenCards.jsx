import React from 'react';
import { ExternalLink, CopyCheck, Coins } from 'lucide-react';

const TokenCards = ({ events }) => {
  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-gray-700 pb-2">
        Deployed ERC20 Tokens
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event, index) => (
          <div 
            key={index} 
            className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-900/20"
          >
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-blue-400" />
                <h3 className="font-bold text-lg text-gray-100">{event.name}</h3>
              </div>
              <span className="bg-blue-900/30 text-blue-400 text-xs font-medium py-1 px-2 rounded">
                {event.symbol}
              </span>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Token Address</p>
                <div className="flex items-center justify-between">
                  <code className="text-sm text-gray-300 font-mono">
                    {truncateAddress(event.erc20Contract)}
                  </code>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => copyToClipboard(event.erc20Contract)}
                      className="p-1 hover:bg-gray-800 rounded"
                      title="Copy address"
                    >
                      <CopyCheck className="h-4 w-4 text-gray-400 hover:text-blue-400" />
                    </button>
                    <a 
                      href={`https://sepolia.etherscan.io/token/${event.erc20Contract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-800 rounded"
                      title="View on Etherscan"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-400 hover:text-blue-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-3 text-center">
              <a 
                href={`https://sepolia.etherscan.io/token/${event.erc20Contract}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center"
              >
                View on Etherscan
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenCards;
