//Node.js code for generating SHA-256
const crypto = require("crypto");
const input = "Chetan";
const hash = crypto.createHash("sha256").update(input).digest("hex");
console.log(hash);
//run the functions one by one as they are not in async nature
/*
Assignment #1
What if I ask you the following question — Give me an input string that outputs a SHA-256 hash that starts with 00000 . How will you do it?
A: You will have to brute force until you find a value that starts with 00000
*/

// const crypto = require("crypto");

// Function to find an input string that produces a hash starting with '00000'

function findHashWithPrefix(prefix) {
  let input = 0;
  while (true) {
    let inputStr = input.toString();
    let hash = crypto.createHash("sha256").update(inputStr).digest("hex");
    if (hash.startsWith(prefix)) {
      return { input: inputStr, hash: hash };
    }
    input++;
  }
}

// Find and print the input string and hash
const result1 = findHashWithPrefix("00000");
console.log(`Input: ${result1.input}`);
console.log(`Hash: ${result1.hash}`);
console.log("----------------------");

/*
Assignment #2
What if I ask you that the input string should start with 100xdevs ? How would the code change?
*/

// Function to find an input string that produces a hash starting with '00000'

function findHashWithPrefix(prefix) {
  let input = 0;
  while (true) {
    let inputStr = "100xdevs" + input.toString();
    let hash = crypto.createHash("sha256").update(inputStr).digest("hex");
    if (hash.startsWith(prefix)) {
      return { input: inputStr, hash: hash };
    }
    input++;
  }
}

// Find and print the input string and hash
const result = findHashWithPrefix("00000");
console.log(`Input: ${result.input}`);
console.log(`Hash: ${result.hash}`);
console.log("----------------------");

/*
Assignment #3
What if I ask you to find a nonce for the following input
*/
// harkirat => Raman | Rs 100
// Ram => Ankit | Rs 10

// Function to find an input string that produces a hash starting with '00000'

function findHashWithPrefix(prefix) {
  let input = 0;
  while (true) {
    let inputStr =
      `
harkirat => Raman | Rs 100
Ram => Ankit | Rs 10
` + input.toString();
    let hash = crypto.createHash("sha256").update(inputStr).digest("hex");
    if (hash.startsWith(prefix)) {
      return { input: inputStr, hash: hash };
    }
    input++;
  }
}

// Find and print the input string and hash
const result3 = findHashWithPrefix("00000");
console.log(`Input: ${result3.input}`);
console.log(`Hash: ${result3.hash}`);
