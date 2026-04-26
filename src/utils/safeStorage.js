const memoryStorage = {};

export const safeStorage = {
    getItem: (key) => {
        try { return localStorage.getItem(key); } catch {}
        try { return sessionStorage.getItem(key); } catch {}
        return memoryStorage[key] || null;
    },
    setItem: (key, value) => {
        try { localStorage.setItem(key, value); return; } catch {}
        try { sessionStorage.setItem(key, value); return; } catch {}
        memoryStorage[key] = value;
    },
    removeItem: (key) => {
        try { localStorage.removeItem(key); } catch {}
        try { sessionStorage.removeItem(key); } catch {}
        delete memoryStorage[key];
    }
};
