const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 740,
    minWidth: 860,
    minHeight: 580,
    title: 'Declutter',
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#09090b',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/icon.png'),
    show: false,
  });

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window-maximized-state', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window-maximized-state', false);
  });

  const isDev = process.env.NODE_ENV === 'development';
  const distPath = path.join(__dirname, '../dist/index.html');

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else if (fs.existsSync(distPath)) {
    mainWindow.loadFile(distPath);
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Window controls
ipcMain.handle('get-maximized-state', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

// Dialogs & Folder operations
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory'],
    title: 'Select Folder to Organize',
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0];
});

ipcMain.handle('get-system-folders', () => {
  return {
    desktop: app.getPath('desktop'),
    downloads: app.getPath('downloads'),
    documents: app.getPath('documents'),
    home: app.getPath('home'),
  };
});

ipcMain.handle('open-folder', async (_, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) return false;
  await shell.openPath(folderPath);
  return true;
});

// File scanning
ipcMain.handle('scan-folder', async (_, folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) return [];

  const files = [];
  try {
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(folderPath, entry.name);
      try {
        const stats = fs.statSync(fullPath);
        const ext = path.extname(entry.name);
        files.push({
          name: entry.name,
          path: fullPath,
          extension: ext,
          size: stats.size,
          createdAt: stats.birthtimeMs || stats.ctimeMs,
          modifiedAt: stats.mtimeMs,
          isDirectory: entry.isDirectory(),
          category: 'Uncategorized',
        });
      } catch (e) {
        console.warn(`Could not stat file: ${fullPath}`, e);
      }
    }
  } catch (err) {
    console.error('Error scanning directory:', err);
  }

  return files;
});

// Rule storage
function getRulesFilePath() {
  return path.join(app.getPath('userData'), 'declutter-rules.json');
}

ipcMain.handle('save-rules', async (_, rules) => {
  try {
    fs.writeFileSync(getRulesFilePath(), JSON.stringify(rules, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving rules:', err);
    return false;
  }
});

ipcMain.handle('load-rules', async () => {
  try {
    const p = getRulesFilePath();
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading rules file:', err);
  }
  return null;
});

// Undo history storage
function getHistoryFilePath() {
  return path.join(app.getPath('userData'), 'declutter-history.json');
}

function loadHistory() {
  try {
    const p = getHistoryFilePath();
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading history:', e);
  }
  return [];
}

function saveHistory(history) {
  try {
    fs.writeFileSync(getHistoryFilePath(), JSON.stringify(history.slice(0, 50), null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving history:', e);
  }
}

ipcMain.handle('get-undo-history', async () => {
  return loadHistory();
});

// Execute plan
ipcMain.handle('execute-plan', async (_, plan) => {
  const errors = [];
  const successfulMoves = [];

  for (const action of plan.actions) {
    if (!action.selected || action.type === 'skip') continue;

    try {
      if (!fs.existsSync(action.sourcePath)) {
        errors.push(`File missing: ${action.sourcePath}`);
        continue;
      }

      const targetDir = path.dirname(action.destinationPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Handle collision
      let finalDestPath = action.destinationPath;
      if (fs.existsSync(finalDestPath) && finalDestPath.toLowerCase() !== action.sourcePath.toLowerCase()) {
        const ext = path.extname(finalDestPath);
        const base = path.basename(finalDestPath, ext);
        let counter = 1;
        while (fs.existsSync(path.join(targetDir, `${base} (${counter})${ext}`))) {
          counter++;
        }
        finalDestPath = path.join(targetDir, `${base} (${counter})${ext}`);
      }

      fs.renameSync(action.sourcePath, finalDestPath);
      successfulMoves.push({
        originalPath: action.sourcePath,
        movedPath: finalDestPath,
      });
    } catch (err) {
      console.error(`Failed to move ${action.sourcePath}:`, err);
      errors.push(`Error moving ${action.fileName}: ${err.message}`);
    }
  }

  if (successfulMoves.length > 0) {
    const history = loadHistory();
    const record = {
      id: `history-${Date.now()}`,
      timestamp: Date.now(),
      sourceDirectory: plan.sourceDirectory,
      items: successfulMoves,
      count: successfulMoves.length,
    };
    history.unshift(record);
    saveHistory(history);
  }

  return {
    success: errors.length === 0,
    movedCount: successfulMoves.length,
    errors,
  };
});

// Undo action
ipcMain.handle('undo-last', async (_, recordId) => {
  const history = loadHistory();
  if (history.length === 0) {
    return { success: false, restoredCount: 0, errors: ['No actions to undo'] };
  }

  const recordIndex = recordId ? history.findIndex(r => r.id === recordId) : 0;
  if (recordIndex === -1) {
    return { success: false, restoredCount: 0, errors: ['Record not found'] };
  }

  const record = history[recordIndex];
  const errors = [];
  let restoredCount = 0;

  // Restore each item in reverse order
  for (const item of [...record.items].reverse()) {
    try {
      if (fs.existsSync(item.movedPath)) {
        const origDir = path.dirname(item.originalPath);
        if (!fs.existsSync(origDir)) {
          fs.mkdirSync(origDir, { recursive: true });
        }
        fs.renameSync(item.movedPath, item.originalPath);
        restoredCount++;

        // Try to remove empty directory if it's now empty
        const movedDir = path.dirname(item.movedPath);
        try {
          if (fs.existsSync(movedDir) && fs.readdirSync(movedDir).length === 0) {
            fs.rmdirSync(movedDir);
          }
        } catch {
          // ignore non-empty or permissions
        }
      } else {
        errors.push(`File missing at moved location: ${item.movedPath}`);
      }
    } catch (err) {
      errors.push(`Failed to restore ${path.basename(item.movedPath)}: ${err.message}`);
    }
  }

  // Remove undone record
  history.splice(recordIndex, 1);
  saveHistory(history);

  return {
    success: errors.length === 0,
    restoredCount,
    errors,
  };
});
