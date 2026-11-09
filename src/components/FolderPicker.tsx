import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  RefreshCw,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Monitor,
  Download,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface FolderPickerProps {
  currentPath: string | null;
  onBrowse: () => void;
  onScan: () => void;
  onOpenFolder: () => void;
  isScanning: boolean;
  systemFolders: { desktop: string; downloads: string; documents: string; home: string } | null;
  onSelectPath: (path: string) => void;
}

export const FolderPicker: React.FC<FolderPickerProps> = ({
  currentPath,
  onBrowse,
  onScan,
  onOpenFolder,
  isScanning,
  systemFolders,
  onSelectPath,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // On Electron, File object has .path property
      const filePath = (file as any).path;
      if (filePath) {
        onSelectPath(filePath);
      }
    }
  };

  if (!currentPath) {
    return (
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full max-w-2xl mx-auto my-auto p-8 rounded-2xl border transition-all text-center ${
          isDragOver
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
            : 'border-white/10 dark:border-white/10 bg-neutral-900/40 backdrop-blur-md shadow-2xl'
        }`}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <FolderOpen className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-100 tracking-tight mb-2">
          Choose a Folder to Declutter
        </h2>
        <p className="text-sm text-neutral-400 max-w-md mx-auto mb-8">
          Clean up messy clutter into organized, project-based and topic-specific folders with instant 1-click preview.
        </p>

        {/* Quick select buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => systemFolders?.desktop && onSelectPath(systemFolders.desktop)}
            className="flex flex-col items-center p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-neutral-200 group"
          >
            <Monitor className="w-6 h-6 mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Desktop</span>
            <span className="text-[10px] text-neutral-500 mt-0.5">Clear messy icons</span>
          </button>

          <button
            onClick={() => systemFolders?.downloads && onSelectPath(systemFolders.downloads)}
            className="flex flex-col items-center p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-neutral-200 group"
          >
            <Download className="w-6 h-6 mb-2 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Downloads</span>
            <span className="text-[10px] text-neutral-500 mt-0.5">Filter installers & files</span>
          </button>

          <button
            onClick={() => systemFolders?.documents && onSelectPath(systemFolders.documents)}
            className="flex flex-col items-center p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-neutral-200 group"
          >
            <FileText className="w-6 h-6 mb-2 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Documents</span>
            <span className="text-[10px] text-neutral-500 mt-0.5">Sort reports & sheets</span>
          </button>
        </div>

        {/* Primary custom folder browse */}
        <button
          onClick={onBrowse}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Folder className="w-4 h-4" />
          <span>Select Custom Folder</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>

        <div className="mt-4 text-[11px] text-neutral-500">
          Tip: You can also drag and drop any folder directly into this window
        </div>
      </div>
    );
  }

  // Active path view
  return (
    <div className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-neutral-900/50 border border-white/5 backdrop-blur-md">
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
          <Folder className="w-5 h-5 text-blue-400" />
        </div>
        <div className="overflow-hidden">
          <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center space-x-1.5">
            <span>Target Workspace</span>
            <span className="text-neutral-600">•</span>
            <span className="text-emerald-400 font-normal">Active</span>
          </div>
          <div className="text-sm font-semibold text-neutral-200 truncate font-mono max-w-xl" title={currentPath}>
            {currentPath}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={onOpenFolder}
          title="Open in System File Explorer"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors border border-white/5 text-xs flex items-center space-x-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Reveal</span>
        </button>

        <button
          onClick={onScan}
          disabled={isScanning}
          title="Rescan folder contents"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors border border-white/5 text-xs flex items-center space-x-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-blue-400' : ''}`} />
          <span>Rescan</span>
        </button>

        <button
          onClick={onBrowse}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-neutral-200 hover:text-white transition-colors border border-white/10 text-xs font-medium"
        >
          Change
        </button>
      </div>
    </div>
  );
};
