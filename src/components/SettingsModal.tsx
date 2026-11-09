import React from 'react';
import {
  X,
  Settings,
  GitBranch,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-xl max-h-[85vh] flex flex-col rounded-xl bg-[#0e0e12] border border-white/10 shadow-2xl overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[#0a0a0d]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-100 font-sans">
                Preferences & Settings
              </h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Configure conflict safety, junk quarantine, and workspace rules.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-white/[0.08] text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs bg-[#0a0a0d]">
          {/* Section 1: Conflict Resolution */}
          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest block">
              Conflict Resolution
            </label>
            <p className="text-neutral-500 text-[11px]">
              When a file with the same name already exists in the target destination:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'rename', label: 'Auto-Rename', desc: 'Appends (1), (2)' },
                { id: 'skip', label: 'Skip File', desc: 'Leave in place' },
                { id: 'overwrite', label: 'Overwrite', desc: 'Replace target' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() =>
                    onSavePreferences({
                      ...preferences,
                      conflictResolution: opt.id as any,
                    })
                  }
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    preferences.conflictResolution === opt.id
                      ? 'bg-blue-600/10 border-blue-500/50 text-white'
                      : 'bg-[#121216] border-white/[0.05] text-neutral-400 hover:bg-[#18181f]'
                  }`}
                >
                  <div className="font-semibold text-xs text-neutral-200">{opt.label}</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Temporary Junk Files */}
          <div className="space-y-2 pt-3 border-t border-white/[0.05]">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest block">
                  Junk & Incomplete Downloads Cleaner
                </label>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Isolate temporary extensions (.crdownload, .tmp, .part) into a Cleanup subfolder.
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
                className="w-3.5 h-3.5 rounded text-blue-500 bg-neutral-900 border-neutral-700"
              />
            </div>
          </div>

          {/* Section 3: Protected Files */}
          <div className="space-y-2 pt-3 border-t border-white/[0.05]">
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest block">
                Protected System Files
              </label>
              <p className="text-neutral-500 text-[11px] mt-0.5">
                Declutter automatically prevents touching the following system entries:
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {preferences.protectedNames.map(name => (
                <span
                  key={name}
                  className="px-2 py-0.5 rounded bg-[#121216] border border-white/[0.05] text-[11px] text-neutral-400 font-mono"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: GitHub Ready */}
          <div className="pt-3 border-t border-white/[0.05]">
            <div className="p-3 rounded-lg bg-[#121216] border border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="font-semibold text-neutral-200 flex items-center space-x-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                  <span>Ready for GitHub</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Full MIT-licensed TypeScript source code ready for your personal portfolio.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-white/[0.06] bg-[#0a0a0d]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-all"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
