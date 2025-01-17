class UpgradeSystem {
    constructor() {
        this.baseEarningRate = 100; // SPDR в час
        this.baseEarningTime = 60; // минут
    }

    calculateUpgradeCost(level) {
        return Math.floor(100 * Math.pow(1.5, level));
    }

    calculateTimeReduction(level) {
        // Максимальное сокращение времени до 1 минуты
        return Math.max(1, this.baseEarningTime - (level * 0.5));
    }

    calculateEarningMultiplier(level) {
        return 1 + (level * 0.1); // +10% за уровень
    }

    async upgradeTime(userId) {
        const user = await db.getUser(userId);
        const cost = this.calculateUpgradeCost(user.timeLevel);
        
        if (user.balance >= cost) {
            user.balance -= cost;
            user.timeLevel++;
            await db.updateUser(user);
            return true;
        }
        return false;
    }

    async upgradeAmount(userId) {
        const user = await db.getUser(userId);
        const cost = this.calculateUpgradeCost(user.amountLevel);
        
        if (user.balance >= cost) {
            user.balance -= cost;
            user.amountLevel++;
            await db.updateUser(user);
            return true;
        }
        return false;
    }
}
