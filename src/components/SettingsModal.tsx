import React from 'react';
import {
  X,
  Settings,
  Shield,
  FileCode,
  FolderLock,
  Sun,
  Moon,
  GitBranch,
  CheckCircle,
} from 'lucide-react';
import { AppPreferences } from '../types';

interface SettingsModalProps {
  preferences: AppPreferences;
  isOpen: boolean;
  onClose: () => void;
  onSavePreferences: (updated: AppPreferences) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  preferences,
  isOpen,
  onClose,
  onSavePreferences,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100">
                Preferences & Settings
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Configure conflict safety, junk quarantine, and workspace rules.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Section 1: Conflict Resolution */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Filename Conflict Resolution
            </label>
            <p className="text-neutral-500 text-[11px] leading-relaxed">
              When a file with the same name already exists in the destination folder:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'rename', label: 'Auto-Rename', desc: 'Append (1), (2)...' },
                { id: 'skip', label: 'Skip File', desc: 'Leave in root folder' },
                { id: 'overwrite', label: 'Overwrite', desc: 'Replace target file' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() =>
                    onSavePreferences({
                      ...preferences,
                      conflictResolution: opt.id as any,
                    })
                  }
                  className={`p-3 rounded-xl border text-left transition-all ${
                    preferences.conflictResolution === opt.id
                      ? 'bg-blue-600/10 border-blue-500/50 text-white'
                      : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:bg-white/5'
                  }`}
                >
                  <div className="font-semibold text-xs text-neutral-200">{opt.label}</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Temporary Junk Files */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                  Junk & Incomplete Download Cleaner
                </label>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Quarantine temporary extensions (.crdownload, .tmp, .part) into a Cleanup folder.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.cleanJunkFiles}
                onChange={e =>
                  onSavePreferences({
                    ...preferences,
                    cleanJunkFiles: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-blue-500 bg-neutral-800 border-neutral-700"
              />
            </div>
          </div>

          {/* Section 3: Protected Files */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Protected System Files
              </label>
              <p className="text-neutral-500 text-[11px] mt-0.5">
                Declutter automatically protects the following files from ever being moved:
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {preferences.protectedNames.map(name => (
                <span
                  key={name}
                  className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[11px] text-neutral-400 font-mono"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: GitHub & Open Source */}
          <div className="pt-2 border-t border-white/5">
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-neutral-800/60 to-neutral-800/30 border border-white/5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-neutral-200 flex items-center space-x-1.5">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  <span>Ready for GitHub</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Clean modular TypeScript + React code, fully open-source and customizable.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-white/5 bg-neutral-950/80">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
