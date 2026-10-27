const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createHash, randomBytes } = require("crypto");
const User = require("../models/User");
const { sendMail } = require("../utils/mailer");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function createVerificationToken() {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    hash: createHash("sha256").update(token).digest("hex"),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

async function sendVerification(user, token) {
  const verificationUrl = new URL("/verify-email", process.env.FRONTEND_URL || "http://localhost:5173");
  verificationUrl.searchParams.set("token", token);
  await sendMail({
    to: user.email,
    subject: "Verify your JobConnect email",
    text: `Hi ${user.name},\n\nVerify your email address to activate your JobConnect account:\n${verificationUrl}\n\nThis link expires in 24 hours. If you did not create this account, you can ignore this email.`,
  });
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    if (role && !["candidate", "recruiter"].includes(role)) {
      return res.status(400).json({ message: "Role must be candidate or recruiter" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const verification = createVerificationToken();
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role: role || "candidate",
      emailVerified: false,
      emailVerificationToken: verification.hash,
      emailVerificationExpires: verification.expires,
    });

    try {
      await sendVerification(user, verification.token);
    } catch (emailError) {
      await user.deleteOne();
      console.error("Verification email delivery failed:", emailError.message);
      return res.status(503).json({ message: "Unable to send verification email. Check SMTP settings and try again." });
    }
    res.status(201).json({ message: "Account created. Check your email to verify your address before logging in." });
  } catch (error) {
    console.error("Account registration failed:", error.message);
    res.status(500).json({ message: "Unable to register account or send verification email" });
  }
});

router.post("/verify-email", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Verification token is required" });

  try {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: "This verification link is invalid or expired" });

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    res.json({ message: "Email verified. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Unable to verify email" });
  }
});

router.post("/resend-verification", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  if (!email) return res.status(400).json({ message: "Email address is required" });

  try {
    const user = await User.findOne({ email });
    if (user && !user.emailVerified) {
      const verification = createVerificationToken();
      user.emailVerificationToken = verification.hash;
      user.emailVerificationExpires = verification.expires;
      await user.save();
      await sendVerification(user, verification.token);
    }
    res.json({ message: "If your account needs verification, a new link has been sent." });
  } catch (error) {
    console.error("Verification email resend failed:", error.message);
    res.status(503).json({ message: "Unable to send verification email. Check the email server settings and try again." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    const user = email ? await User.findOne({ email }) : null;

    if (!user || !password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email or password is incorrect" });
    }
    if (!user.emailVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Unable to log in" });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email role phone skills resume");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Unable to load account" });
  }
});

module.exports = router;