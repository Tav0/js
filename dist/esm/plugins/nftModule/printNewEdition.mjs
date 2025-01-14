import { Keypair } from '@solana/web3.js';
import { getMinimumBalanceForRentExemptMint, getAssociatedTokenAddress } from '@solana/spl-token';
import BN from 'bn.js';
import { parseOriginalEditionAccount } from '../../programs/tokenMetadata/accounts/EditionAccounts.mjs';
import { AccountNotFoundError } from '../../errors/SdkError.mjs';
import { findEditionMarkerPda } from '../../programs/tokenMetadata/pdas/findEditionMarkerPda.mjs';
import { findEditionPda } from '../../programs/tokenMetadata/pdas/findEditionPda.mjs';
import { createMintNewEditionFromMasterEditionViaVaultProxyInstructionWithSigners } from '../../programs/tokenMetadata/instructions/createMintNewEditionFromMasterEditionViaVaultProxyInstructionWithSigners.mjs';
import { createMintNewEditionFromMasterEditionViaTokenInstructionWithSigners } from '../../programs/tokenMetadata/instructions/createMintNewEditionFromMasterEditionViaTokenInstructionWithSigners.mjs';
import { useOperation } from '../../types/Operation.mjs';
import { findMetadataPda } from '../../programs/tokenMetadata/pdas/findMetadataPda.mjs';
import { findMasterEditionV2Pda } from '../../programs/tokenMetadata/pdas/findMasterEditionV2Pda.mjs';
import { TransactionBuilder } from '../../utils/TransactionBuilder.mjs';
import { createMintAndMintToAssociatedTokenBuilder } from '../../programs/token/transactionBuilders/createMintAndMintToAssociatedTokenBuilder.mjs';

const Key = 'PrintNewEditionOperation';
const printNewEditionOperation = useOperation(Key);
const printNewEditionOperationHandler = {
  handle: async (operation, metaplex) => {
    const {
      originalMint,
      newMint = Keypair.generate(),
      newMintAuthority = metaplex.identity(),
      newUpdateAuthority = newMintAuthority.publicKey,
      newOwner = newMintAuthority.publicKey,
      newFreezeAuthority,
      payer = metaplex.identity(),
      tokenProgram,
      associatedTokenProgram,
      confirmOptions
    } = operation.input; // Original NFT.

    const originalMetadata = findMetadataPda(originalMint);
    const originalEdition = findMasterEditionV2Pda(originalMint);
    const originalEditionAccount = parseOriginalEditionAccount(await metaplex.rpc().getAccount(originalEdition));

    if (!originalEditionAccount.exists) {
      throw new AccountNotFoundError(originalEdition, 'OriginalEdition', `Ensure the provided mint address for the original NFT [${originalMint.toBase58()}] ` + `is correct and that it has an associated OriginalEdition PDA.`);
    }

    const edition = new BN(originalEditionAccount.data.supply, 'le').add(new BN(1));
    const originalEditionMarkPda = findEditionMarkerPda(originalMint, edition); // New NFT.

    const newMetadata = findMetadataPda(newMint.publicKey);
    const newEdition = findEditionPda(newMint.publicKey);
    const lamports = await getMinimumBalanceForRentExemptMint(metaplex.connection);
    const newAssociatedToken = await getAssociatedTokenAddress(newMint.publicKey, newOwner, false, tokenProgram, associatedTokenProgram);
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
      const originalTokenAccount = (_operation$input$orig2 = operation.input.originalTokenAccount) !== null && _operation$input$orig2 !== void 0 ? _operation$input$orig2 : await getAssociatedTokenAddress(originalMint, originalTokenAccountOwner.publicKey, false, tokenProgram, associatedTokenProgram);
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
    printNewEditionInstructionWithSigners = createMintNewEditionFromMasterEditionViaVaultProxyInstructionWithSigners({
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
    printNewEditionInstructionWithSigners = createMintNewEditionFromMasterEditionViaTokenInstructionWithSigners({
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

  return TransactionBuilder.make() // Create the mint account and send one token to the holder.
  .add(createMintAndMintToAssociatedTokenBuilder({
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

export { printNewEditionBuilder, printNewEditionOperation, printNewEditionOperationHandler };
//# sourceMappingURL=printNewEdition.mjs.map
