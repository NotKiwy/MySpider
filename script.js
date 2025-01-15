// Загрузка данных профиля
if (window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    const userId = tg.initDataUnsafe.user?.id;

    if (userId) {
        const user = getUserData(userId);
        const profileInfo = document.getElementById('profileInfo');
        profileInfo.innerHTML = `
            <p>Текущее имя: <strong>${user.username}</strong></p>
            <p>Telegram Stars: ${user.stars}</p>
        `;

        // Кнопка изменения имени
        document.getElementById('changeNameButton').addEventListener('click', () => {
            if (user.stars >= 50) {
                user.stars -= 50;
                user.username = generateUsername();
                profileInfo.innerHTML = `
                    <p>Текущее имя: <strong>${user.username}</strong></p>
                    <p>Telegram Stars: ${user.stars}</p>
                `;
            } else {
                alert('Недостаточно Stars!');
            }
        });

        // Кнопка добавления имени
        document.getElementById('addNameButton').addEventListener('click', () => {
            if (user.stars >= 100) {
                user.stars -= 100;
                user.names.push(generateUsername());
                profileInfo.innerHTML = `
                    <p>Текущее имя: <strong>${user.username}</strong></p>
                    <p>Дополнительные имена: ${user.names.join(', ')}</p>
                    <p>Telegram Stars: ${user.stars}</p>
                `;
            } else {
                alert('Недостаточно Stars!');
            }
        });

        // Кнопка "Назад"
        document.getElementById('backButton').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}
