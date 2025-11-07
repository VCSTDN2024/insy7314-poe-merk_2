// index.js
const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(helmet.frameguard({ action: "deny" }));
app.disable("x-powered-by");


// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});
app.use(limiter);

// XSS protection


// Static users with real bcrypt hashes
const users = [
  { accountNumber: "123456", passwordHash: "$2b$10$j9dW37jpEYGDHlCys58DguA3YBeyD386Zh95z.Gsg3coLgWIQx1n2" }, // pass123
  { accountNumber: "987654", passwordHash: "$2b$10$8Ra6YuFw/UA/Js7cnaz0rO3Z2nIy9QZ/fEGFYLINLSkShRPrP1mke" }  // mypassword
];

app.post("/login", async (req, res) => {
  const { accountNumber, password } = req.body;

  const user = users.find(u => u.accountNumber === accountNumber);
  if (!user) return res.status(401).json({ message: "Invalid account number or password" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (match) {
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid account number or password" });
  }
});

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "cert.pem"))
};

// Start HTTPS server
https.createServer(sslOptions, app).listen(5000, () => {
  console.log("Server running on https://localhost:5000");
});
