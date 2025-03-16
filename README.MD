# Token Launch DApp 🚀

Welcome to **Token Launch DApp**, a decentralized application (DApp) that allows users to deploy their own **ERC-20 tokens** or **ERC-721 NFTs** without writing a single line of code! Built with modern web3 technologies, this project leverages **The Graph** for efficient and decentralized data querying, providing a seamless user experience.

---

## Features ✨

- **ERC-20 Token Deployment**: Easily create your own fungible tokens with a name, symbol, and total supply.
- **ERC-721 NFT Deployment**: Launch your own NFT collection with metadata support.
- **No Coding Required**: A user-friendly interface abstracts away the complexity of smart contract deployment.
- **Wallet Integration**: Connect your wallet using **RainbowKit** and **Wagmi** for seamless Ethereum interactions.
- **Real-Time Data**: Uses **The Graph** to fetch and display deployed tokens and NFTs in real-time.
- **Transaction Tracking**: View your deployment transactions on **Etherscan** or other supported block explorers.
- **Responsive UI**: A sleek and modern design built with **Tailwind CSS**.

---

## Technologies Used 🛠️

- **Frontend**:
  - React.js
  - Tailwind CSS (for styling)
  - RainbowKit (for wallet connection)
  - Wagmi (for Ethereum interactions)
  - Apollo Client (for querying The Graph)
- **Smart Contracts**:
  - Solidity (for ERC-20 and ERC-721 contracts)
  - Ethers.js (for contract interaction)
- **Decentralized Data**:
  - The Graph (for indexing and querying blockchain data)
- **Blockchain**:
  - Ethereum (Sepolia testnet or mainnet)
- **Other Tools**:
  - Vite (for fast development builds)
  - TypeScript (for type safety)

---

## How It Works 🧠

1. **Wallet Connection**:
   - Users connect their Ethereum wallet (e.g., MetaMask) using RainbowKit.
   - The app detects the connected wallet address and network.

2. **Token Deployment**:
   - Users fill out a form with details like token name, symbol, and total supply.
   - For NFTs, users also provide a base URL for metadata.
   - The app interacts with a pre-deployed smart contract factory to deploy the token or NFT collection.

3. **Smart Contract Interaction**:
   - The app uses **Wagmi** to send transactions to the Ethereum network.
   - The factory contract deploys the token or NFT and emits events.

4. **Real-Time Data Fetching**:
   - The app uses **The Graph** to index and query deployed tokens and NFTs.
   - Users can view their deployed tokens and NFTs in real-time.

5. **Transaction Tracking**:
   - After deployment, users can view their transaction on Etherscan or other block explorers.
   - The app provides links to the transaction and token/NFT contract.

---

## Project Structure 📂
token-launch-dapp/
├── public/ # Static assets
├── src/
│ ├── components/ # Reusable React components
│ ├── utils/ # Utility functions and constants
│ ├── contracts/ # Smart contract ABIs and addresses
│ ├── styles/ # Tailwind CSS or custom styles
│ ├── App.tsx # Main application component
│ ├── main.tsx # Entry point
│ └── LandingPage.tsx # Main landing page component
├── .env # Environment variables
├── vite.config.ts # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
└── README.md # Project documentation


---

## Setup Instructions 🛠️

### Prerequisites

- Node.js (v18 or higher)
- Yarn or npm
- MetaMask or any Ethereum wallet
- An Ethereum RPC endpoint (e.g., Alchemy, Infura)
- A subgraph endpoint (if using The Graph)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/token-launch-dapp.git
   cd token-launch-dapp

##   Smart Contract Details 📜
The app interacts with a factory contract that deploys ERC-20 and ERC-721 tokens. The contract emits events that are indexed by The Graph for real-time data fetching.

Example Events
ERC20TokenDeployed:
event ERC20TokenDeployed(address indexed tokenAddress, string name, string symbol, uint256 totalSupply);

ERC721TokenDeployed:
event ERC721TokenDeployed(address indexed tokenAddress, string name, string symbol, address owner, string baseUrl);

## Subgraph
The subgraph listens to these events and indexes the deployed tokens and NFTs. You can query the subgraph using GraphQL to fetch data like:

Token/NFT address

Name and symbol

Total supply (for ERC-20)

Owner (for ERC-721)

## Contributing 🤝

Contributions are welcome! If you'd like to contribute, please follow these steps:

Fork the repository.

Create a new branch for your feature or bugfix.

Commit your changes.

Submit a pull request.

