const bcrypt = require("bcrypt");
const express = require("express");
const { userModel } = require("./models");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { usermiddleware } = require("./usermiddleware");
const {
  Keypair,
  Transaction,
  Connection,
  PublicKey,
} = require("@solana/web3.js");
const cors = require("cors");

const usersec = process.env.jwtusersec;
const app = express();
app.use(cors());
app.use(express.json());
const connection = new Connection("https://api.devnet.solana.com");

app.post("/api/v1/signup", async (req, res) => {
  const keypair = new Keypair();
  const reqbody1 = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(8).max(30),
  });

  const parsedData = reqbody1.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Incorrect Format",
      error: parsedData.error.errors,
    });
  }

  const { username, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const publicKey = keypair.publicKey.toBase58();
    const privateKeyBase64 = Buffer.from(keypair.secretKey).toString("base64");

    await userModel.create({
      username,
      password: hashedPassword,
      publicKey,
      privateKey: privateKeyBase64,
    });

    return res.status(201).json({
      message: "You are signed up",
      publicKey,
      privateKey: privateKeyBase64,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: e.message });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(403).json({ msg: "Invalid username or password!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(403).json({ msg: "Invalid username or password!" });
    }

    const token = jwt.sign({ id: user._id.toString() }, usersec, {
      expiresIn: "1h",
    });
    res.json({ token, publicKey: user.publicKey });
  } catch (e) {
    res.status(500).json({ message: "An error occurred", error: e.message });
  }
});

app.post("/api/v1/txn/sign", usermiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const tx = Transaction.from(Buffer.from(message, "base64"));

    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const privateKey = Buffer.from(user.privateKey, "base64");
    const keypair = Keypair.fromSecretKey(privateKey);
    tx.sign(keypair);

    const signature = await connection.sendRawTransaction(tx.serialize());
    res.json({ message: "Transaction signed and sent", signature });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Transaction signing failed", error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
