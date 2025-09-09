// middleware/dailyCoinLimit.js
const calculateCredits = require("../utils/creditCalculator");

const DAILY_LIMIT = 100;
const userDailyData = {};

module.exports = function dailyCoinLimit(req, res, next) {
  try {
    const userId = req.user?.id || req.body?.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    let coins = 0;
    if (req.body.coins) coins = Number(req.body.coins);
    else if (req.body.activityType) coins = calculateCredits(req.body.activityType);

    if (!coins || coins <= 0) {
      return res.status(400).json({ success: false, message: "Invalid coins/credits" });
    }

    const today = new Date().toISOString().split("T")[0];
    if (!userDailyData[userId] || userDailyData[userId].date !== today) {
      userDailyData[userId] = { date: today, earned: 0 };
    }

    if (userDailyData[userId].earned + coins > DAILY_LIMIT) {
      return res.status(429).json({
        success: false,
        message: `Daily limit of ${DAILY_LIMIT} coins/credits reached.`,
      });
    }

    userDailyData[userId].earned += coins;
    next();
  } catch (err) {
    console.error("dailyCoinLimit error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
