import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Авторизація або реєстрація користувача
router.post("/auth", async (req, res) => {
  const { telegramId} = req.body;

  let user = await User.findOne({ telegramId });
  if (!user) {
    user = await User.create({
      telegramId,
      balance: 0,
    });
  }

  res.json(user);
});
router.get("/", (req, res) => {
  res.send("Users route");
});

export default router;
