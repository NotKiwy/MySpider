class GameDatabase {
    constructor() {
        this.dbName = 'SpiderGameDB';
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Users store
                if (!db.objectStoreNames.contains('users')) {
                    const usersStore = db.createObjectStore('users', { keyPath: 'id' });
                    usersStore.createIndex('by_balance', 'balance');
                    usersStore.createIndex('by_username', 'username', { unique: true });
                }
                
                // Checks store
                if (!db.objectStoreNames.contains('checks')) {
                    db.createObjectStore('checks', { keyPath: 'id' });
                }
            };
        });
    }
}
