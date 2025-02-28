
import React from 'react';
import { Brain, Laugh, Globe, Gamepad2, Moon } from 'lucide-react';

// خريطة الأيقونات لكل فئة
export const iconMap: Record<string, React.ReactNode> = {
  'funny': <Laugh className="h-6 w-6" />,
  'iq': <Brain className="h-6 w-6" />,
  'general': <Globe className="h-6 w-6" />,
  'cartoon': <Gamepad2 className="h-6 w-6" />,
  'ramadan': <Moon className="h-6 w-6 text-amber-500" />
};
