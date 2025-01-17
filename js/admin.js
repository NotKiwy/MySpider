const ADMINS = [
    1402734620
];

class AdminPanel {
    constructor() {
        this.clickCount = 0;
        this.timeoutId = null;
    }

    init() {
        const leaderboardBtn = document.querySelector('[data-section="leaderboard"]');
        leaderboardBtn.addEventListener('click', () => this.handleClick());
    }

    handleClick() {
        this.clickCount++;
        
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.clickCount = 0;
        }, 3000);

        if (this.clickCount === 10) {
            this.showAdminPanel();
        }
    }

    showAdminPanel() {
        const userId = tg.initDataUnsafe.user.id;
        if (!ADMINS.includes(userId)) return;

        const adminHTML = `
            <div id="admin-panel">
                <h2>Admin Panel</h2>
                <div class="admin-controls">
                    <input type="text" id="target-user" placeholder="User ID">
                    <input type="number" id="spdr-amount" placeholder="SPDR Amount">
                    <button onclick="adminPanel.giveSPDR()">Give SPDR</button>
                    <button onclick="adminPanel.takeSPDR()">Take SPDR</button>
                    <button onclick="adminPanel.resetUser()">Reset User</button>
                    <button onclick="adminPanel.banUser()">Ban User</button>
                </div>
            </div>
        `;

        document.getElementById('sections').innerHTML = adminHTML;
    }
}
