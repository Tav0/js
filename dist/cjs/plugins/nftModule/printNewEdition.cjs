'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var web3_js = require('@solana/web3.js');
var splToken = require('@solana/spl-token');
var BN = require('bn.js');
var EditionAccounts = require('../../programs/tokenMetadata/accounts/EditionAccounts.cjs');
var SdkError = require('../../errors/SdkError.cjs');
var findEditionMarkerPda = require('../../programs/tokenMetadata/pdas/findEditionMarkerPda.cjs');
var findEditionPda = require('../../programs/tokenMetadata/pdas/findEditionPda.cjs');
var createMintNewEditionFromMasterEditionViaVaultProxyInstructionWithSigners = require('../../programs/tokenMetadata/instructions/createMintNewEditionFromMasterEditionViaVaultProxyInstructionWithSigners.cjs');
var createMintNewEditionFromMasterEditionViaTokenInstructionWithSigners = require('../../programs/tokenMetadata/instructions/createMintNewEditionFromMasterEditionViaTokenInstructionWithSigners.cjs');
var Operation = require('../../types/Operation.cjs');
var findMetadataPda = require('../../programs/tokenMetadata/pdas/findMetadataPda.cjs');
var findMasterEditionV2Pda = require('../../programs/tokenMetadata/pdas/findMasterEditionV2Pda.cjs');
var TransactionBuilder = require('../../utils/TransactionBuilder.cjs');
var createMintAndMintToAssociatedTokenBuilder = require('../../programs/token/transactionBuilders/createMintAndMintToAssociatedTokenBuilder.cjs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var BN__default = /*#__PURE__*/_interopDefaultLegacy(BN);

const Key = 'PrintNewEditionOperation';
const printNewEditionOperation = Operation.useOperation(Key);
const printNewEditionOperationHandler = {
  handle: async (operation, metaplex) => {
    const {
      originalMint,
      newMint = web3_js.Keypair.generate(),
      newMintAuthority = metaplex.identity(),
      newUpdateAuthority = newMintAuthority.publicKey,
      newOwner = newMintAuthority.publicKey,
      newFreezeAuthority,
      payer = metaplex.identity(),
      tokenProgram,
      associatedTokenProgram,
      confirmOptions
    } = operation.input; // Original NFT.

    const originalMetadata = findMetadataPda.findMetadataPda(originalMint);
    const originalEdition = findMasterEditionV2Pda.findMasterEditionV2Pda(originalMint);
    const originalEditionAccount = EditionAccounts.parseOriginalEditionAccount(await metaplex.rpc().getAccount(originalEdition));

    if (!originalEditionAccount.exists) {
      throw new SdkError.AccountNotFoundError(originalEdition, 'OriginalEdition', `Ensure the provided mint address for the original NFT [${originalMint.toBase58()}] ` + `is correct and that it has an associated OriginalEdition PDA.`);
    }

    const edition = new BN__default["default"](originalEditionAccount.data.supply, 'le').add(new BN__default["default"](1));
    const originalEditionMarkPda = findEditionMarkerPda.findEditionMarkerPda(originalMint, edition); // New NFT.

    const newMetadata = findMetadataPda.findMetadataPda(newMint.publicKey);
    const newEdition = findEditionPda.findEditionPda(newMint.publicKey);
    const lamports = await splToken.getMinimumBalanceForRentExemptMint(metaplex.connection);
    const newAssociatedToken = await splToken.getAssociatedTokenAddress(newMint.publicKey, newOwner, false, tokenProgram, associatedTokenProgram);
    const sharedInput = {
      lamports,
      edition,
      newMint,
      newMetadata,
      newEdition,
      newMintAuthority,
      newUpdateAuthority,
      newOwner,
      newAssociatedToken,
      newFreezeAuthority,
      payer,
      originalMetadata,
      originalEdition,
      originalEditionMarkPda,
      tokenProgram,
      associatedTokenProgram
    };
    let transactionBuilder;

    if (operation.input.via === 'vault') {
      transactionBuilder = printNewEditionBuilder({
        via: 'vault',
        vaultAuthority: operation.input.vaultAuthority,
        safetyDepositStore: operation.input.safetyDepositStore,
        safetyDepositBox: operation.input.safetyDepositBox,
        vault: operation.input.vault,
        tokenVaultProgram: operation.input.tokenVaultProgram,
        ...sharedInput
      });
    } else {
      var _operation$input$orig, _operation$input$orig2;

      const originalTokenAccountOwner = (_operation$input$orig = operation.input.originalTokenAccountOwner) !== null && _operation$input$orig !== void 0 ? _operation$input$orig : metaplex.identity();
      const originalTokenAccount = (_operation$input$orig2 = operation.input.originalTokenAccount) !== null && _operation$input$orig2 !== void 0 ? _operation$input$orig2 : await splToken.getAssociatedTokenAddress(originalMint, originalTokenAccountOwner.publicKey, false, tokenProgram, associatedTokenProgram);
      transactionBuilder = printNewEditionBuilder({
        via: 'token',
        originalTokenAccountOwner,
        originalTokenAccount,
        ...sharedInput
      });
    }

    const {
      signature
    } = await metaplex.rpc().sendAndConfirmTransaction(transactionBuilder, undefined, confirmOptions);
    return {
      mint: newMint,
      metadata: newMetadata,
      edition: newEdition,
      associatedToken: newAssociatedToken,
      transactionId: signature
    };
  }
};
const printNewEditionBuilder = params => {
  const {
    // Data.
    lamports,
    edition,
    // New NFT.
    newMint,
    newMetadata,
    newEdition,
    newMintAuthority,
    newUpdateAuthority,
    newOwner,
    newAssociatedToken,
    newFreezeAuthority,
    payer,
    // Master NFT.
    originalMetadata,
    originalEdition,
    originalEditionMarkPda,
    // Programs.
    tokenProgram,
    associatedTokenProgram,
    // Instruction keys.
    createAccountInstructionKey,
    initializeMintInstructionKey,
    createAssociatedTokenInstructionKey,
    mintToInstructionKey,
    printNewEditionInstructionKey = 'printNewEdition'
  } = params;
  let printNewEditionInstructionWithSigners;

  if (params.via === 'vault') {
    printNewEditionInstructionWithSigners = createMintNewEditionFromMasterEditionViaVaultProxyInstructionWithSigners.createMintNewEditionFromMasterEditionViaVaultProxyInstructionWithSigners({
      edition,
      newMetadata,
      newEdition,
      masterEdition: originalEdition,
      newMint,
      editionMarkPda: originalEditionMarkPda,
      newMintAuthority,
      payer,
      vaultAuthority: params.vaultAuthority,
      safetyDepositStore: params.safetyDepositStore,
      safetyDepositBox: params.safetyDepositBox,
      vault: params.vault,
      newMetadataUpdateAuthority: newUpdateAuthority,
      metadata: originalMetadata,
      tokenVaultProgram: params.tokenVaultProgram,
      instructionKey: printNewEditionInstructionKey
    });
  } else {
    printNewEditionInstructionWithSigners = createMintNewEditionFromMasterEditionViaTokenInstructionWithSigners.createMintNewEditionFromMasterEditionViaTokenInstructionWithSigners({
      edition,
      newMetadata,
      newEdition,
      masterEdition: originalEdition,
      newMint,
      editionMarkPda: originalEditionMarkPda,
      newMintAuthority,
      payer,
      tokenAccountOwner: params.originalTokenAccountOwner,
      tokenAccount: params.originalTokenAccount,
      newMetadataUpdateAuthority: newUpdateAuthority,
      metadata: originalMetadata,
      instructionKey: printNewEditionInstructionKey
    });
  }

  return TransactionBuilder.TransactionBuilder.make() // Create the mint account and send one token to the holder.
  .add(createMintAndMintToAssociatedTokenBuilder.createMintAndMintToAssociatedTokenBuilder({
    lamports,
    decimals: 0,
    amount: 1,
    createAssociatedToken: true,
    mint: newMint,
    payer,
    mintAuthority: newMintAuthority,
    owner: newOwner,
    associatedToken: newAssociatedToken,
    freezeAuthority: newFreezeAuthority,
    tokenProgram,
    associatedTokenProgram,
    createAccountInstructionKey,
    initializeMintInstructionKey,
    createAssociatedTokenInstructionKey,
    mintToInstructionKey
  })) // Mint new edition.
  .add(printNewEditionInstructionWithSigners);
};

exports.printNewEditionBuilder = printNewEditionBuilder;
exports.printNewEditionOperation = printNewEditionOperation;
exports.printNewEditionOperationHandler = printNewEditionOperationHandler;
//# sourceMappingURL=printNewEdition.cjs.map
