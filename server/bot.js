import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./src/models/User.js";

dotenv.config();

// ініціалізація бота
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });


// 🔌 Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "🎰 Вітаю в Telegram Казино!", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🕹️ Грати в казино",
            web_app: {
              url: process.env.WEB_APP_URL,
            },
          },
        ],
      ],
    },
  });
});


bot.onText(/\/balance/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id.toString();

  try {
    let user = await User.findOne({ telegramId });

    // Якщо юзера немає — створити нового
    if (!user) {
      user = await User.create({ telegramId });
      bot.sendMessage(chatId, `👋 Створено новий акаунт. Ваш стартовий баланс: ${user.balance}₴`);
    } else {
      bot.sendMessage(chatId, `💰 Ваш баланс: ${user.balance}₴`);
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Помилка при отриманні балансу.");
  }
});