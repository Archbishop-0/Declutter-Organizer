import React from 'react';
import {
  Monitor,
  Download,
  FileText,
  FolderPlus,
  FolderKanban,
  Layers,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { AppPreferences } from '../types';

interface SidebarProps {
  currentPath: string | null;
  systemFolders: { desktop: string; downloads: string; documents: string; home: string } | null;
  onSelectPath: (path: string) => void;
  onBrowseFolder: () => void;
  preferences: AppPreferences;
  onUpdatePreferences: (updates: Partial<AppPreferences>) => void;
  isOrganizing: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  systemFolders,
  onSelectPath,
  onBrowseFolder,
  preferences,
  onUpdatePreferences,
  isOrganizing,
}) => {
  const isDesktop = currentPath && systemFolders && currentPath.toLowerCase() === systemFolders.desktop.toLowerCase();
  const isDownloads = currentPath && systemFolders && currentPath.toLowerCase() === systemFolders.downloads.toLowerCase();
  const isDocuments = currentPath && systemFolders && currentPath.toLowerCase() === systemFolders.documents.toLowerCase();
  const isCustom = currentPath && !isDesktop && !isDownloads && !isDocuments;

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between h-full border-r border-white/5 dark:border-white/5 bg-neutral-900/60 dark:bg-neutral-900/50 backdrop-blur-xl p-3 text-neutral-300">
      <div className="space-y-6">
        {/* Quick Folders Section */}
        <div>
          <div className="px-2.5 pb-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
            Quick Locations
          </div>
          <div className="space-y-1">
            <button
              disabled={isOrganizing}
              onClick={() => systemFolders?.desktop && onSelectPath(systemFolders.desktop)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isDesktop
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Monitor className={`w-4 h-4 ${isDesktop ? 'text-white' : 'text-blue-400'}`} />
                <span>Desktop</span>
              </div>
              {isDesktop && <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />}
            </button>

            <button
              disabled={isOrganizing}
              onClick={() => systemFolders?.downloads && onSelectPath(systemFolders.downloads)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isDownloads
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Download className={`w-4 h-4 ${isDownloads ? 'text-white' : 'text-emerald-400'}`} />
                <span>Downloads</span>
              </div>
              {isDownloads && <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />}
            </button>

            <button
              disabled={isOrganizing}
              onClick={() => systemFolders?.documents && onSelectPath(systemFolders.documents)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isDocuments
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileText className={`w-4 h-4 ${isDocuments ? 'text-white' : 'text-amber-400'}`} />
                <span>Documents</span>
              </div>
              {isDocuments && <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />}
            </button>

            <button
              disabled={isOrganizing}
              onClick={onBrowseFolder}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isCustom
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FolderPlus className={`w-4 h-4 ${isCustom ? 'text-white' : 'text-purple-400'}`} />
                <span className="truncate">{isCustom ? 'Custom Folder' : 'Choose Other...'}</span>
              </div>
              {isCustom && <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />}
            </button>
          </div>
        </div>

        {/* Organization Mode Selection */}
        <div>
          <div className="px-2.5 pb-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
            Organizing Mode
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onUpdatePreferences({ organizeMode: 'topics_first' })}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all ${
                preferences.organizeMode === 'topics_first'
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center space-x-2 font-medium">
                <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
                <span>Smart Topics & Projects</span>
              </div>
              <p className="text-[10px] text-neutral-400 pl-5.5 mt-0.5 leading-snug">
                Detects topics (tax, thesis, client) & project stems.
              </p>
            </button>

            <button
              onClick={() => onUpdatePreferences({ organizeMode: 'project_smart' })}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all ${
                preferences.organizeMode === 'project_smart'
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center space-x-2 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Project Auto-Clustering</span>
              </div>
              <p className="text-[10px] text-neutral-400 pl-5.5 mt-0.5 leading-snug">
                Groups files sharing prefix names into dedicated folders.
              </p>
            </button>

            <button
              onClick={() => onUpdatePreferences({ organizeMode: 'category_only' })}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all ${
                preferences.organizeMode === 'category_only'
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center space-x-2 font-medium">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>File Types & Formats</span>
              </div>
              <p className="text-[10px] text-neutral-400 pl-5.5 mt-0.5 leading-snug">
                Sorts by Documents, Images, Code, Audio, Video.
              </p>
            </button>

            <button
              onClick={() => onUpdatePreferences({ organizeMode: 'date_grouped' })}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all ${
                preferences.organizeMode === 'date_grouped'
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center space-x-2 font-medium">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Timeline (Year / Month)</span>
              </div>
              <p className="text-[10px] text-neutral-400 pl-5.5 mt-0.5 leading-snug">
                Sorts by modified date into Year/Month structure.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Card / Clean Junk toggle */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        <label className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-white/5 text-xs text-neutral-300 cursor-pointer hover:bg-white/10 transition-colors">
          <div className="flex items-center space-x-2">
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Quarantine Junk Files</span>
          </div>
          <input
            type="checkbox"
            checked={preferences.cleanJunkFiles}
            onChange={(e) => onUpdatePreferences({ cleanJunkFiles: e.target.checked })}
            className="w-3.5 h-3.5 rounded text-blue-500 focus:ring-blue-400 focus:ring-offset-0 bg-neutral-800 border-neutral-700"
          />
        </label>

        <div className="px-2.5 py-2 rounded-lg bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-500/10 text-[11px] text-neutral-400 leading-relaxed">
          <span className="font-semibold text-blue-300">Safety Guarantee:</span> Preview every file move before applying. Revert with 1-click Undo anytime.
        </div>
      </div>
    </aside>
  );
};
