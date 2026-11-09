import React from 'react';
import {
  FileText,
  HardDrive,
  FolderTree,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { OrganizationPlan } from '../types';
import { formatBytes } from '../services/organizerEngine';

interface StatsOverviewProps {
  plan: OrganizationPlan | null;
  rawFileCount: number;
  onPreviewPlan: () => void;
  isOrganizing: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  plan,
  rawFileCount,
  onPreviewPlan,
  isOrganizing,
}) => {
  if (!plan) return null;

  const totalActions = plan.actions.length;
  const junkCount = plan.actions.filter(a => a.type === 'archive' || a.reason.includes('Temporary')).length;
  const distinctFoldersCount = plan.affectedFolders.length;

  return (
    <div className="space-y-4">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-4 gap-3">
        {/* Card 1: Total files */}
        <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.07] text-neutral-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-neutral-400">Total Unsorted</span>
            <div className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
              <FileText className="w-3 h-3" />
            </div>
          </div>
          <div className="text-xl font-bold text-neutral-100 tracking-tight font-sans">
            {totalActions}
            <span className="text-xs font-normal text-neutral-500 ml-1.5">items</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">
            {rawFileCount} files found in root
          </div>
        </div>

        {/* Card 2: Size */}
        <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.07] text-neutral-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-neutral-400">Disk Footprint</span>
            <div className="w-5 h-5 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">
              <HardDrive className="w-3 h-3" />
            </div>
          </div>
          <div className="text-xl font-bold text-neutral-100 tracking-tight font-sans">
            {formatBytes(plan.totalSize)}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">
            Across unorganized files
          </div>
        </div>

        {/* Card 3: Folders targeted */}
        <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.07] text-neutral-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-neutral-400">Target Categories</span>
            <div className="w-5 h-5 rounded bg-amber-500/10 flex items-center justify-center text-amber-400">
              <FolderTree className="w-3 h-3" />
            </div>
          </div>
          <div className="text-xl font-bold text-neutral-100 tracking-tight font-sans">
            {distinctFoldersCount}
            <span className="text-xs font-normal text-neutral-500 ml-1.5">folders</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">
            Projects & topics
          </div>
        </div>

        {/* Card 4: Junk files */}
        <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.07] text-neutral-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-neutral-400">Junk / Temp Files</span>
            <div className={`w-5 h-5 rounded flex items-center justify-center ${
              junkCount > 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              {junkCount > 0 ? <Trash2 className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
            </div>
          </div>
          <div className="text-xl font-bold text-neutral-100 tracking-tight font-sans">
            {junkCount}
            <span className="text-xs font-normal text-neutral-500 ml-1.5">junk</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">
            {junkCount > 0 ? 'Ready to quarantine' : 'No leftovers detected'}
          </div>
        </div>
      </div>

      {/* Target Folders Preview Grid */}
      <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.07] text-neutral-200">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
              Proposed Organization Scheme
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Files will be mapped into the following folders according to your active rules.
            </p>
          </div>
          
          <button
            onClick={onPreviewPlan}
            disabled={isOrganizing || totalActions === 0}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow transition-all active:scale-[0.98] disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Review Plan ({totalActions} Files)</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        {totalActions === 0 ? (
          <div className="py-8 text-center text-neutral-500 text-xs flex flex-col items-center">
            <CheckCircle className="w-7 h-7 text-emerald-400 mb-2" />
            <span className="font-medium text-neutral-300">Workspace is clean!</span>
            <span>No unorganized files found in this directory.</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {plan.affectedFolders.map(folder => {
              const count = plan.actions.filter(a => a.destinationFolder === folder).length;
              return (
                <div
                  key={folder}
                  className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#17171e] border border-white/[0.06] text-xs text-neutral-300 font-mono"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span className="text-neutral-200">{folder}</span>
                  <span className="px-1.5 py-0.2 rounded bg-white/[0.08] text-[10px] text-neutral-400 font-semibold font-sans">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
