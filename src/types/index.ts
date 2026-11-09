export interface FileItem {
  name: string;
  path: string;
  extension: string;
  size: number;
  createdAt: number;
  modifiedAt: number;
  isDirectory: boolean;
  category: string;
  detectedTopic?: string;
  isJunk?: boolean;
}

export interface TopicRule {
  id: string;
  name: string;
  folderName: string;
  keywords: string[];
  extensions: string[];
  enabled: boolean;
  color: string;
  icon?: string;
  priority: number;
  matchWholeWord?: boolean;
}

export interface PlanAction {
  id: string;
  sourcePath: string;
  fileName: string;
  destinationFolder: string;
  destinationPath: string;
  reason: string;
  ruleId?: string;
  type: 'move' | 'archive' | 'delete_junk' | 'skip';
  size: number;
  selected: boolean;
}

export interface OrganizationPlan {
  id: string;
  sourceDirectory: string;
  timestamp: number;
  actions: PlanAction[];
  totalFiles: number;
  totalSize: number;
  affectedFolders: string[];
  summaryByCategory: Record<string, number>;
}

export interface UndoRecord {
  id: string;
  timestamp: number;
  sourceDirectory: string;
  items: { originalPath: string; movedPath: string }[];
  count: number;
}

export interface AppPreferences {
  theme: 'dark' | 'light' | 'system';
  conflictResolution: 'rename' | 'overwrite' | 'skip';
  organizeMode: 'topics_first' | 'category_only' | 'project_smart' | 'date_grouped';
  createSubcategories: boolean;
  ignoreHiddenFiles: boolean;
  cleanJunkFiles: boolean;
  junkExtensions: string[];
  protectedNames: string[];
}

export interface ElectronAPI {
  selectFolder: () => Promise<string | null>;
  scanFolder: (folderPath: string, options?: Partial<AppPreferences>) => Promise<FileItem[]>;
  executePlan: (plan: OrganizationPlan) => Promise<{ success: boolean; movedCount: number; errors: string[] }>;
  getUndoHistory: () => Promise<UndoRecord[]>;
  undoLast: (recordId?: string) => Promise<{ success: boolean; restoredCount: number; errors: string[] }>;
  openFolderInExplorer: (folderPath: string) => Promise<boolean>;
  getSystemFolders: () => Promise<{ desktop: string; downloads: string; documents: string; home: string }>;
  saveRules: (rules: TopicRule[]) => Promise<boolean>;
  loadRules: () => Promise<TopicRule[] | null>;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  isMaximized?: () => Promise<boolean>;
  onMaximizedChange?: (callback: (isMax: boolean) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
