import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  
  // Track usage hours (for demonstration, increment every minute if active)
  const [darkModeHours, setDarkModeHours] = useState(0);
  const [lowBandwidthHours, setLowBandwidthHours] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (darkMode) {
        setDarkModeHours(prev => prev + 1 / 60);
      }
      if (lowBandwidth) {
        setLowBandwidthHours(prev => prev + 1 / 60);
      }
    }, 60000); // every minute
    return () => clearInterval(interval);
  }, [darkMode, lowBandwidth]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const value = {
    darkMode,
    setDarkMode,
    lowBandwidth,
    setLowBandwidth,
    darkModeHours,
    lowBandwidthHours,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};