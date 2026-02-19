import React, { createContext, useState, useEffect, useMemo } from 'react';
import { themes } from 'theme_config';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Load saved theme from localStorage or default to 'classic'
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('appTheme');
    return saved && themes[saved] ? saved : 'classic';
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appTheme', currentTheme);
  }, [currentTheme]);

  const theme = useMemo(() => themes[currentTheme], [currentTheme]);

  const value = {
    currentTheme,
    setCurrentTheme,
    theme,
    availableThemes: themes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
