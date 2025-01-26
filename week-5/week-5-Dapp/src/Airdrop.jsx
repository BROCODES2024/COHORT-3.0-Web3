import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export function Airdrop() {
  const wallet = useWallet();
  const { connection } = useConnection();
  async function sendAirdroptoUser() {
    const amount = document.getElementById("publickey").value;
    await connection.requestAirdrop(wallet.publicKey, amount); //10 here is no of lamports not sol
    alert("airdropped sol");
  }
  return (
    <div>
      <input id="publickey" type="text" placeholder="Enter Amount" />
      <button onClick={sendAirdroptoUser}>Send Airdrop</button>
    </div>
  );
}
