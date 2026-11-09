import React, { useState } from 'react';
import { Sun, Moon, RotateCcw, Settings, SlidersHorizontal, Sparkles } from 'lucide-react';

interface TitleBarProps {
  theme: 'dark' | 'light' | 'system';
  onToggleTheme: () => void;
  onOpenRules: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  undoCount: number;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  theme,
  onToggleTheme,
  onOpenRules,
  onOpenHistory,
  onOpenSettings,
  undoCount,
}) => {
  const [hoverLights, setHoverLights] = useState(false);

  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow();
  };

  const handleMaximize = () => {
    window.electronAPI?.maximizeWindow();
  };

  const handleClose = () => {
    window.electronAPI?.closeWindow();
  };

  return (
    <div className="h-10 w-full flex items-center justify-between px-3 select-none app-drag-region border-b border-white/5 dark:border-white/5 bg-neutral-900/80 dark:bg-neutral-950/80 backdrop-blur-md text-neutral-300">
      {/* macOS Traffic Lights */}
      <div 
        className="flex items-center space-x-2 no-drag pr-4"
        onMouseEnter={() => setHoverLights(true)}
        onMouseLeave={() => setHoverLights(false)}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF453A] border border-[#E0443E]/50 flex items-center justify-center transition-colors shadow-sm"
        >
          {hoverLights && (
            <svg className="w-1.5 h-1.5 text-neutral-900 stroke-[2.5]" viewBox="0 0 12 12" fill="none" stroke="currentColor">
              <path d="M2 2L10 10M10 2L2 10" />
            </svg>
          )}
        </button>
        <button
          onClick={handleMinimize}
          aria-label="Minimize"
          className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FF9F0A] border border-[#DEA123]/50 flex items-center justify-center transition-colors shadow-sm"
        >
          {hoverLights && (
            <svg className="w-1.5 h-1.5 text-neutral-900 stroke-[2.5]" viewBox="0 0 12 12" fill="none" stroke="currentColor">
              <path d="M1 6H11" />
            </svg>
          )}
        </button>
        <button
          onClick={handleMaximize}
          aria-label="Maximize"
          className="w-3 h-3 rounded-full bg-[#27C93F] hover:bg-[#32D74B] border border-[#1AAB29]/50 flex items-center justify-center transition-colors shadow-sm"
        >
          {hoverLights && (
            <svg className="w-1.5 h-1.5 text-neutral-900 fill-current" viewBox="0 0 12 12">
              <path d="M2 2H6V3H3V6H2V2ZM10 10H6V9H9V6H10V10Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Center Title */}
      <div className="flex items-center space-x-2 text-xs font-medium text-neutral-400 dark:text-neutral-400 tracking-wide pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-semibold text-neutral-200">Declutter</span>
        <span className="text-neutral-500">•</span>
        <span className="text-neutral-400">macOS Workspace Organizer</span>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center space-x-1 no-drag">
        {/* Undo History */}
        <button
          onClick={onOpenHistory}
          title="Rollback / Undo History"
          className="relative p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {undoCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
              {undoCount > 9 ? '9+' : undoCount}
            </span>
          )}
        </button>

        {/* Rule Manager */}
        <button
          onClick={onOpenRules}
          title="Topic & Project Rules"
          className="p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title="Toggle Appearance"
          className="p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="Preferences"
          className="p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
