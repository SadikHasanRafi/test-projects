require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

const mongoURI = process.env.MONGO_URI || "mongodb+srv://codeerid13255_db_user:odfhwvEgX0SAj1xY@cluster0.mpghx16.mongodb.net/?appName=Cluster0";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.clear();

    console.log("╔══════════════════════════════════════════════╗");
    console.log("║         🚀 Simple Auth API Started           ║");
    console.log("╚══════════════════════════════════════════════╝");
    console.log(`🌐 Server   : http://localhost:${process.env.PORT}`);
    console.log("🗄️  Database : ✅ MongoDB Connected");
    console.log("🔥 Status   : Ready to accept requests");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    app.listen(process.env.PORT, () => {
      // Server is already logged above
    });
  })
  .catch((err) => {
    console.clear();

    console.log("╔══════════════════════════════════════════════╗");
    console.log("║          ❌ Failed to Start Server           ║");
    console.log("╚══════════════════════════════════════════════╝");
    console.log(`🌐 Server   : http://localhost:${process.env.PORT}`);
    console.log("🗄️  Database : ❌ MongoDB Connection Failed");
    console.error("📄 Error:", err.message);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(1);
  });

// User Schema
const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      name: String,
      email: {
        type: String,
        unique: true,
      },
      password: String,
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
      }
    },
    {
      timestamps: true,
    }
  )
);




// Signup
app.post("/signup", async (req, res) => {
  console.log("\n=================== 📝 SIGNUP REQUEST ===================");
  console.log(`[${new Date().toISOString()}] Incoming registration...`);
  console.log("Payload:", { name: req.body.name, email: req.body.email, role: req.body.role, password: "[HIDDEN]" });

  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      console.warn(`⚠️  Signup Failed: Email [${email}] already exists.`);
      console.log("=========================================================\n");
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    console.log(`✅ Signup Successful for: [${email}] with role [${role || "user"}]`);
    console.log("=========================================================\n");
    
    res.json({
      message: "Signup Successful",
    });
  } catch (err) {
    console.error("❌ Signup Error:", err.message);
    console.log("=========================================================\n");
    res.status(500).json({
      message: err.message,
    });
  }
});

// Login
app.post("/login", async (req, res) => {
  console.log("\n=================== 🔑 LOGIN REQUEST ===================");
  console.log(`[${new Date().toISOString()}] Attempting authentication...`);
  console.log("Payload:", { email: req.body.email, password: "[HIDDEN]" });

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.warn(`⚠️  Login Failed: No account found for [${email}]`);
      console.log("=========================================================\n");
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.warn(`⚠️  Login Failed: Incorrect password for [${email}]`);
      console.log("=========================================================\n");
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true if using HTTPS
    });

    console.log(`✅ Login Successful! Session cookie issued for User ID: [${user._id}]`);
    console.log("=========================================================\n");

    res.json({
      message: "Login Successful",
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    console.log("=========================================================\n");
    res.status(500).json({
      message: err.message,
    });
  }
});

// Get Current User
app.get("/me", async (req, res) => {
  console.log("\n=================== 👤 GET CURRENT USER ===================");
  console.log(`[${new Date().toISOString()}] Validating session cookie...`);

  try {
    const token = req.cookies.token;

    if (!token) {
      console.warn("⚠️  Auth Failed: No token found in cookies.");
      console.log("=========================================================\n");
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`🔍 Token verified successfully. User ID from token: [${decoded.id}]`);

    const user = await User.findById(decoded.id).select("-password");

    console.log(`✅ Profile retrieved successfully for: [${user.email}]`);
    console.log("=========================================================\n");

    res.json(user);
  } catch (err) {
    console.error("❌ Session Verification Error: Invalid or expired token.");
    console.log("=========================================================\n");
    res.status(401).json({
      message: "Invalid Token",
    });
  }
});




app.get("/", (req, res) => {
  res.send("Welcome to the simple Auth API");
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token");

  res.json({
    message: "Logged Out",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server Running on Port ${process.env.PORT}`);
});