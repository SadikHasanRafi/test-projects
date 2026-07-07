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
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.clear();

    console.log("╔══════════════════════════════════════════════╗");
    console.log("║         🚀 Simple Auth API Started          ║");
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
    console.log("║          ❌ Failed to Start Server          ║");
    console.log("╚══════════════════════════════════════════════╝");
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
    },
    {
      timestamps: true,
    }
  )
);




// Signup
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      message: "Signup Successful",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
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

    res.json({
      message: "Login Successful",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Get Current User
app.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    res.json(user);
  } catch {
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