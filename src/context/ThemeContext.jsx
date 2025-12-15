import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe ser usado dentro de ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Detectar preferencia del sistema
    const getSystemTheme = () => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    };

    // Obtener tema guardado o usar preferencia del sistema
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || getSystemTheme();
    });

    useEffect(() => {
        // Aplicar tema al documento
        const root = document.documentElement;
        const body = document.body;
        
        if (theme === 'dark') {
            root.classList.add('dark');
            body.classList.add('dark');
            // Aplicar estilos adicionales para modo oscuro
            body.style.backgroundColor = '#111827';
            body.style.color = '#f9fafb';
        } else {
            root.classList.remove('dark');
            body.classList.remove('dark');
            // Aplicar estilos para modo claro
            body.style.backgroundColor = '#ffffff';
            body.style.color = '#111827';
        }
        
        // Guardar preferencia
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Escuchar cambios en las preferencias del sistema
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            // Solo cambiar si no hay preferencia guardada
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        
        // Aplicar transición suave
        document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Remover transición después de completarse
        setTimeout(() => {
            document.documentElement.style.transition = '';
            document.body.style.transition = '';
        }, 300);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
