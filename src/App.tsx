import React, { useState, useEffect, useCallback } from 'react';
import { TitleBar } from './components/TitleBar';
import { Sidebar } from './components/Sidebar';
import { FolderPicker } from './components/FolderPicker';
import { StatsOverview } from './components/StatsOverview';
import { PreviewPlanModal } from './components/PreviewPlanModal';
import { TopicRuleEditor } from './components/TopicRuleEditor';
import { UndoHistoryModal } from './components/UndoHistoryModal';
import { SettingsModal } from './components/SettingsModal';

import { FileItem, TopicRule, AppPreferences, OrganizationPlan, UndoRecord } from './types';
import { DEFAULT_RULES, DEFAULT_PREFERENCES } from './services/defaultRules';
import { generatePlan } from './services/organizerEngine';
import { Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [systemFolders, setSystemFolders] = useState<{
    desktop: string;
    downloads: string;
    documents: string;
    home: string;
  } | null>(null);

  const [rules, setRules] = useState<TopicRule[]>(DEFAULT_RULES);
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [rawFiles, setRawFiles] = useState<FileItem[]>([]);
  const [plan, setPlan] = useState<OrganizationPlan | null>(null);
  const [undoHistory, setUndoHistory] = useState<UndoRecord[]>([]);

  const [isScanning, setIsScanning] = useState(false);
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);

  const [activeModal, setActiveModal] = useState<'preview' | 'rules' | 'history' | 'settings' | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Initialize environment and system paths
  useEffect(() => {
    const init = async () => {
      if (window.electronAPI) {
        try {
          const sysFolders = await window.electronAPI.getSystemFolders();
          setSystemFolders(sysFolders);
          if (sysFolders?.desktop) {
            setCurrentPath(sysFolders.desktop);
          }

          const savedRules = await window.electronAPI.loadRules();
          if (savedRules && savedRules.length > 0) {
            setRules(savedRules);
          }

          const history = await window.electronAPI.getUndoHistory();
          setUndoHistory(history);
        } catch (e) {
          console.error('Error initializing Electron API:', e);
        }
      } else {
        // Web browser demo fallback
        const mockFolders = {
          desktop: 'C:/Users/User/Desktop',
          downloads: 'C:/Users/User/Downloads',
          documents: 'C:/Users/User/Documents',
          home: 'C:/Users/User',
        };
        setSystemFolders(mockFolders);
        setCurrentPath(mockFolders.desktop);

        // Generate mock messy files for browser preview
        const mockFiles: FileItem[] = [
          { name: 'Invoice_2024_03.pdf', path: 'C:/Users/User/Desktop/Invoice_2024_03.pdf', extension: '.pdf', size: 245000, createdAt: Date.now() - 86400000, modifiedAt: Date.now() - 86400000, isDirectory: false, category: 'Documents' },
          { name: 'Q3_Financial_Statement.xlsx', path: 'C:/Users/User/Desktop/Q3_Financial_Statement.xlsx', extension: '.xlsx', size: 1250000, createdAt: Date.now() - 40000000, modifiedAt: Date.now() - 40000000, isDirectory: false, category: 'Spreadsheets' },
          { name: 'Thesis_Final_Draft_v2.docx', path: 'C:/Users/User/Desktop/Thesis_Final_Draft_v2.docx', extension: '.docx', size: 5400000, createdAt: Date.now() - 100000000, modifiedAt: Date.now() - 100000000, isDirectory: false, category: 'Documents' },
          { name: 'Thesis_Research_Notes.pdf', path: 'C:/Users/User/Desktop/Thesis_Research_Notes.pdf', extension: '.pdf', size: 890000, createdAt: Date.now() - 90000000, modifiedAt: Date.now() - 90000000, isDirectory: false, category: 'Documents' },
          { name: 'Screen Shot 2024-11-09 at 10.30.png', path: 'C:/Users/User/Desktop/Screen Shot 2024-11-09 at 10.30.png', extension: '.png', size: 3200000, createdAt: Date.now() - 20000000, modifiedAt: Date.now() - 20000000, isDirectory: false, category: 'Images' },
          { name: 'VSCode_Setup_x64.exe', path: 'C:/Users/User/Desktop/VSCode_Setup_x64.exe', extension: '.exe', size: 95000000, createdAt: Date.now() - 5000000, modifiedAt: Date.now() - 5000000, isDirectory: false, category: 'Applications' },
          { name: 'Client_Alpha_Contract.pdf', path: 'C:/Users/User/Desktop/Client_Alpha_Contract.pdf', extension: '.pdf', size: 450000, createdAt: Date.now() - 30000000, modifiedAt: Date.now() - 30000000, isDirectory: false, category: 'Documents' },
          { name: 'Client_Alpha_Wireframes.fig', path: 'C:/Users/User/Desktop/Client_Alpha_Wireframes.fig', extension: '.fig', size: 12000000, createdAt: Date.now() - 25000000, modifiedAt: Date.now() - 25000000, isDirectory: false, category: 'Design' },
          { name: 'temp_download.crdownload', path: 'C:/Users/User/Desktop/temp_download.crdownload', extension: '.crdownload', size: 1024, createdAt: Date.now() - 10000, modifiedAt: Date.now() - 10000, isDirectory: false, category: 'Junk' },
        ];
        setRawFiles(mockFiles);
      }
    };
    init();
  }, []);

  // Scan folder whenever currentPath changes
  const scanCurrentDirectory = useCallback(async (targetPath?: string) => {
    const path = targetPath || currentPath;
    if (!path) return;

    setIsScanning(true);
    try {
      if (window.electronAPI) {
        const files = await window.electronAPI.scanFolder(path, preferences);
        setRawFiles(files);
      }
    } catch (err) {
      console.error('Scan failed:', err);
      showToast('Failed to scan directory', 'error');
    } finally {
      setIsScanning(false);
    }
  }, [currentPath, preferences]);

  useEffect(() => {
    if (currentPath && window.electronAPI) {
      scanCurrentDirectory(currentPath);
    }
  }, [currentPath]);

  // Recalculate plan whenever files, rules, or preferences change
  useEffect(() => {
    if (!currentPath) {
      setPlan(null);
      return;
    }
    const newPlan = generatePlan(rawFiles, rules, preferences, currentPath);
    setPlan(newPlan);
  }, [rawFiles, rules, preferences, currentPath]);

  // Actions
  const handleBrowseFolder = async () => {
    if (window.electronAPI) {
      const selected = await window.electronAPI.selectFolder();
      if (selected) {
        setCurrentPath(selected);
      }
    } else {
      showToast('Folder dialog is available in the desktop application mode', 'info');
    }
  };

  const handleOpenFolder = async () => {
    if (currentPath && window.electronAPI) {
      await window.electronAPI.openFolderInExplorer(currentPath);
    } else {
      showToast(`Simulated opening: ${currentPath}`, 'info');
    }
  };

  const handleExecutePlan = async (finalPlan: OrganizationPlan) => {
    setIsOrganizing(true);
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.executePlan(finalPlan);
        if (result.success) {
          showToast(`Successfully organized ${result.movedCount} files!`, 'success');
          // Reload history and rescan
          const history = await window.electronAPI.getUndoHistory();
          setUndoHistory(history);
          await scanCurrentDirectory();
          setActiveModal(null);
        } else {
          showToast(`Completed with warnings: ${result.errors.join(', ')}`, 'error');
          await scanCurrentDirectory();
        }
      } else {
        // Web simulation
        showToast(`[Demo Mode] Simulated move of ${finalPlan.actions.filter(a => a.selected).length} files!`, 'success');
        setActiveModal(null);
      }
    } catch (err: any) {
      showToast(`Error organizing files: ${err.message}`, 'error');
    } finally {
      setIsOrganizing(false);
    }
  };

  const handleUndo = async (recordId: string) => {
    setIsUndoing(true);
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.undoLast(recordId);
        if (result.success) {
          showToast(`Restored ${result.restoredCount} files to their original location!`, 'success');
          const history = await window.electronAPI.getUndoHistory();
          setUndoHistory(history);
          await scanCurrentDirectory();
        } else {
          showToast(`Could not undo: ${result.errors.join(', ')}`, 'error');
        }
      } else {
        showToast('[Demo Mode] Reverted simulated run', 'success');
        setUndoHistory(prev => prev.filter(r => r.id !== recordId));
      }
    } catch (err: any) {
      showToast(`Undo error: ${err.message}`, 'error');
    } finally {
      setIsUndoing(false);
    }
  };

  const handleSaveRules = async (updatedRules: TopicRule[]) => {
    setRules(updatedRules);
    if (window.electronAPI) {
      await window.electronAPI.saveRules(updatedRules);
    }
    showToast('Classification rules saved', 'success');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`${theme === 'dark' ? 'dark' : 'light'} h-screen w-screen flex flex-col bg-[#09090b] select-none overflow-hidden text-neutral-100 font-sans`}>
      {/* Windows Frameless Matte Title Bar */}
      <TitleBar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenRules={() => setActiveModal('rules')}
        onOpenHistory={() => setActiveModal('history')}
        onOpenSettings={() => setActiveModal('settings')}
        undoCount={undoHistory.length}
      />

      {/* Main Body Area: Matte Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Matte Sidebar */}
        <Sidebar
          currentPath={currentPath}
          systemFolders={systemFolders}
          onSelectPath={path => setCurrentPath(path)}
          onBrowseFolder={handleBrowseFolder}
          preferences={preferences}
          onUpdatePreferences={updates => setPreferences(prev => ({ ...prev, ...updates }))}
          isOrganizing={isOrganizing}
        />

        {/* Right Main Content Pane */}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto bg-[#09090b] relative">
          <div className="max-w-5xl w-full mx-auto space-y-5">
            {/* Target Folder Header Banner */}
            <FolderPicker
              currentPath={currentPath}
              onBrowse={handleBrowseFolder}
              onScan={() => scanCurrentDirectory()}
              onOpenFolder={handleOpenFolder}
              isScanning={isScanning}
              systemFolders={systemFolders}
              onSelectPath={path => setCurrentPath(path)}
            />

            {/* Metric Statistics & Categorization Cards */}
            {currentPath && (
              <StatsOverview
                plan={plan}
                rawFileCount={rawFiles.length}
                onPreviewPlan={() => setActiveModal('preview')}
                isOrganizing={isOrganizing}
              />
            )}
          </div>

          {/* Toast Notification */}
          {toast && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-2.5 rounded-lg bg-[#14141a] border border-white/10 shadow-2xl text-xs animate-slideUp">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
              <span className="font-medium text-neutral-200">{toast.message}</span>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {plan && (
        <PreviewPlanModal
          plan={plan}
          isOpen={activeModal === 'preview'}
          onClose={() => setActiveModal(null)}
          onExecute={handleExecutePlan}
          isExecuting={isOrganizing}
        />
      )}

      <TopicRuleEditor
        rules={rules}
        isOpen={activeModal === 'rules'}
        onClose={() => setActiveModal(null)}
        onSaveRules={handleSaveRules}
      />

      <UndoHistoryModal
        history={undoHistory}
        isOpen={activeModal === 'history'}
        onClose={() => setActiveModal(null)}
        onUndo={handleUndo}
        isUndoing={isUndoing}
      />

      <SettingsModal
        preferences={preferences}
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        onSavePreferences={updated => setPreferences(updated)}
      />
    </div>
  );
};

export default App;
