import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useConnect, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import "./App.css";
// Initialize Query Client
const queryClient = new QueryClient();

// Wagmi Configuration
const config = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
  },
});

function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <div>
      {connectors.map((connector) => (
        <button key={connector.uid} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      ))}
    </div>
  );
}
function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const balance = useBalance({
    address,
  });

  return (
    <div>
      {address && (
        <div>
          Your address - {address}
          Your balance - {balance.data?.formatted}
        </div>
      )}

      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}

function SendTransaction() {
  const { data: hash, sendTransaction } = useSendTransaction();

  async function sendTx() {
    const to = document.getElementById("to").value;
    const value = document.getElementById("value").value;
    sendTransaction({ to, value: parseEther(value) });
  }

  // Todo: use refs here
  return (
    <div>
      <input id="to" placeholder="0xA0Cf…251e" required />
      <input id="value" placeholder="0.05" required />
      <button onClick={sendTx}>Send</button>
      {hash && <div>Transaction Hash: {hash}</div>}
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletOptions />
        <Account />
        <SendTransaction />
        <input type="text" placeholder="Enter text" />
        <button>Send</button>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
