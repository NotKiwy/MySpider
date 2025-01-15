// Имитация базы данных (в реальном проекте используй бэкенд)
let users = {};

// Генерация уникального имени
function generateUsername() {
    const adjectives = ["Быстрый", "Смелый", "Ловкий", "Хитрый", "Сильный"];
    const nouns = ["Паук", "Охотник", "Воин", "Следопыт", "Герой"];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective} ${randomNoun}`;
}

// Регистрация пользователя
function registerUser(userId) {
    if (!users[userId]) {
        users[userId] = {
            username: generateUsername(),
            stars: 0,
            names: []
        };
    }
    return users[userId];
}

// Получение данных пользователя
function getUserData(userId) {
    return users[userId];
}

// Инициализация приложения
if (window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    const userId = tg.initDataUnsafe.user?.id;

    if (userId) {
        const user = registerUser(userId);
        const welcomeMessage = document.getElementById('welcomeMessage');
        welcomeMessage.textContent = `Добро пожаловать, ${user.username}!`;

        // Кнопка перехода в профиль
        document.getElementById('profileButton').addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }
}
