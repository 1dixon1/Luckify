import React, { useState } from "react";

const SYMBOLS = ["🍒", "🍋", "🍉", "⭐", "💎"] as const;
type Symbol = typeof SYMBOLS[number];

const REELS_COUNT = 5;
const MIN_BET = 0.1;
//const API = "http://localhost:5000/api";


function getRandomSymbol(): Symbol {
  // Пример вероятностей (чем проще — тем выше шанс)
  const weights = [40, 30, 15, 10, 5];
  const total = weights.reduce((a, b) => a + b, 0);
  const rand = Math.random() * total;

  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (rand < sum) return SYMBOLS[i];
  }
  return SYMBOLS[SYMBOLS.length - 1];
}

const App: React.FC = () => {
  const [reels, setReels] = useState<Symbol[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState<number | null>(null);

  const spin = async () => {
    setSpinning(true);
    setWinAmount(null);
    setReels([]);

    const newReels: Symbol[] = [];

    for (let i = 0; i < REELS_COUNT; i++) {
      await new Promise((res) => setTimeout(res, 500)); // поочередное открытие барабанов
      const sym = getRandomSymbol();
      newReels.push(sym);
      setReels([...newReels]);
    }

    // Простая логика выигрыша: если 3+ символа подряд одинаковые, выигрыш = 0.1 * коэффициент
    let win = 0;
    let count = 1;
    for (let i = 1; i < newReels.length; i++) {
      if (newReels[i] === newReels[i - 1]) {
        count++;
      } else {
        if (count >= 3) {
          win = MIN_BET * count * 2; // пример выплаты
          break;
        }
        count = 1;
      }
    }
    if (count >= 3) {
      win = MIN_BET * count * 2;
    }

    setWinAmount(win);
    setSpinning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 p-6">
      <h1 className="text-4xl font-bold mb-8 text-white">🎰 Slots MiniApp</h1>

      <div className="flex space-x-4 mb-6">
        {reels.length === 0
          ? Array(REELS_COUNT)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center text-4xl"
                >
                  ?
                </div>
              ))
          : reels.map((sym, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-5xl shadow-lg animate-fadeIn"
              >
                {sym}
              </div>
            ))}
      </div>

      <button
        disabled={spinning}
        onClick={spin}
        className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-full font-semibold text-lg text-gray-900 shadow-md transition"
      >
        {spinning ? "Spinning..." : `Spin $${MIN_BET.toFixed(2)}`}
      </button>

      {winAmount !== null && (
        <div className="mt-6 text-white text-xl font-semibold">
          {winAmount > 0 ? `🎉 You won $${winAmount.toFixed(2)}!` : "Try again 😔"}
        </div>
      )}
    </div>
  );
};

export default App;
