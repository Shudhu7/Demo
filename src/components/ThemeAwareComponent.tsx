import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';

const ThemeAwareComponent: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <Card className={`transition-colors ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <CardContent className="p-6">
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Theme-Aware Component
        </h3>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          This component adapts its styling based on the current theme.
        </p>
      </CardContent>
    </Card>
  );
};

export default ThemeAwareComponent;
