import { useTheme } from '@/contexts/ThemeContext';

export const useThemeClass = () => {
  const { isDark } = useTheme();
  
  const getThemeClass = (lightClass: string, darkClass: string) => {
    return isDark ? darkClass : lightClass;
  };

  const themeClasses = {
    background: isDark ? 'bg-gray-900' : 'bg-gray-50',
    card: isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: isDark ? 'text-white' : 'text-gray-900',
      secondary: isDark ? 'text-gray-300' : 'text-gray-600',
      muted: isDark ? 'text-gray-400' : 'text-gray-500'
    },
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    input: isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300',
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
  };

  return { getThemeClass, themeClasses, isDark };
};