import  CasinoStats  from '../models/CasinoStats.js';
import config from '../config/slotConfig.js';

const { MIN_BET, REELS, SYMBOLS, RTP } = config;

function getWeightedRandomSymbol(symbols) {
    const totalWeight = symbols.reduce((acc, s) => acc + s.weight, 0);
    const rand = Math.random() * totalWeight;
    let sum = 0;
    for (const s of symbols) {
        sum += s.weight;
        if (rand < sum) return s;
    }
    return symbols[symbols.length - 1];
}

export async function spinSlots(req, res) {
    const bet = parseFloat(req.body.bet);

    if (isNaN(bet) || bet < MIN_BET) {
        return res.status(400).json({ error: 'Invalid bet amount' });
    }

    const casino = await CasinoStats.findOne() || await CasinoStats.create({});
    casino.totalBalance += bet;
    await casino.save();

    // Generate spin
    const reels = [];
    for (let i = 0; i < REELS; i++) {
        reels.push(getWeightedRandomSymbol(SYMBOLS));
    }

    // Count most frequent symbol
    const counts = {};
    reels.forEach(({ symbol }) => counts[symbol] = (counts[symbol] || 0) + 1);
    const match = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

    const [matchedSymbol, count] = match;
    const symbolConfig = SYMBOLS.find(s => s.symbol === matchedSymbol);
    const win = count >= 3 ? bet * symbolConfig.payout : 0;

    // RTP check (simulate drop rate)
    const shouldPay = win > 0 && Math.random() <= RTP;

    const finalWin = shouldPay && win <= casino.totalWithdrawable ? win : 0;

    if (finalWin > 0) {
        casino.totalWithdrawable -= finalWin;
        await casino.save();
    }

    res.json({
        reels: reels.map(r => r.symbol),
        win: finalWin,
    });
}
