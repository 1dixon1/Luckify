import mongoose from 'mongoose';

const casinoStatsSchema = new mongoose.Schema({
  totalBalance: { type: Number, default: 0 }, // Баланс казино
  totalLostByPlayers: { type: Number, default: 0 }, // Сколько проиграли игроки
  totalWithdrawable: { type: Number, default: 0 }, // Сколько можно вывести
});

const CasinoStats = mongoose.model("CasinoStats", casinoStatsSchema);

export default CasinoStats; 
