import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.sendStatus(403);
  }
};

router.post("/spin", authMiddleware, async (req, res) => {
  const bet = req.body.bet;
  if (req.user.balance < bet)
    return res.status(400).json({ message: "Not enough balance" });

  const win = Math.random() < 0.5;
  const winAmount = win ? bet * 2 : 0;
  req.user.balance = req.user.balance - bet + winAmount;
  await req.user.save();

  res.json({
    result: win ? "win" : "lose",
    newBalance: req.user.balance,
    winAmount,
  });
});

export default router;
