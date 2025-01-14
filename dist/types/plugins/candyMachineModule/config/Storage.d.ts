/**
 * Uploads to arweave using Bundlr and payments are made in SOL (Recommended
 * option. Works on mainnet and devnet. Files are only stored for 7 days on
 * devnet.)
 */
export declare const ARWEAVE_SOL = "arweave-sol";
/**
 * Uploads to arweave and payments are made in AR (only works in mainnet and
 * requires an Arweave wallet)
 */
export declare const ARWEAVE_BUNDLE = "arweave-bundle";
/** Uploads to IPFS (must specify either Infura Project ID or Secret Key) */
export declare const IPFS = "ipfs";
/** Uploads to NFT.Storage (no payment required, works on all networks) */
export declare const NFT_STORAGE = "nft-storage";
/** Uploads to AWS (must specify AWS Bucket name) */
export declare const AWS = "aws";
/** Arweave specific storages */
declare const ArweaveStorages: readonly ["arweave-sol", "arweave-bundle"];
/** The existing storage options */
export declare const CandyMachineStorages: readonly ["arweave-sol", "arweave-bundle", "ipfs", "nft-storage", "aws"];
/** Available storage options */
export declare type CandyMachineStorage = typeof CandyMachineStorages[number];
declare type BaseStorageConfig = {
    awsS3Bucket?: string;
    infuraProjectId?: string;
    ipfsSecretKey?: string;
    nftStorageKey?: string;
};
/**
 * Arweave specific Storage Options with required extra props
 * @property arweaveJwk - Arweave JWK (JSON Web Key) wallet file
 */
declare type ArweaveStorageConfig = BaseStorageConfig & {
    storage: typeof ArweaveStorages[number];
    arweaveJwk: string;
};
/**
 * IPFS specific Storage Options with required extra props
 * @property ipfsInfuraProjectId - Infura Project ID for IPFS
 * @property ipfsInfuraSecret - Infura Project Secret for IPFS
 */
declare type IpfsStorageConfig = BaseStorageConfig & {
    storage: typeof IPFS;
    infuraProjectId: string;
    ipfsSecretKey: string;
};
/**
 * NftStorage specific Storage Options with required extra props
 * @property nftStorageKey - NFT.Storage API Key
 */
declare type NftStorageConfig = BaseStorageConfig & {
    storage: typeof NFT_STORAGE;
    nftStorageKey: string;
};
/**
 * AWS specific Storage Options with required extra props
 * @property awsS3Bucket - AWS Bucket name
 */
declare type AwsStorageConfig = BaseStorageConfig & {
    storage: typeof AWS;
    awsS3Bucket: string;
};
/**
 * Candy Machine Storage Options.
 * Specific config properties are only needed/available for the respective
 * storage provider.
 */
export declare type StorageConfig = ArweaveStorageConfig | IpfsStorageConfig | NftStorageConfig | AwsStorageConfig;
export {};
