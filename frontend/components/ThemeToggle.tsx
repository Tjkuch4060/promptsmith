import React, { useState, useEffect } from "react";

interface ThemeToggleProps {
  onThemeChange?: (isDark: boolean) => void;
}

export default function ThemeToggle({ onThemeChange }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
    onThemeChange?.(shouldBeDark);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    onThemeChange?.(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle btn-secondary hover-lift"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="theme-icon">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="theme-text">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}