import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  Monitor,
  Download,
  FileText,
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
        className={`w-full max-w-2xl mx-auto my-auto p-8 rounded-xl border transition-all text-center ${
          isDragOver
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-white/[0.08] bg-[#111115] shadow-xl'
        }`}
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#1a1a22] border border-white/10 flex items-center justify-center shadow-md">
          <FolderOpen className="w-7 h-7 text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-100 tracking-tight mb-1.5 font-sans">
          Select a Folder to Declutter
        </h2>
        <p className="text-xs text-neutral-400 max-w-md mx-auto mb-7 leading-relaxed">
          Filter out chaos and organize files into dedicated project folders and categorized topics.
        </p>

        {/* Quick select buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => systemFolders?.desktop && onSelectPath(systemFolders.desktop)}
            className="flex flex-col items-center p-3.5 rounded-lg bg-[#16161c] hover:bg-[#1d1d24] border border-white/[0.06] hover:border-white/10 transition-all text-neutral-200 group"
          >
            <Monitor className="w-5 h-5 mb-2 text-blue-400 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-medium">Desktop</span>
            <span className="text-[10px] text-neutral-500 mt-0.5">Clear desktop icons</span>
          </button>

          <button
            onClick={() => systemFolders?.downloads && onSelectPath(systemFolders.downloads)}
            className="flex flex-col items-center p-3.5 rounded-lg bg-[#16161c] hover:bg-[#1d1d24] border border-white/[0.06] hover:border-white/10 transition-all text-neutral-200 group"
          >
            <Download className="w-5 h-5 mb-2 text-emerald-400 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-medium">Downloads</span>
            <span className="text-[10px] text-neutral-500 mt-0.5">Sort installers & files</span>
          </button>

          <button
            onClick={() => systemFolders?.documents && onSelectPath(systemFolders.documents)}
            className="flex flex-col items-center p-3.5 rounded-lg bg-[#16161c] hover:bg-[#1d1d24] border border-white/[0.06] hover:border-white/10 transition-all text-neutral-200 group"
          >
            <FileText className="w-5 h-5 mb-2 text-amber-400 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-medium">Documents</span>
            <span className="text-[10px] text-neutral-500 mt-0.5">Filter work & reports</span>
          </button>
        </div>

        {/* Primary custom folder browse */}
        <button
          onClick={onBrowse}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md transition-all active:scale-[0.98]"
        >
          <Folder className="w-3.5 h-3.5" />
          <span>Browse Custom Folder</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>

        <div className="mt-4 text-[11px] text-neutral-500">
          Or simply drag and drop any folder directly into this window
        </div>
      </div>
    );
  }

  // Active path view
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#111115] border border-white/[0.07] text-neutral-200 shadow-sm">
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="w-8 h-8 rounded-md bg-[#181820] border border-white/10 flex items-center justify-center flex-shrink-0">
          <Folder className="w-4 h-4 text-blue-400" />
        </div>
        <div className="overflow-hidden">
          <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest flex items-center space-x-1.5">
            <span>Target Folder</span>
            <span className="text-neutral-600">•</span>
            <span className="text-emerald-400 font-normal">Active</span>
          </div>
          <div className="text-xs font-medium text-neutral-200 truncate font-mono max-w-xl" title={currentPath}>
            {currentPath}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={onOpenFolder}
          title="Open in Windows Explorer"
          className="px-2.5 py-1.5 rounded-md bg-[#181820] hover:bg-[#20202a] text-neutral-300 hover:text-white transition-colors border border-white/[0.06] text-xs flex items-center space-x-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Reveal</span>
        </button>

        <button
          onClick={onScan}
          disabled={isScanning}
          title="Rescan folder contents"
          className="px-2.5 py-1.5 rounded-md bg-[#181820] hover:bg-[#20202a] text-neutral-300 hover:text-white transition-colors border border-white/[0.06] text-xs flex items-center space-x-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-blue-400' : ''}`} />
          <span>Rescan</span>
        </button>

        <button
          onClick={onBrowse}
          className="px-3 py-1.5 rounded-md bg-[#1f1f28] hover:bg-[#272734] text-neutral-200 hover:text-white transition-colors border border-white/10 text-xs font-medium"
        >
          Change
        </button>
      </div>
    </div>
  );
};
