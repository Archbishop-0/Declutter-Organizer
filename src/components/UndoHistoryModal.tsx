import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  Clock,
  Folder,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { UndoRecord } from '../types';

interface UndoHistoryModalProps {
  history: UndoRecord[];
  isOpen: boolean;
  onClose: () => void;
  onUndo: (recordId: string) => Promise<void>;
  isUndoing: boolean;
}

export const UndoHistoryModal: React.FC<UndoHistoryModalProps> = ({
  history,
  isOpen,
  onClose,
  onUndo,
  isUndoing,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100">
                Rollback & Undo History
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Every file move is logged. You can revert any organization run back to its original state.
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500 flex flex-col items-center">
              <Clock className="w-8 h-8 text-neutral-600 mb-2" />
              <span className="font-medium text-neutral-300">No past organization runs</span>
              <span>When you declutter a folder, its history will appear here for 1-click restore.</span>
            </div>
          ) : (
            history.map(record => {
              const isExpanded = expandedId === record.id;
              const dateStr = new Date(record.timestamp).toLocaleString();

              return (
                <div
                  key={record.id}
                  className="rounded-xl border border-white/10 bg-neutral-950/40 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 bg-white/[0.02]">
                    <div
                      className="flex items-center space-x-3 cursor-pointer select-none flex-1 overflow-hidden"
                      onClick={() => setExpandedId(isExpanded ? null : record.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                      )}
                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-neutral-200">
                            {record.count} files moved
                          </span>
                          <span className="text-[10px] text-neutral-500">• {dateStr}</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono truncate mt-0.5">
                          {record.sourceDirectory}
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={isUndoing}
                      onClick={() => onUndo(record.id)}
                      className="ml-4 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-medium border border-white/10 transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${isUndoing ? 'animate-spin' : ''}`} />
                      <span>Revert</span>
                    </button>
                  </div>

                  {/* Expanded file list */}
                  {isExpanded && (
                    <div className="p-4 border-t border-white/5 bg-black/20 text-xs space-y-2 max-h-60 overflow-y-auto">
                      <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Files in this session:
                      </div>
                      {record.items.map((item, idx) => {
                        const fileName = item.movedPath.split(/[\\/]/).pop();
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-1 text-neutral-400 font-mono text-[11px]"
                          >
                            <span className="truncate text-neutral-200 mr-2">{fileName}</span>
                            <span className="text-neutral-500 text-[10px] truncate max-w-[200px]">
                              ← {item.originalPath}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-white/5 bg-neutral-950/80">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
