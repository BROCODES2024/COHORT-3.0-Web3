const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongo_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Connection failed!", err);
  }
};

connectDB();

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  privateKey: String,
  publicKey: String,
});

const userModel = mongoose.model("users", UserSchema);

module.exports = {
  userModel,
};
