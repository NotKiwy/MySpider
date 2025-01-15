// Имитация базы данных (в реальном проекте используй бэкенд)
let users = {};

// Генерация случайного имени
function generateUsername() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * 6) + 5; // От 5 до 10 символов
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Регистрация пользователя
function registerUser(userId) {
    if (!users[userId]) {
        users[userId] = {
            username: generateUsername(),
            stars: 100, // Начальное количество Stars для теста
            names: []
        };
    }
    return users[userId];
}

// Получение данных пользователя
function getUserData(userId) {
    return users[userId];
}

// Проверка уникальности имени
function isUsernameUnique(username) {
    return Object.values(users).every(user => user.username !== username);
}

// Инициализация приложения
if (window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    const userId = tg.initDataUnsafe.user?.id;

    if (userId) {
        const user = registerUser(userId);

        // Экран приветствия
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            const welcomeMessage = document.getElementById('welcomeMessage');
            welcomeMessage.textContent = `Добро пожаловать, ${user.username}!`;

            document.getElementById('startButton').addEventListener('click', () => {
                window.location.href = 'main.html';
            });
        }

        // Главное меню
        if (window.location.pathname.endsWith('main.html')) {
            document.getElementById('profileButton').addEventListener('click', () => {
                window.location.href = 'profile.html';
            });
        }

        // Профиль
        if (window.location.pathname.endsWith('profile.html')) {
            const profileInfo = document.getElementById('profileInfo');
            profileInfo.innerHTML = `
                <p>Текущее имя: <strong>${user.username}</strong></p>
                <p>Telegram Stars: ${user.stars}</p>
            `;

            document.getElementById('changeNameButton').addEventListener('click', () => {
                const newUsername = document.getElementById('newUsername').value.trim();
                if (newUsername.length < 4 || newUsername.length > 20) {
                    alert('Имя должно быть от 4 до 20 символов!');
                    return;
                }
                if (!isUsernameUnique(newUsername)) {
                    alert('Это имя уже занято!');
                    return;
                }
                if (user.stars >= 50) {
                    user.stars -= 50;
                    user.username = newUsername;
                    profileInfo.innerHTML = `
                        <p>Текущее имя: <strong>${user.username}</strong></p>
                        <p>Telegram Stars: ${user.stars}</p>
                    `;
                } else {
                    alert('Недостаточно Stars!');
                }
            });

            document.getElementById('backButton').addEventListener('click', () => {
                window.location.href = 'main.html';
            });
        }
    }
}
