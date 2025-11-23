import { createContext, useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export function ThemeProviderWrapper({ children }) {
    const [theme, setTheme] = useState(DefaultTheme);

    //Get theme from storage
    useEffect(() => {
        AsyncStorage.getItem('theme').then((value) => {
            if (value === 'dark') setTheme(DarkTheme);
            else setTheme(DefaultTheme);
        });
    }, []);

    //changes theme between light and dark
    const toggleTheme = async () => {
        const newTheme = theme === DarkTheme ? DefaultTheme : DarkTheme;
        setTheme(newTheme);
        //save layout choice until changed
        await AsyncStorage.setItem('theme', newTheme === DarkTheme ? 'dark' : 'light');
    };

    const isDarkMode = theme === DarkTheme;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}
