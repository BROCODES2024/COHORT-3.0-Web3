import { useState } from "react";
import {
  Transaction,
  Connection,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import axios from "axios";

function App() {
  const [publicKey, setPublicKey] = useState(null);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Login and fetch public key from backend
  async function login() {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/signin", {
        username,
        password,
      });

      if (response.data.token && response.data.publicKey) {
        setToken(response.data.token); // Store token for future requests
        setPublicKey(response.data.publicKey);
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error logging in!");
    }
  }

  // Create and send transaction
  async function sendSol() {
    if (!publicKey) {
      alert("Login first to fetch public key");
      return;
    }

    if (
      !address ||
      !amount ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) <= 0
    ) {
      alert("Please enter a valid positive amount and recipient address.");
      return;
    }

    try {
      const connection = new Connection("https://api.devnet.solana.com");

      // Create transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(publicKey),
        toPubkey: new PublicKey(address),
        lamports: Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL), // Fixed to handle decimal amounts
      });

      // Create and serialize transaction
      const transaction = new Transaction().add(instruction);
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(publicKey);

      // Convert transaction to base64 for API
      const serializedTxn = transaction
        .serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        })
        .toString("base64");

      // Send transaction to backend for signing
      const signResponse = await axios.post(
        "http://localhost:3000/api/v1/txn/sign",
        { message: serializedTxn },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Transaction Signed by Backend:", signResponse.data);
    } catch (error) {
      console.error("Transaction error:", error);
      alert("Error sending transaction!");
    }
  }

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>

        <input
          type="text"
          placeholder="Amount (SOL)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Recipient Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={sendSol}>Submit</button>
      </div>
    </>
  );
}

export default App;
