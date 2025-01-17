const tg = window.Telegram.WebApp;
let currentUser = null;
let gameTimer = null;

class SpiderGame {
    constructor() {
        this.db = new GameDatabase();
        this.upgradeSystem = new UpgradeSystem();
        this.adminPanel = new AdminPanel();
        this.collectCooldown = 60000; // 1 minute in milliseconds
        this.lastCollectTime = 0;
    }

    async init() {
        await this.db.init();
        tg.expand();
        
        // Check if user is registered
        const userId = tg.initDataUnsafe?.user?.id;
        if (!userId) return;

        const user = await this.db.getUser(userId);
        if (user) {
            currentUser = user;
            this.showMainScreen();
        } else {
            this.showWelcomeScreen();
        }

        this.initEventListeners();
        this.startGameLoop();
    }

    initEventListeners() {
        // Registration
        document.getElementById('register-btn').addEventListener('click', () => this.registerUser());

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Collect button
        document.getElementById('collect-btn').addEventListener('click', () => this.collect());

        // Upgrade buttons
        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleUpgrade(e));
        });
    }

    async registerUser() {
        const username = document.getElementById('username').value.trim();
        if (!username) return;

        const userId = tg.initDataUnsafe.user.id;
        const userData = {
            id: userId,
            username: username,
            balance: 0,
            timeLevel: 1,
            amountLevel: 1,
            lastCollect: Date.now(),
            registered: Date.now()
        };

        await this.db.addUser(userData);
        currentUser = userData;
        this.showConfetti();
        this.showMainScreen();
    }

    showConfetti() {
        // Create confetti animation with emojis
        const emojis = ['🎉', '✨', '💫', '🎊'];
        const container = document.createElement('div');
        container.className = 'confetti-container';

        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('span');
            confetti.className = 'confetti';
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            container.appendChild(confetti);
        }

        document.body.appendChild(container);
        setTimeout(() => container.remove(), 5000);
    }

    async collect() {
        const now = Date.now();
        if (now - this.lastCollectTime < this.collectCooldown) return;

        const reward = this.calculateReward();
        currentUser.balance += reward;
        this.lastCollectTime = now;

        await this.db.updateUser(currentUser);
        this.animateReward(reward);
        this.updateUI();
    }

    calculateReward() {
        const baseReward = 100;
        const amountMultiplier = 1 + (currentUser.amountLevel - 1) * 0.1;
        return Math.floor(baseReward * amountMultiplier);
    }

    animateReward(amount) {
        const rewardElement = document.createElement('div');
        rewardElement.className = 'floating-reward';
        rewardElement.textContent = `+${amount} 🕷️`;
        document.querySelector('.balance-display').appendChild(rewardElement);

        setTimeout(() => rewardElement.remove(), 1000);
    }

    startGameLoop() {
        setInterval(() => {
            if (currentUser) {
                this.updateTimer();
                this.updateUI();
            }
        }, 1000);
    }

    updateTimer() {
        const now = Date.now();
        const timeSinceLastCollect = now - this.lastCollectTime;
        const timeLeft = Math.max(0, this.collectCooldown - timeSinceLastCollect);
        
        const seconds = Math.ceil(timeLeft / 1000);
        const timerElement = document.querySelector('.timer');
        timerElement.textContent = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
        
        const collectBtn = document.getElementById('collect-btn');
        collectBtn.disabled = timeLeft > 0;
    }

    updateUI() {
        document.querySelector('.balance-amount').textContent = currentUser.balance;
        // Update other UI elements...
    }

    handleNavigation(e) {
        const section = e.currentTarget.dataset.section;
        document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
        document.getElementById(`${section}-section`).classList.remove('hidden');
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
    }

    async handleUpgrade(e) {
        const type = e.currentTarget.dataset.type;
        const success = await this.upgradeSystem.upgrade(type, currentUser);
        if (success) {
            this.updateUI();
        }
    }
}

// Initialize game when document is ready
document.addEventListener('DOMContentLoaded', () => {
    const game = new SpiderGame();
    game.init();
});
