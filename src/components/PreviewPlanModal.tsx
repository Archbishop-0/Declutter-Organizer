import React, { useState, useMemo } from 'react';
import {
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  Search,
  Play,
} from 'lucide-react';
import { OrganizationPlan, PlanAction } from '../types';
import { formatBytes } from '../services/organizerEngine';

interface PreviewPlanModalProps {
  plan: OrganizationPlan;
  isOpen: boolean;
  onClose: () => void;
  onExecute: (updatedPlan: OrganizationPlan) => void;
  isExecuting: boolean;
}

export const PreviewPlanModal: React.FC<PreviewPlanModalProps> = ({
  plan,
  isOpen,
  onClose,
  onExecute,
  isExecuting,
}) => {
  const [actions, setActions] = useState<PlanAction[]>(plan.actions);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    setActions(plan.actions);
  }, [plan]);

  const toggleAction = (id: string) => {
    setActions(prev =>
      prev.map(a => (a.id === id ? { ...a, selected: !a.selected } : a))
    );
  };

  const toggleFolderAll = (folder: string, select: boolean) => {
    setActions(prev =>
      prev.map(a => (a.destinationFolder === folder ? { ...a, selected: select } : a))
    );
  };

  const toggleSelectAll = (select: boolean) => {
    setActions(prev => prev.map(a => ({ ...a, selected: select })));
  };

  const toggleFolderCollapse = (folder: string) => {
    setCollapsedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const filteredActions = useMemo(() => {
    if (!searchQuery.trim()) return actions;
    const q = searchQuery.toLowerCase();
    return actions.filter(
      a =>
        a.fileName.toLowerCase().includes(q) ||
        a.destinationFolder.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q)
    );
  }, [actions, searchQuery]);

  const groupedActions = useMemo(() => {
    const groups: Record<string, PlanAction[]> = {};
    for (const action of filteredActions) {
      if (!groups[action.destinationFolder]) {
        groups[action.destinationFolder] = [];
      }
      groups[action.destinationFolder].push(action);
    }
    return groups;
  }, [filteredActions]);

  const selectedCount = actions.filter(a => a.selected).length;

  const handleRun = () => {
    const updatedPlan: OrganizationPlan = {
      ...plan,
      actions,
    };
    onExecute(updatedPlan);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl bg-[#0e0e12] border border-white/10 shadow-2xl overflow-hidden text-neutral-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[#0a0a0d]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <h2 className="text-sm font-semibold text-neutral-100 font-sans">
                Review Organization Plan
              </h2>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Confirm destination paths. Uncheck files to keep them in place.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isExecuting}
            className="p-1.5 rounded hover:bg-white/[0.08] text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar: Search & Select All */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/[0.06] bg-[#111115] gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by file name or target folder..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-md bg-[#16161c] border border-white/[0.08] text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => toggleSelectAll(true)}
              className="px-2.5 py-1 rounded bg-[#181820] hover:bg-[#20202a] text-neutral-300 hover:text-white border border-white/[0.06] transition-colors"
            >
              Select All
            </button>
            <button
              onClick={() => toggleSelectAll(false)}
              className="px-2.5 py-1 rounded bg-[#181820] hover:bg-[#20202a] text-neutral-300 hover:text-white border border-white/[0.06] transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Folder Groups & File List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#0a0a0d]">
          {Object.keys(groupedActions).length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No files matched your search filter.
            </div>
          ) : (
            Object.entries(groupedActions).map(([folder, items]) => {
              const isCollapsed = !!collapsedFolders[folder];
              const folderSelectedCount = items.filter(i => i.selected).length;
              const allFolderSelected = folderSelectedCount === items.length;

              return (
                <div
                  key={folder}
                  className="rounded-lg border border-white/[0.06] bg-[#121216] overflow-hidden"
                >
                  {/* Folder group header */}
                  <div className="flex items-center justify-between px-3.5 py-2 bg-[#16161c] border-b border-white/[0.05]">
                    <div
                      className="flex items-center space-x-2 cursor-pointer select-none"
                      onClick={() => toggleFolderCollapse(folder)}
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                      )}
                      <Folder className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs font-semibold text-neutral-200 font-mono">
                        {folder}
                      </span>
                      <span className="text-[10px] text-neutral-400 px-1.5 py-0.5 rounded bg-white/[0.06] font-sans">
                        {folderSelectedCount} / {items.length}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleFolderAll(folder, !allFolderSelected)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {allFolderSelected ? 'Deselect group' : 'Select group'}
                    </button>
                  </div>

                  {/* Files inside folder */}
                  {!isCollapsed && (
                    <div className="divide-y divide-white/[0.04]">
                      {items.map(action => (
                        <div
                          key={action.id}
                          onClick={() => toggleAction(action.id)}
                          className={`flex items-center justify-between px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                            action.selected
                              ? 'bg-blue-600/[0.04] hover:bg-blue-600/[0.08]'
                              : 'opacity-40 hover:opacity-60 bg-transparent'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 overflow-hidden pr-4">
                            <input
                              type="checkbox"
                              checked={action.selected}
                              onChange={() => {}}
                              className="w-3.5 h-3.5 rounded text-blue-500 bg-neutral-900 border-neutral-700"
                            />
                            <File className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                            <div className="overflow-hidden">
                              <span className="font-medium text-neutral-200 truncate block">
                                {action.fileName}
                              </span>
                              <span className="text-[10px] text-neutral-500 block truncate">
                                {action.reason}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 flex-shrink-0">
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {formatBytes(action.size)}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${
                                action.type === 'archive'
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}
                            >
                              {action.type === 'archive' ? 'Junk' : 'Move'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-[#0a0a0d]">
          <div className="flex items-center space-x-2 text-xs text-neutral-400">
            <span className="font-semibold text-neutral-200">{selectedCount}</span>
            <span>of {actions.length} files selected for move</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              disabled={isExecuting}
              className="px-3.5 py-1.5 rounded-md bg-[#16161c] hover:bg-[#202028] text-neutral-300 hover:text-white text-xs font-medium border border-white/[0.06] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRun}
              disabled={isExecuting || selectedCount === 0}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-all active:scale-[0.98] disabled:opacity-40"
            >
              {isExecuting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Organizing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute Move ({selectedCount})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
