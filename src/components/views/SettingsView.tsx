import React from 'react';
import { AjustesView } from './AjustesView';
import { ThemeMode } from '../../types';

interface SettingsViewProps {
  theme?: ThemeMode;
  [key: string]: any;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme = 'dark' }) => {
  return <AjustesView theme={theme} />;
};
