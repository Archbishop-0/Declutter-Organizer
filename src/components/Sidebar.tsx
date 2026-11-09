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
  Check,
  Trash2,
  FolderCheck,
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
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between h-full border-r border-white/[0.06] bg-[#0c0c0f] p-3 text-neutral-300 select-none">
      <div className="space-y-6">
        {/* Quick Folders Section */}
        <div>
          <div className="px-2.5 pb-2 text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
            Quick Locations
          </div>
          <div className="space-y-1">
            <button
              disabled={isOrganizing}
              onClick={() => systemFolders?.desktop && onSelectPath(systemFolders.desktop)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                isDesktop
                  ? 'bg-[#1e1e24] text-white border border-white/10 shadow-sm'
                  : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Monitor className={`w-3.5 h-3.5 ${isDesktop ? 'text-blue-400' : 'text-neutral-400'}`} />
                <span>Desktop</span>
              </div>
              {isDesktop && <Check className="w-3.5 h-3.5 text-blue-400" />}
            </button>

            <button
              disabled={isOrganizing}
              onClick={() => systemFolders?.downloads && onSelectPath(systemFolders.downloads)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                isDownloads
                  ? 'bg-[#1e1e24] text-white border border-white/10 shadow-sm'
                  : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Download className={`w-3.5 h-3.5 ${isDownloads ? 'text-emerald-400' : 'text-neutral-400'}`} />
                <span>Downloads</span>
              </div>
              {isDownloads && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              disabled={isOrganizing}
              onClick={() => systemFolders?.documents && onSelectPath(systemFolders.documents)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                isDocuments
                  ? 'bg-[#1e1e24] text-white border border-white/10 shadow-sm'
                  : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileText className={`w-3.5 h-3.5 ${isDocuments ? 'text-amber-400' : 'text-neutral-400'}`} />
                <span>Documents</span>
              </div>
              {isDocuments && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              disabled={isOrganizing}
              onClick={onBrowseFolder}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                isCustom
                  ? 'bg-[#1e1e24] text-white border border-white/10 shadow-sm'
                  : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FolderPlus className={`w-3.5 h-3.5 ${isCustom ? 'text-purple-400' : 'text-neutral-400'}`} />
                <span className="truncate">{isCustom ? 'Custom Folder' : 'Select Folder...'}</span>
              </div>
              {isCustom && <Check className="w-3.5 h-3.5 text-purple-400" />}
            </button>
          </div>
        </div>

        {/* Organization Mode Selection */}
        <div>
          <div className="px-2.5 pb-2 text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
            Filtering Strategy
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onUpdatePreferences({ organizeMode: 'topics_first' })}
              className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition-all ${
                preferences.organizeMode === 'topics_first'
                  ? 'bg-[#1e1e24] text-white border border-white/10'
                  : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center space-x-2 font-medium">
                <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
                <span>Topics & Projects</span>
              </div>
              <p className="text-[10px] text-neutral-500 pl-5 mt-0.5 leading-snug">
                Detects invoices, thesis, clients & keywords.
              </p>
            </button>

            <button
              onClick={() => onUpdatePreferences({ organizeMode: 'project_smart' })}
              className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition-all ${
                preferences.organizeMode === 'project_smart'
                  ? 'bg-[#1e1e24] text-white border border-white/10'
                  : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center space-x-2 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Project Auto-Clustering</span>
              </div>
              <p className="text-[10px] text-neutral-500 pl-5 mt-0.5 leading-snug">
                Groups filenames sharing stem prefixes.
              </p>
            </button>

            <button
              onClick={() => onUpdatePreferences({ organizeMode: 'category_only' })}
              className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition-all ${
                preferences.organizeMode === 'category_only'
                  ? 'bg-[#1e1e24] text-white border border-white/10'
                  : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center space-x-2 font-medium">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>File Types & Formats</span>
              </div>
              <p className="text-[10px] text-neutral-500 pl-5 mt-0.5 leading-snug">
                Documents, Images, Developer, Media.
              </p>
            </button>

            <button
              onClick={() => onUpdatePreferences({ organizeMode: 'date_grouped' })}
              className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition-all ${
                preferences.organizeMode === 'date_grouped'
                  ? 'bg-[#1e1e24] text-white border border-white/10'
                  : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center space-x-2 font-medium">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Timeline (Year / Month)</span>
              </div>
              <p className="text-[10px] text-neutral-500 pl-5 mt-0.5 leading-snug">
                Date-based chronological archives.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Matte Card / Clean Junk toggle */}
      <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
        <label className="flex items-center justify-between px-2.5 py-2 rounded-md bg-[#131317] border border-white/[0.06] text-xs text-neutral-300 cursor-pointer hover:bg-[#18181e] transition-colors">
          <div className="flex items-center space-x-2">
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Quarantine Junk Files</span>
          </div>
          <input
            type="checkbox"
            checked={preferences.cleanJunkFiles}
            onChange={(e) => onUpdatePreferences({ cleanJunkFiles: e.target.checked })}
            className="w-3.5 h-3.5 rounded text-blue-500 bg-neutral-900 border-neutral-700"
          />
        </label>

        <div className="px-3 py-2.5 rounded-md bg-[#121216] border border-white/[0.06] text-[11px] text-neutral-400 leading-relaxed">
          <div className="flex items-center space-x-1.5 text-neutral-200 font-medium mb-0.5">
            <FolderCheck className="w-3 h-3 text-blue-400" />
            <span>Dry-Run Safety</span>
          </div>
          Files are only moved after your approval in the preview step.
        </div>
      </div>
    </aside>
  );
};
