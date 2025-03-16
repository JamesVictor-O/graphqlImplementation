import React from 'react';
import { ExternalLink, CopyCheck, Image, FileSymlink } from 'lucide-react';

const NFTCards = ({ events }) => { 
  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

 
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
   
  };

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-gray-700 pb-2">
        Deployed NFT Collections
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event, index) => (
          <div 
            key={index} 
            className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-purple-900/20"
          >
            {/* <div className="relative h-48 bg-gray-800 overflow-hidden">
              {event.url ? (
                <img 
                  src={event.url} 
                  alt={`${event.name} preview`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/400/320";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="h-16 w-16 text-gray-700" />
                </div>
              )}
              <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1">
                <a 
                  href={`https://sepolia.etherscan.io/token/${event.erc721Contract}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-full hover:bg-gray-800"
                  title="View on Etherscan"
                >
                  <ExternalLink className="h-4 w-4 text-gray-300 hover:text-purple-400" />
                </a>
              </div>
            </div> */}
            
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="font-bold text-lg text-gray-100">{event.name}</h3>
                <span className="text-purple-400 text-xs">{event.symbol}</span>
              </div>
              <span className="bg-purple-900/30 text-purple-400 text-xs font-medium py-1 px-2 rounded">
                NFT
              </span>
            </div>
            
            <div className="p-4">
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Collection Address</p>
                <div className="flex items-center justify-between">
                  <code className="text-sm text-gray-300 font-mono">
                    {truncateAddress(event.erc721Contract)}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(event.erc721Contract)}
                    className="p-1 hover:bg-gray-800 rounded"
                    title="Copy address"
                  >
                    <CopyCheck className="h-4 w-4 text-gray-400 hover:text-purple-400" />
                  </button>
                </div>
              </div>
              
            </div>
            
            <div className="flex border-t border-gray-800">
              <a 
                href={`https://sepolia.etherscan.io/token/${event.erc721Contract}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-3 text-center text-sm text-purple-400 hover:text-purple-300 flex items-center justify-center"
              >
                View on Etherscan
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
              {event.url && (
                <a 
                  href={event.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-3 text-center text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center border-l border-gray-800"
                >
                  View Metadata
                  <FileSymlink className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTCards;