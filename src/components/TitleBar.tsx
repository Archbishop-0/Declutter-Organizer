import React, { useState, useEffect } from 'react';
import { Sun, Moon, RotateCcw, Settings, SlidersHorizontal, Sparkles, Folder } from 'lucide-react';

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
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (window.electronAPI?.isMaximized) {
      window.electronAPI.isMaximized().then(setIsMaximized).catch(() => {});
    }
    if (window.electronAPI?.onMaximizedChange) {
      const cleanup = window.electronAPI.onMaximizedChange(max => {
        setIsMaximized(max);
      });
      return cleanup;
    }
  }, []);

  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow();
  };

  const handleMaximize = () => {
    window.electronAPI?.maximizeWindow();
    setIsMaximized(prev => !prev);
  };

  const handleClose = () => {
    window.electronAPI?.closeWindow();
  };

  return (
    <header className="h-10 w-full flex items-center justify-between select-none app-drag-region border-b border-white/[0.06] bg-[#0c0c0e] text-neutral-300">
      {/* Windows App Title & Brand (Left) */}
      <div className="flex items-center space-x-2.5 pl-3.5 no-drag">
        <div className="w-5 h-5 rounded flex items-center justify-center bg-white/[0.05] border border-white/10 text-neutral-300 shadow-sm">
          <Folder className="w-3 h-3 text-blue-400" />
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-neutral-200 tracking-wide font-sans">
            Declutter
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-[11px] text-neutral-400 font-medium tracking-normal hidden sm:inline">
            Workspace Organizer
          </span>
        </div>
      </div>

      {/* Middle Drag Area */}
      <div className="flex-1 h-full"></div>

      {/* Right Controls: Toolbar Tools + Windows Caption Buttons */}
      <div className="flex items-center h-full no-drag">
        {/* Quick Tools */}
        <div className="flex items-center space-x-0.5 pr-2">
          {/* Undo History */}
          <button
            onClick={onOpenHistory}
            title="Rollback / Undo History"
            className="relative p-1.5 rounded hover:bg-white/[0.07] text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {undoCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-600 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                {undoCount > 9 ? '9+' : undoCount}
              </span>
            )}
          </button>

          {/* Rule Manager */}
          <button
            onClick={onOpenRules}
            title="Topic & Project Rules"
            className="p-1.5 rounded hover:bg-white/[0.07] text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title="Toggle Appearance"
            className="p-1.5 rounded hover:bg-white/[0.07] text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="Preferences"
            className="p-1.5 rounded hover:bg-white/[0.07] text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Vertical divider */}
        <div className="w-px h-4 bg-white/[0.08] mr-1"></div>

        {/* Windows Caption Buttons */}
        <div className="flex items-center h-full">
          {/* Minimize */}
          <button
            onClick={handleMinimize}
            aria-label="Minimize"
            title="Minimize"
            className="w-11 h-10 flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors"
          >
            <svg className="w-2.5 h-2.5" viewBox="0 0 10 1">
              <line x1="0" y1="0.5" x2="10" y2="0.5" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={handleMaximize}
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
            title={isMaximized ? 'Restore' : 'Maximize'}
            className="w-11 h-10 flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors"
          >
            {isMaximized ? (
              <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M2.5 1.5h6v6h-6z" />
                <path d="M1.5 3.5h-1v6h6v-1" />
              </svg>
            ) : (
              <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="0.5" y="0.5" width="9" height="9" />
              </svg>
            )}
          </button>

          {/* Close (Windows Red on hover) */}
          <button
            onClick={handleClose}
            aria-label="Close"
            title="Close"
            className="w-11 h-10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#c42b1c] active:bg-[#b22619] transition-colors"
          >
            <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M1 1l8 8M9 1L1 9" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
