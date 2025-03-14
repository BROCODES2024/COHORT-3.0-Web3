import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { TokenLaunchpad } from "./components/CreateToken";
import { useMemo, useState, useCallback } from "react";
import { MintToken } from "./components/MintToken";
import { CreateCpPool } from "./components/CreateCpPool";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

function App() {
  const [token, setToken] = useState(null);
  const [mintDone, setMintDone] = useState(false);
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Setup recommended wallets
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <WalletDisconnectButton />
          <TokenLaunchpad onTokenCreate={(tokenMint) => setToken(tokenMint)} />
          {token && <p>Token Mint: {token.toBase58()}</p>}
          {token && (
            <MintToken onDone={() => setMintDone(true)} mintAddress={token} />
          )}
          {mintDone && <CreateCpPool token={token} />}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
