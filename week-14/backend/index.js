const bcrypt = require("bcrypt");
const express = require("express");
const { userModel } = require("./models");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { usermiddleware } = require("./usermiddleware");
const { Keypair } = require("@solana/web3.js");
const usersec = process.env.jwtusersec;
const app = express();
app.use(express.json());
app.post("/api/v1/signup", async (req, res) => {
  const keypair = new Keypair();
  const reqbody1 = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(8).max(30),
  });

  const parseddatawithsuccess = reqbody1.safeParse(req.body);
  if (!parseddatawithsuccess.success) {
    return res.status(400).json({
      message: "Incorrect Format",
      error: parseddatawithsuccess.error.errors,
    });
  }

  const { username, password } = req.body;

  try {
    // **Check if user already exists**
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // **Hash the password**
    const hashedPassword = await bcrypt.hash(password, 10);
    const publicKey = keypair.publicKey.toBase58();
    const privateKeyBase64 = Buffer.from(keypair.secretKey).toString("base64"); // Send only once

    // **Store only the public key**
    await userModel.create({
      username,
      password: hashedPassword,
      publicKey: publicKey,
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
    const response = await userModel.findOne({ username });
    if (!response) {
      return res.status(403).json({ msg: "Invalid username or password!" });
    }

    const passwordmatch = await bcrypt.compare(password, response.password);
    if (!passwordmatch) {
      return res.status(403).json({ msg: "Invalid username or password!" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: response._id.toString() }, usersec, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (e) {
    res.status(500).json({ message: "An error occurred", error: e.message });
  }
});

// **Transaction Signing Endpoint**
app.post("/api/v1/txn/sign", (req, res) => {
  res.json({ message: "sign txn" });
});

// **Fixed API Route for Transaction Retrieval**
app.post("/api/v1/txn/:id", (req, res) => {
  const txnId = req.params.id;
  res.json({ message: `Transaction ID: ${txnId}` });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
