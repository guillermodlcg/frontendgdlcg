// Module-level memory cache — always written first, survives localStorage failures (iOS Safari PWA)
const memoryCache = {};

export const safeStorage = {
    getItem: (key) => {
        // Check memory first — fastest and most reliable on iOS
        if (memoryCache[key] != null) return memoryCache[key];
        try { const v = localStorage.getItem(key); if (v != null) { memoryCache[key] = v; return v; } } catch {}
        try { const v = sessionStorage.getItem(key); if (v != null) { memoryCache[key] = v; return v; } } catch {}
        return null;
    },
    setItem: (key, value) => {
        memoryCache[key] = value;
        try { localStorage.setItem(key, value); } catch {}
        try { sessionStorage.setItem(key, value); } catch {}
    },
    removeItem: (key) => {
        delete memoryCache[key];
        try { localStorage.removeItem(key); } catch {}
        try { sessionStorage.removeItem(key); } catch {}
    }
};
