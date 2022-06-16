/**
 * Uploads to arweave using Bundlr and payments are made in SOL (Recommended
 * option. Works on mainnet and devnet. Files are only stored for 7 days on
 * devnet.)
 */
const ARWEAVE_SOL = 'arweave-sol';
/**
 * Uploads to arweave and payments are made in AR (only works in mainnet and
 * requires an Arweave wallet)
 */

const ARWEAVE_BUNDLE = 'arweave-bundle';
/** Uploads to IPFS (must specify either Infura Project ID or Secret Key) */

const IPFS = 'ipfs';
/** Uploads to NFT.Storage (no payment required, works on all networks) */

const NFT_STORAGE = 'nft-storage';
/** Uploads to AWS (must specify AWS Bucket name) */

const AWS = 'aws';
/** Arweave specific storages */

const ArweaveStorages = [ARWEAVE_SOL, ARWEAVE_BUNDLE];
/** The existing storage options */

const CandyMachineStorages = [...ArweaveStorages, IPFS, NFT_STORAGE, AWS];
/** Available storage options */

export { ARWEAVE_BUNDLE, ARWEAVE_SOL, AWS, CandyMachineStorages, IPFS, NFT_STORAGE };
//# sourceMappingURL=Storage.mjs.map