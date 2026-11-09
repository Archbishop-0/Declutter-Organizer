const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanFolder: (folderPath, options) => ipcRenderer.invoke('scan-folder', folderPath, options),
  executePlan: (plan) => ipcRenderer.invoke('execute-plan', plan),
  getUndoHistory: () => ipcRenderer.invoke('get-undo-history'),
  undoLast: (recordId) => ipcRenderer.invoke('undo-last', recordId),
  openFolderInExplorer: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  getSystemFolders: () => ipcRenderer.invoke('get-system-folders'),
  saveRules: (rules) => ipcRenderer.invoke('save-rules', rules),
  loadRules: () => ipcRenderer.invoke('load-rules'),
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
});
