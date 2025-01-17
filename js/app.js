const tg = window.Telegram.WebApp;
let currentUser = null;
let gameTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

function initializeGame() {
    tg.expand();
    
    // Check if user exists in database
    const userId = tg.initDataUnsafe?.user?.id;
    if (userId) {
        checkUser(userId);
    }

    // Initialize all event listeners
    initializeEventListeners();
    
    // Show earn section by default
    showSection('earn');
    
    // Start game timer
    startGameTimer();
}

function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.target.closest('.nav-btn').getAttribute('data-section');
            handleNavigation(section);
        });
    });

    // Collect button
    const collectBtn = document.getElementById('collect-btn');
    if (collectBtn) {
        collectBtn.addEventListener('click', handleCollect);
    }

    // Upgrade buttons
    document.querySelectorAll('.upgrade-btn').forEach(btn => {
        btn.addEventListener('click', handleUpgrade);
    });

    // Register button
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegistration);
    }
}

function handleNavigation(section) {
    // Update active button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === section) {
            btn.classList.add('active');
        }
    });

    // Show selected section
    showSection(section);

    // Check for admin panel (10 clicks on leaderboard)
    if (section === 'leaderboard') {
        handleLeaderboardClicks();
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    const selectedSection = document.getElementById(`${sectionId}-section`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

function handleCollect() {
    if (!currentUser) return;

    const reward = calculateReward();
    updateBalance(reward);
    showRewardAnimation(reward);
    resetCollectTimer();
}

function calculateReward() {
    const baseReward = 100;
    const multiplier = currentUser?.amountLevel || 1;
    return baseReward * multiplier;
}

function updateBalance(amount) {
    if (!currentUser) return;
    
    currentUser.balance = (currentUser.balance || 0) + amount;
    updateBalanceDisplay();
    saveUserData();
}

function updateBalanceDisplay() {
    const balanceElement = document.querySelector('.balance-amount');
    if (balanceElement) {
        balanceElement.textContent = currentUser.balance;
    }
}

function showRewardAnimation(amount) {
    const rewardElement = document.createElement('div');
    rewardElement.className = 'floating-reward';
    rewardElement.textContent = `+${amount} 🕷️`;
    
    document.querySelector('.balance-display').appendChild(rewardElement);
    
    setTimeout(() => {
        rewardElement.remove();
    }, 1000);
}

function startGameTimer() {
    if (gameTimer) clearInterval(gameTimer);
    
    gameTimer = setInterval(() => {
        updateTimer();
    }, 1000);
}

function updateTimer() {
    const timerElement = document.querySelector('.timer');
    if (!timerElement) return;

    const now = Date.now();
    const lastCollect = currentUser?.lastCollect || now;
    const cooldown = 60000; // 1 minute
    const timeLeft = Math.max(0, cooldown - (now - lastCollect));
    
    const seconds = Math.floor(timeLeft / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    timerElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    
    const collectBtn = document.getElementById('collect-btn');
    if (collectBtn) {
        collectBtn.disabled = timeLeft > 0;
    }
}

function handleUpgrade(e) {
    const upgradeType = e.target.closest('.upgrade-btn').dataset.type;
    const upgradeCost = calculateUpgradeCost(upgradeType);
    
    if (currentUser.balance >= upgradeCost) {
        currentUser.balance -= upgradeCost;
        currentUser[`${upgradeType}Level`]++;
        updateBalanceDisplay();
        updateUpgradeButtons();
        saveUserData();
    }
}

function calculateUpgradeCost(type) {
    const baseUpgradeCost = 100;
    const level = currentUser[`${type}Level`] || 1;
    return Math.floor(baseUpgradeCost * Math.pow(1.5, level - 1));
}

function updateUpgradeButtons() {
    document.querySelectorAll('.upgrade-btn').forEach(btn => {
        const type = btn.dataset.type;
        const cost = calculateUpgradeCost(type);
        const canAfford = currentUser.balance >= cost;
        
        btn.textContent = `Upgrade (${cost} SPDR)`;
        btn.disabled = !canAfford;
    });
}

function handleRegistration() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    
    if (username.length < 3) return;
    
    currentUser = {
        id: tg.initDataUnsafe.user.id,
        username: username,
        balance: 0,
        speedLevel: 1,
        amountLevel: 1,
        lastCollect: Date.now(),
        registered: Date.now()
    };
    
    saveUserData();
    showConfetti();
    showMainGame();
}

function showConfetti() {
    const emojis = ['🎉', '✨', '💫', '🎊'];
    const container = document.createElement('div');
    container.className = 'confetti-container';
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('span');
        confetti.className = 'confetti';
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        container.appendChild(confetti);
    }
    
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 5000);
}

function showMainGame() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-screen').style.display = 'block';
    updateBalanceDisplay();
    updateUpgradeButtons();
}

// Admin panel functionality
let leaderboardClicks = 0;
let leaderboardClickTimer;

function handleLeaderboardClicks() {
    leaderboardClicks++;
    
    clearTimeout(leaderboardClickTimer);
    leaderboardClickTimer = setTimeout(() => {
        leaderboardClicks = 0;
    }, 3000);
    
    if (leaderboardClicks === 10) {
        showAdminPanel();
    }
}

function showAdminPanel() {
    if (!ADMINS.includes(currentUser.id)) return;
    
    const adminSection = document.createElement('div');
    adminSection.id = 'admin-section';
    adminSection.className = 'section';
    // Add admin panel content here
    
    document.getElementById('content-area').appendChild(adminSection);
    showSection('admin');
}

// Database operations
function saveUserData() {
    localStorage.setItem(`user_${currentUser.id}`, JSON.stringify(currentUser));
}

function loadUserData(userId) {
    return JSON.parse(localStorage.getItem(`user_${userId}`));
}

function checkUser(userId) {
    const userData = loadUserData(userId);
    if (userData) {
        currentUser = userData;
        showMainGame();
    } else {
        document.getElementById('welcome-screen').style.display = 'block';
    }
}
