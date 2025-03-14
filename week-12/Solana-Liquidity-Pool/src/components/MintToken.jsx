import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  createMintToInstruction,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";

export function MintToken({ mintAddress, onDone }) {
  const wallet = useWallet();
  const { connection } = useConnection();

  async function mint() {
    try {
      const associatedToken = getAssociatedTokenAddressSync(
        mintAddress,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      console.log("Associated Token Account:", associatedToken.toBase58());

      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedToken,
          wallet.publicKey,
          mintAddress,
          TOKEN_PROGRAM_ID
        )
      );
      await wallet.sendTransaction(transaction, connection);

      const mintTransaction = new Transaction().add(
        createMintToInstruction(
          mintAddress,
          associatedToken,
          wallet.publicKey,
          1000000000,
          [],
          TOKEN_PROGRAM_ID
        )
      );
      await wallet.sendTransaction(mintTransaction, connection);

      console.log("Minting done for token", mintAddress.toBase58());
      onDone();
    } catch (error) {
      console.error("Minting failed:", error);
    }
  }

  return (
    <div>
      <button onClick={mint}>Mint Tokens</button>
    </div>
  );
}
