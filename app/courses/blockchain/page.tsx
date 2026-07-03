import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "Blockchain & Web3 Engineering Course — Learn Solidity",
  description: "Build production-grade smart contracts on EVM chains. Master Solidity security patterns, DeFi protocol design (AMMs, lending), OpenZeppelin modules, ERC standards, ZK-Rollups, MEV resistance, and smart contract auditing.",
  keywords: ["Blockchain Course", "Learn Solidity Free", "EVM Smart Contract Course", "DeFi Security Tutorials", "Web3 Engineering", "Ethereum Development", "NFT", "DAO", "ERC-721"],
}

const blockchainModules: Module[] = [
  {
    id: "blockchain-tier-1", title: "Tier 1: Foundations — Cryptography & EVM",
    lessons: [
      {
        id: "bit-math-evm", title: "Hashing, Signatures & EVM Internals", duration: "35 min",
        description: "The mathematical trust layer. SHA-256, Elliptic Curve Digital Signatures (ECDSA), and the global state machine.",
        content: `<h2>The Trustless Architecture</h2>
<p>Blockchains replace human trust with mathematics. We use <strong>Hashing</strong> to create immutable links between blocks and <strong>Public-Key Cryptography</strong> to verify transaction ownership without middle-men.</p>
<h3>The Ethereum Virtual Machine (EVM)</h3>
<p>The EVM is a distributed state machine. Every node in the network executes the same smart contract code and reaches consensus on the final memory state, creating a 'World Computer'.</p>`
      },
      {
        id: "merkle-trees", title: "Merkle Trees & Block Structure", duration: "30 min",
        description: "Understand how Merkle trees enable light clients, efficient transaction verification, and the cryptographic structure linking each block to its parent.",
        content: `<h2>Merkle Trees</h2>
<p>A <strong>Merkle tree</strong> is a binary tree where each leaf node is a hash of a transaction, and each internal node is the hash of its two children. The root (Merkle Root) summarizes all transactions in the block with a single 32-byte hash.</p>
<h3>SPV Verification</h3>
<p>Simplified Payment Verification (SPV) allows a light client to verify that a transaction is included in a block without downloading the entire block — it only needs the Merkle proof: a path of hashes from the leaf to the root.</p>
<pre><code class="language-typescript">import { ethers } from 'ethers';

function getMerkleRoot(transactions: string[]): string {
  if (transactions.length === 0) return ethers.ZeroHash;

  let layer = transactions.map(tx => ethers.keccak256(tx));

  while (layer.length > 1) {
    const nextLayer: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      if (i + 1 < layer.length) {
        nextLayer.push(
          ethers.keccak256(
            ethers.solidityPacked(['bytes32', 'bytes32'], [layer[i], layer[i + 1]])
          )
        );
      } else {
        nextLayer.push(layer[i]); // Odd node propagates up
      }
    }
    layer = nextLayer;
  }
  return layer[0];
}</code></pre>
<h3>Block Header Structure</h3>
<p>Each block header contains: <strong>parentHash</strong> (link to previous), <strong>stateRoot</strong> (entire system state), <strong>transactionsRoot</strong> (Merkle root of txs), <strong>receiptsRoot</strong>, <strong>timestamp</strong>, <strong>difficulty</strong>, and <strong>nonce</strong>. This creates an immutable chain — changing one transaction changes every subsequent block's hash.</p>`
      },
      {
        id: "consensus-mechanisms", title: "Consensus Mechanisms: PoW vs PoS", duration: "35 min",
        description: "Compare Proof of Work and Proof of Stake. Understand finality, slashing conditions, and how Ethereum's transition to PoS reduced energy consumption by 99.9%.",
        content: `<h2>The Consensus Problem</h2>
<p>In a decentralized network, nodes must agree on the state of the ledger without a central authority. <strong>Consensus mechanisms</strong> solve the Byzantine Generals Problem — ensuring all honest nodes converge on the same truth even with malicious actors present.</p>
<h3>Proof of Stake (Casper FFG)</h3>
<p>Validators stake 32 ETH as collateral. One validator is pseudo-randomly selected to propose a block. Other validators attest to its validity. If a validator behaves dishonestly, their stake is <strong>slashed</strong> — destroyed by the protocol.</p>
<pre><code class="language-python"># Simplified Casper FFG finality check
def should_finalize(attestations: list, validator_stakes: dict) -> bool:
    """
    A checkpoint is finalized when:
    1. It receives attestations representing >2/3 of total stake
    2. The previous checkpoint was already justified
    """
    total_stake = sum(validator_stakes.values())
    attested_stake = sum(
        validator_stakes[att.validator]
        for att in attestations
        if att.target_epoch == current_epoch
    )
    return attested_stake > (2 / 3) * total_stake</code></pre>
<h3>Why PoS Wins</h3>
<p>Ethereum's transition to Proof of Stake reduced energy consumption by ~99.95% (from ~100 TWh/yr to ~0.01 TWh/yr). It also enables <strong>finality</strong> — after two epochs (~12.8 min), a block is economically irreversible because reverting it would require burning >1/3 of all staked ETH.</p>`,
        quiz: [
          {
            question: "What happens to a validator that proposes two conflicting blocks at the same slot in Proof of Stake?",
            options: ["They receive a warning", "Their stake is slashed", "They are banned from the network", "Nothing — the network picks one"],
            correctIndex: 1,
            explanation: "Proposing conflicting blocks is a slashable offense. The protocol destroys a portion of the validator's staked ETH as a penalty, making attacks economically infeasible."
          }
        ]
      }
    ]
  },
  {
    id: "blockchain-tier-2", title: "Tier 2: Intermediate — Smart Contract Engineering",
    lessons: [
      {
        id: "solidity-defi", title: "Solidity Patterns & DeFi Architecture", duration: "50 min",
        description: "Building verifiable logic. Interfaces, inheritance, and the Checks-Effects-Interactions (CEI) security pattern.",
        content: `<h2>Solidity: The Language of Value</h2>
<p>Solidity is a statically-typed language designed for the EVM. Because code is immutable once deployed, we follow strict patterns to ensure security.</p>
<pre><code class="language-solidity">function deposit() public payable {
    balances[msg.sender] += msg.value;
}</code></pre>
<h3>DeFi Protocol Design</h3>
<p>We build <strong>Decentralized Finance (DeFi)</strong> primitives like AMMs and Lending Pools using <strong>ERC-20</strong> and <strong>ERC-721</strong> standards. In Tier 2, we use <strong>Hardhat</strong> to test contracts against a local blockchain fork.</p>`
      },
      {
        id: "erc-standards", title: "ERC Standards: Tokens & Assets", duration: "40 min",
        description: "Deep dive into ERC-20, ERC-721, and ERC-1155. Understand the interfaces, use cases, and security considerations for each token standard.",
        content: `<h2>The Token Standards</h2>
<p>The Ethereum community standardized token interfaces through <strong>Ethereum Improvement Proposals (EIPs)</strong>. These interfaces ensure interoperability — any wallet, exchange, or DeFi protocol can work with any token that follows the standard.</p>
<h3>ERC-721: Non-Fungible Tokens</h3>
<p>Each ERC-721 token is unique with its own <code>tokenId</code>. They represent ownership of distinct assets — digital art, real estate, in-game items. The standard includes <code>ownerOf(tokenId)</code>, <code>safeTransferFrom</code>, and metadata extensions.</p>
<pre><code class="language-solidity">// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OpenSyntaxNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    uint256 public constant MAX_SUPPLY = 10000;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("OpenSyntax NFT", "OSNFT") {}

    function safeMint(address to, string memory uri) public onlyOwner {
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}</code></pre>
<h3>ERC-1155: Multi-Token Standard</h3>
<p>ERC-1155 combines ERC-20 and ERC-721 in a single contract. It can manage fungible tokens, non-fungible tokens, and semi-fungible tokens (like event tickets that become souvenirs) using a single <code>balanceOf</code> function with an <code>id</code> parameter. This dramatically reduces gas costs for collections.</p>`
      },
      {
        id: "hardhat-testing", title: "Hardhat Testing & Deployment", duration: "45 min",
        description: "Master Hardhat for local development, mainnet forking, gas optimization, and automated testing with ethers.js and Chai matchers.",
        content: `<h2>Hardhat: The Developer Toolchain</h2>
<p><strong>Hardhat</strong> is the industry-standard development environment for EVM smart contracts. It provides local network simulation, mainnet forking, console logging, and Solidity stack traces — making debugging possible.</p>
<h3>Mainnet Forking</h3>
<p>Forking mainnet allows you to test against real protocol state (liquidity pools, token balances) without spending real ETH. This is essential for testing complex DeFi interactions.</p>
<pre><code class="language-typescript">import { ethers } from "hardhat";
import { expect } from "chai";

describe("DeFi Interaction Test", function () {
  it("should swap on forked Uniswap", async function () {
    // Fork from a recent block
    await network.provider.request({
      method: "hardhat_reset",
      params: [{
        forking: {
          jsonRpcUrl: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
          blockNumber: 19000000
        }
      }]
    });

    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const usdc = await ethers.getContractAt("IERC20", USDC);

    // Impersonate a whale
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x...WhaleAddress..."]
    });

    const signer = await ethers.getSigner("0x...WhaleAddress...");
    const balance = await usdc.balanceOf(signer.address);
    expect(balance).to.be.gt(0);
  });

  it("should optimize gas with assembly", async function () {
    const contract = await ethers.deployContract("GasOptimized");
    const tx = await contract.optimizedFunction();
    const receipt = await tx.wait();

    // Log gas used
    console.log("Gas used:", receipt!.gasUsed);
    expect(receipt!.gasUsed).to.be.lt(100000);
  });
});</code></pre>
<h3>Deployment Scripts</h3>
<p>Use <strong>Hardhat Ignition</strong> or custom scripts with <strong>ethers.js</strong> to deploy, verify on Etherscan, and set up proxy contracts for upgradeable patterns.</p>`,
        quiz: [
          {
            question: "What is the primary benefit of mainnet forking in Hardhat?",
            options: ["It deploys contracts to mainnet for free", "It simulates real protocol state without spending real ETH", "It runs tests 10x faster", "It automatically audits your code"],
            correctIndex: 1,
            explanation: "Mainnet forking allows you to test against real DeFi protocols, token balances, and liquidity pools locally — enabling realistic integration tests without any gas costs or financial risk."
          }
        ]
      }
    ]
  },
  {
    id: "blockchain-tier-3", title: "Tier 3: Production — L2 Scaling & Advanced Security",
    lessons: [
      {
        id: "rollups-zk", title: "ZK-Rollups, MEV & Smart Contract Auditing", duration: "65 min",
        description: "Scaling to the next billion users. Zero-Knowledge proofs, Layer 2 architectures, and protecting against reentrancy attacks.",
        content: `<h2>The Scalability Frontier</h2>
<p>Ethereum Mainnet is too slow for global commerce. We move execution to <strong>Layer 2 Rollups</strong>. <strong>ZK-Rollups</strong> use complex math (Validity Proofs) to compress thousands of transactions into a single on-chain proof.</p>
<h3>Advanced Security & Auditing</h3>
<p>To protect millions in TVL (Total Value Locked), we must defend against <strong>Reentrancy Hacks</strong> and <strong>Flash Loan Attacks</strong>. We'll perform a manual audit of a DeFi protocol to find common logic flaws.</p>
<p><strong>Econ Tip:</strong> Understand <strong>MEV (Maximal Extractable Value)</strong> to build contracts that are resilient against sandwich attacks and front-running by sophisticated network bots.</p>`
      },
      {
        id: "flash-loans-defi", title: "Flash Loans & DeFi Attack Vectors", duration: "50 min",
        description: "Explore flash loan mechanics, the famous DeFi attacks (bZx, Harvest, Cream), and how to write contracts that are resistant to price oracle manipulation and sandwich attacks.",
        content: `<h2>Flash Loans: Uncollateralized Capital</h2>
<p>A <strong>flash loan</strong> lets you borrow any amount of tokens with zero collateral, as long as you return it within the same transaction. If you fail to repay, the entire transaction reverts — as if it never happened. This atomicity is unique to blockchain.</p>
<h3>Price Oracle Manipulation</h3>
<p>Flash loans enable a dangerous attack: borrow millions of DAI, swap it in a low-liquidity pool to manipulate the price, then trigger a dependent protocol that uses that pool as an oracle. The attacker profits from the manipulated price, repays the loan, and keeps the difference.</p>
<pre><code class="language-solidity">// Vulnerable: using a spot price from a single AMM as oracle
function getCollateralRatio(address token) public view returns (uint256) {
    // THIS IS VULNERABLE — spot price can be manipulated with a flash loan
    (uint256 reserve0, uint256 reserve1) = uniswapV2Pool.getReserves();
    uint256 spotPrice = reserve0 / reserve1;

    uint256 collateralValue = getCollateralValue(msg.sender);
    uint256 debtValue = getDebtValue(msg.sender);
    return (collateralValue * 1e18) / debtValue;
}

// Secure: use a TWAP oracle (time-weighted average price)
function getSecurePrice(address token) public view returns (uint256) {
    // Uniswap V3 TWAP — averages price over last 30 minutes
    uint32[] memory secondsAgos = [1800, 0];
    (int56[] memory tickCumulatives,) = uniswapV3Pool.observe(secondsAgos);

    // TWAP = average tick over the period
    int56 tickDelta = tickCumulatives[1] - tickCumulatives[0];
    return TickMath.getSqrtRatioAtTick(int24(tickDelta / 1800)) ** 2;
}</code></pre>
<h3>Reentrancy Protection</h3>
<p>Always follow the <strong>Checks-Effects-Interactions</strong> pattern: update internal state BEFORE calling external contracts. Use <strong>OpenZeppelin's ReentrancyGuard</strong> as a second line of defense.</p>`
      },
      {
        id: "upgradeable-contracts", title: "Smart Contract Upgrade Patterns", duration: "40 min",
        description: "Implement upgradeable contracts using UUPS and transparent proxy patterns. Understand the risks of storage collisions and how OpenZeppelin's upgrades plugin handles them.",
        content: `<h2>Eternal Storage & Proxy Patterns</h2>
<p>Smart contracts on Ethereum are immutable by default. To fix bugs or add features, we deploy a <strong>proxy contract</strong> that delegates calls to an <strong>implementation contract</strong>. Users always interact with the proxy address — we can swap the implementation behind it via governance vote.</p>
<h3>UUPS (Universal Upgradeable Proxy Standard)</h3>
<p>In the UUPS pattern, the upgrade logic lives in the implementation contract itself. This saves gas on every call (no need to store upgrade functions in the proxy) but means you must never remove the upgrade function — or your contract becomes permanently frozen.</p>
<pre><code class="language-solidity">// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MyTokenV1 is UUPSUpgradeable, OwnableUpgradeable {
    uint256 public value;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(uint256 _value) public initializer {
        __UUPSUpgradeable_init();
        __Ownable_init(msg.sender);
        value = _value;
    }

    function setValue(uint256 _value) external onlyOwner {
        value = _value;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}

// V2 adds a new function without breaking storage
contract MyTokenV2 is MyTokenV1 {
    function getValue() external view returns (uint256) {
        return value * 2;
    }
}</code></pre>
<h3>Storage Collision Risks</h3>
<p>When upgrading, new variables must be appended AFTER existing ones — never inserted between them. OpenZeppelin's <strong>Upgrades Plugins</strong> run storage layout checks in CI to prevent this.</p>`
      }
    ]
  },
  {
    id: "defi-deep-dive", title: "Module 4: DeFi Deep Dive — AMMs, Lending & Yield",
    lessons: [
      {
        id: "amm-uniswap", title: "AMM Mechanics: Uniswap V2 & V3", duration: "55 min",
        description: "Master Automated Market Maker design. Understand constant product formula, concentrated liquidity, fee tiers, and how to build a simple DEX from scratch.",
        content: `<h2>The AMM Revolution</h2>
<p><strong>Automated Market Makers (AMMs)</strong> replaced traditional order books with liquidity pools. Instead of matching buyers and sellers, LPs deposit pairs of tokens into a pool. Traders swap against the pool at prices determined by a mathematical formula.</p>
<h3>Uniswap V2: x * y = k</h3>
<p>The constant product formula ensures that the product of reserve quantities remains constant after a trade. A trade that increases <code>x</code> must decrease <code>y</code> proportionally — creating a price curve where larger trades suffer more slippage.</p>
<pre><code class="language-solidity">// Simplified Uniswap V2 swap logic
function swap(uint256 amountIn, address tokenIn) external returns (uint256) {
    require(amountIn > 0, "Invalid amount");

    (uint256 reserveIn, uint256 reserveOut) = tokenIn == token0
        ? (reserve0, reserve1)
        : (reserve1, reserve0);

    // 0.3% fee
    uint256 amountInWithFee = amountIn * 997;
    uint256 numerator = amountInWithFee * reserveOut;
    uint256 denominator = (reserveIn * 1000) + amountInWithFee;
    uint256 amountOut = numerator / denominator;

    // Ensure k invariant holds
    uint256 balanceIn = IERC20(tokenIn).balanceOf(address(this));
    uint256 balanceOut = IERC20(tokenOut).balanceOf(address(this));

    require(
        balanceIn * balanceOut >= reserveIn * reserveOut,
        "UniswapV2: K"
    );

    IERC20(tokenOut).transfer(msg.sender, amountOut);
    return amountOut;
}</code></pre>
<h3>Uniswap V3: Concentrated Liquidity</h3>
<p>V3 allows LPs to concentrate liquidity within a custom price range, earning higher fees but taking on <strong>impermanent loss risk</strong> if the price exits their range. This is capital-efficient — 1/10th the capital can earn the same fees as V2.</p>`
      },
      {
        id: "lending-aave", title: "Lending Protocols: Aave & Compound", duration: "45 min",
        description: "Build and interact with lending pools. Understand supply/borrow mechanics, variable vs stable interest rates, liquidation thresholds, and the role of aTokens/cTokens.",
        content: `<h2>Money Markets on Chain</h2>
<p>Lending protocols allow users to <strong>supply</strong> assets to earn interest and <strong>borrow</strong> assets by overcollateralizing. The protocol algorithmically sets interest rates based on <strong>utilization rate</strong> — the ratio of borrowed assets to total supplied assets.</p>
<h3>Liquidation Engine</h3>
<p>If a borrower's position falls below the <strong>liquidation threshold</strong> (e.g., 85% LTV), anyone can repay part of their debt and seize their collateral at a discount (typically 5-10%). This ensures the protocol remains solvent.</p>
<pre><code class="language-typescript">import { ethers } from "ethers";

// Aave V3 — Supply & Borrow using the Pool contract
const POOL_ADDRESS = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
const pool = new ethers.Contract(POOL_ADDRESS, AAVE_POOL_ABI, signer);

// Supply 10 ETH as collateral
const ethAmount = ethers.parseEther("10");
await pool.supply("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", ethAmount, signer.address, 0);

// Borrow 50,000 USDC against it (assuming ~70% LTV)
const usdcAmount = ethers.parseUnits("50000", 6);
await pool.borrow("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", usdcAmount, 2, 0, signer.address);

// Check health factor (must be > 1)
const healthFactor = await pool.getUserAccountData(signer.address);
console.log("Health factor:", healthFactor.healthFactor.toString());
// If &lt; 1 → position can be liquidated</code></pre>
<h3>Interest Rate Model</h3>
<p>When utilization is below optimal (80% for Aave), rates rise slowly to encourage borrowing. Above 80%, rates spike sharply (to 100%+ APY) to incentivize supplying and quickly bring utilization down — this is the <strong>kink model</strong>.</p>`,
        quiz: [
          {
            question: "What happens when a borrower's health factor drops below 1 in Aave?",
            options: ["Their debt is forgiven", "Their position becomes liquidatable", "They receive a warning", "The protocol pauses their borrows"],
            correctIndex: 1,
            explanation: "A health factor below 1 means the borrowed value exceeds the collateral value. Liquidators can repay the debt and claim the collateral at a discount, ensuring the protocol remains solvent."
          }
        ]
      },
      {
        id: "yield-farming", title: "Yield Farming & Liquidity Mining", duration: "35 min",
        description: "Understand yield optimization strategies, staking rewards, liquidity mining programs, and how to build a staking contract with reward distribution logic.",
        content: `<h2>DeFi Yield Strategies</h2>
<p><strong>Yield farming</strong> is the practice of staking or providing liquidity to earn rewards — often in the protocol's governance token. Strategies range from simple single-sided staking to complex multi-protocol loops (leveraged yield farming).</p>
<h3>Staking Rewards Contract</h3>
<p>A staking contract accepts LP tokens and distributes rewards proportionally to each staker's share. The key design challenge is <strong>reward calculation</strong> — computing accrued rewards efficiently without iterating over all stakers on every interaction.</p>
<pre><code class="language-solidity">// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StakingRewards {
    IERC20 public stakingToken;
    IERC20 public rewardsToken;

    uint256 public rewardRate;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public rewards;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) private _balances;

    uint256 private _totalSupply;

    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) return rewardPerTokenStored;
        return rewardPerTokenStored + (
            (block.timestamp - lastUpdateTime) * rewardRate * 1e18 / _totalSupply
        );
    }

    function earned(address account) public view returns (uint256) {
        return ((_balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18)
            + rewards[account];
    }

    function stake(uint256 amount) external updateReward(msg.sender) {
        _totalSupply += amount;
        _balances[msg.sender] += amount;
        stakingToken.transferFrom(msg.sender, address(this), amount);
    }

    function getReward() external updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.transfer(msg.sender, reward);
        }
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }
}</code></pre>`
      },
      {
        id: "mev-flashbots", title: "MEV: Frontrunning, Sandwich Attacks & Flashbots", duration: "50 min",
        description: "Explore Maximal Extractable Value — how searchers extract profit from transaction ordering, and how Flashbots creates a fair MEV market that doesn't harm users.",
        content: `<h2>MEV: The Invisible Tax</h2>
<p><strong>Maximal Extractable Value (MEV)</strong> is the profit that block proposers (validators) can extract by reordering, including, or excluding transactions within a block. Searchers run complex algorithms to identify profitable opportunities and pay validators to include their bundles.</p>
<h3>Sandwich Attacks</h3>
<p>A classic MEV extraction: when a user submits a large swap, a searcher's bots detect it in the mempool, buy the token before the user's transaction (frontrun), then sell after (backrun), profiting from the price impact of the user's trade. The user gets a worse price.</p>
<pre><code class="language-typescript">// Flashbots — sending bundles directly to validators
import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle';

const flashbots = await FlashbotsBundleProvider.create(
  ethersProvider,
  AUTH_SIGNER,
  'https://relay.flashbots.net'
);

// Build a bundle: repay debt + withdraw collateral in one atomic sequence
const bundle = [
  {
    transaction: {
      to: AAVE_POOL,
      data: aaveRepay.encode(user, debtAmount),
      gasLimit: 100000,
    },
    signer: userWallet,
  },
  {
    transaction: {
      to: AAVE_POOL,
      data: aaveWithdraw.encode(collateralAsset, collateralAmount),
      gasLimit: 100000,
    },
    signer: userWallet,
  },
];

// Submit bundle — it only executes if included in a block
const bundleResponse = await flashbots.sendBundle(bundle, targetBlockNumber);
const bundleReceipt = await bundleResponse.wait();
console.log('Bundle included in block:', bundleReceipt.blockNumber);</code></pre>
<h3>MEV Protection Strategies</h3>
<p>Use <strong>Flashbots RPC</strong> to submit transactions directly to validators (bypassing the public mempool). Use <strong>commit-reveal schemes</strong> for voting/auctions. Set <strong>slippage protection</strong> on swaps. Design contracts with <strong>MEV-resistant ordering</strong> (e.g., Uniswap V3's TWAP oracle).</p>`
      }
    ]
  },
  {
    id: "nfts-daos", title: "Module 5: NFTs & DAOs — Digital Ownership & Governance",
    lessons: [
      {
        id: "erc-721-1155", title: "ERC-721 & ERC-1155 Standards", duration: "40 min",
        description: "Build production NFT contracts. Master ERC-721 enumerability, ERC-1155 batch operations, lazy minting, and EIP-2981 royalty standard.",
        content: `<h2>NFT Standards in Practice</h2>
<p>Two dominant standards power the NFT ecosystem: <strong>ERC-721</strong> for unique assets (1-of-1 art, collectibles) and <strong>ERC-1155</strong> for multi-token contracts (game items, fractionalized assets, semi-fungible tokens).</p>
<h3>ERC-721 with Royalties (EIP-2981)</h3>
<p>EIP-2981 standardizes royalty payments — creators earn a percentage of every secondary sale. Marketplaces like OpenSea read this interface and automatically pay royalties.</p>
<pre><code class="language-solidity">// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OpenSyntaxNFT is ERC721Enumerable, ERC2981, Ownable {
    uint256 private _nextTokenId;
    string private _baseTokenURI;

    constructor() ERC721("OpenSyntax Collection", "OSC") {
        _setDefaultRoyalty(msg.sender, 500); // 5% royalty
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Lazy minting: signature-based minting to save gas
    function lazyMint(bytes calldata signature, address to) external {
        bytes32 message = keccak256(abi.encodePacked(to, _nextTokenId));
        require(_verify(message, signature), "Invalid signature");
        _safeMint(to, _nextTokenId++);
    }
}</code></pre>`
      },
      {
        id: "nft-metadata", title: "NFT Metadata & Decentralized Storage", duration: "35 min",
        description: "Store NFT metadata on IPFS and Arweave. Understand the metadata JSON schema, on-chain vs off-chain metadata trade-offs, and SVG/HTML on-chain art.",
        content: `<h2>Where Does NFT Data Live?</h2>
<p>An NFT's <code>tokenURI</code> points to a JSON metadata file containing the <code>name</code>, <code>description</code>, <code>image</code>, and <code>attributes</code> (traits). Storing this metadata <strong>decentralized</strong> is critical — if it lives on a centralized server, the NFT can 'break' if the server goes down.</p>
<h3>On-Chain vs Off-Chain</h3>
<p><strong>Off-chain</strong> (IPFS, Arweave): cheaper, unlimited size. The metadata hash is stored on-chain, ensuring immutability. <strong>On-chain</strong>: expensive but fully self-contained — no external dependencies. Ideal for fully decentralized collections.</p>
<pre><code class="language-json">{
  "name": "OpenSyntax Genesis #42",
  "description": "The genesis collection of the OpenSyntax Academy. Each NFT grants access to exclusive course content and community voting rights.",
  "image": "ipfs://bafybeig7vq6h5q7a4v5q7a4v5q7a4v5q7a4v5q7a4v5q7a4v5q7a4/42.png",
  "animation_url": "ipfs://bafybeig7vq6/42.glb",
  "external_url": "https://opensyntax.academy/nft/42",
  "attributes": [
    { "trait_type": "Tier", "value": "Gold" },
    { "trait_type": "Access Level", "value": "Admin" },
    { "trait_type": "Edition", "value": "Limited" },
    { "display_type": "date", "trait_type": "Minted", "value": 1717200000 }
  ]
}</code></pre>
<h3>Generative SVG Art</h3>
<p>Many collections store art fully on-chain as SVG. The <code>tokenURI</code> returns a <code>data:application/json;base64</code> URI containing inline SVG — no external storage needed. Platforms like Zora and Manifold popularized this pattern.</p>`
      },
      {
        id: "governance-tokens", title: "Governance Tokens & On-Chain Voting", duration: "40 min",
        description: "Build a DAO governance system. Implement ERC-20 voting tokens, delegation, quorum requirements, and execute treasury transactions via Timelock contracts.",
        content: `<h2>DAO Governance Architecture</h2>
<p>DAOs use <strong>governance tokens</strong> that represent voting power. Token holders propose and vote on changes to protocol parameters, treasury allocations, and contract upgrades. The canonical implementation is <strong>OpenZeppelin Governor</strong> — a modular, battle-tested framework.</p>
<h3>Voting Power & Delegation</h3>
<p>Holders can <strong>delegate</strong> their voting power to another address without transferring tokens. This enables liquid democracy — passive holders delegate to active community members. Delegation is tracked via <strong>ERC-20Votes</strong> which maintains checkpoints for historical balances.</p>
<pre><code class="language-solidity">// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/compatibility/GovernorCompatibilityBravo.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract OpenSyntaxDAO is
    Governor,
    GovernorCompatibilityBravo,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    constructor(IVotes _token, TimelockController _timelock)
        Governor("OpenSyntax DAO")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4) // 4% of supply needed for quorum
        GovernorTimelockControl(_timelock)
    {}

    function proposalThreshold() public pure override returns (uint256) {
        return 10000e18; // 10,000 tokens needed to propose
    }

    function votingDelay() public pure override returns (uint256) {
        return 1 days; // Delay before voting starts
    }

    function votingPeriod() public pure override returns (uint256) {
        return 3 days; // Voting period duration
    }
}</code></pre>
<h3>Timelock & Execution</h3>
<p>Passed proposals are queued in a <strong>TimelockController</strong> with a delay (e.g., 2 days). This gives users time to exit if they disagree with a malicious proposal and allows security reviewers to verify the calldata before execution.</p>`,
        quiz: [
          {
            question: "What is the purpose of the timelock in a DAO governance system?",
            options: ["To slow down voting", "To give users time to exit before a proposal executes and allow security review", "To increase gas costs", "To prevent proposals from passing"],
            correctIndex: 1,
            explanation: "The timelock introduces a mandatory delay (e.g., 2 days) between a proposal passing and its execution. This allows community members to review the calldata, exit if they disagree, and security researchers to identify malicious actions before they're executed."
          }
        ]
      },
      {
        id: "snapshot-voting", title: "Snapshot Voting & Off-Chain Governance", duration: "30 min",
        description: "Use Snapshot for gasless off-chain voting. Set up voting strategies (token balance, delegated power, quadratic voting) and execute on-chain via proposal execution contracts.",
        content: `<h2>Gasless Governance with Snapshot</h2>
<p><strong>Snapshot</strong> is an off-chain voting system that uses IPFS to store votes, signed messages for authentication, and a hub to tally results. Since votes are not submitted on-chain, they cost zero gas. Only the final execution (if needed) requires an on-chain transaction.</p>
<h3>Voting Strategies</h3>
<p>Snapshot supports multiple strategies: <strong>token balance</strong> (1 token = 1 vote), <strong>delegated balance</strong> (mirrors on-chain delegation), <strong>quadratic voting</strong> (cost of votes increases quadratically — prevents whales from dominating), and custom logic through <strong>Snapshot.js</strong>.</p>
<pre><code class="language-typescript">// Snapshot.js — Creating and casting a vote
import snapshot from '@snapshot-labs/snapshot.js';

const hub = 'https://hub.snapshot.org';
const client = new snapshot.Client712(hub);

// Create a proposal
const proposalReceipt = await client.proposal(wallet, wallet.address, {
  space: 'opensyntax.eth',
  type: 'single-choice',
  title: 'Upgrade Treasury Multi-Sig Signers',
  body: 'Proposal to add two new signers to the treasury multi-sig wallet...',
  choices: ['For', 'Against', 'Abstain'],
  start: Math.floor(Date.now() / 1000),
  end: Math.floor(Date.now() / 1000) + 259200, // 3 days
  snapshot: await getSnapshotBlock(),
  network: '1',
  strategies: [
    { name: 'erc20-balance-of', params: { address: '0x...', symbol: 'OSC', decimals: 18 } }
  ],
});

// Cast a vote
const voteReceipt = await client.vote(wallet, wallet.address, {
  space: 'opensyntax.eth',
  proposal: proposalReceipt.id,
  type: 'single-choice',
  choice: 1, // 'For'
  metadata: {}
});</code></pre>
<h3>On-Chain Execution Bridge</h3>
<p>When Snapshot proposals need on-chain action (e.g., transferring treasury funds), the DAO uses a <strong>Gnosis Safe</strong> or <strong>TimelockController</strong>. The proposal passes on Snapshot, then a trusted executor submits the on-chain transaction that the DAO has signaled approval for.</p>`
      }
    ]
  }
]

export default function BlockchainPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="Blockchain & Web3 Engineering"
        description="Master the decentralized web. From cryptographic fundamentals and Solidity patterns to L2 scaling and advanced smart contract security auditing."
        category="Blockchain"
        accentColor="#F6851B"
        modules={blockchainModules}
        instructor="Patrick Collins"
        rating={4.9}
        reviewCount={310}
        lastUpdated="Mar 2026"
      />
    </div>
  )
}
