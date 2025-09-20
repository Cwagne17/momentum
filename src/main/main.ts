import { app, BrowserWindow, Menu } from 'electron';
import { dialog, ipcMain } from 'electron/main';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ExportResult, PortfolioCreateResult, PortfolioOpenResult, PortfolioSaveResult } from '../shared/types';
import { PortfolioManager } from './services/portfolio-manager';

// Keep a global reference of the window object
let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';

// Initialize portfolio manager
const portfolioManager = new PortfolioManager();

function createWindow(): void {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'default',
    show: false, // Don't show until ready-to-show
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // On macOS, re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url: _url }) => {
    // Prevent opening new windows
    return { action: 'deny' };
  });
});

// Create application menu
const template: Electron.MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Portfolio',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          // TODO: Implement new portfolio creation
        },
      },
      {
        label: 'Open Portfolio',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          // TODO: Implement portfolio opening
        },
      },
      { type: 'separator' },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          // TODO: Implement save functionality
        },
      },
      { type: 'separator' },
      {
        role: 'quit',
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    label: 'Window',
    submenu: [{ role: 'minimize' }, { role: 'close' }],
  },
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  });
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// IPC Handlers for portfolio operations
setupIpcHandlers();

/**
 * Sets up IPC handlers for communication with the renderer process
 */
function setupIpcHandlers(): void {
  // Portfolio creation
  ipcMain.handle('portfolio:create', async (event, folderPath: string, portfolioName: string): Promise<PortfolioCreateResult> => {
    try {
      const portfolio = await portfolioManager.createPortfolio(folderPath, portfolioName);
      await portfolioManager.addRecentPortfolio(folderPath);

      return {
        success: true,
        filePath: path.join(folderPath, 'portfolio.json')
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PORTFOLIO_CREATE_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error instanceof Error ? error.stack : undefined
        }
      };
    }
  });

  // Portfolio opening
  ipcMain.handle('portfolio:open', async (event, folderPath: string): Promise<PortfolioOpenResult> => {
    try {
      const portfolio = await portfolioManager.openPortfolio(folderPath);
      await portfolioManager.addRecentPortfolio(folderPath);

      return {
        success: true,
        data: portfolio
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PORTFOLIO_OPEN_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error instanceof Error ? error.stack : undefined
        }
      };
    }
  });

  // Portfolio saving
  ipcMain.handle('portfolio:save', async (event, portfolioData: any): Promise<PortfolioSaveResult> => {
    try {
      await portfolioManager.savePortfolio(portfolioData);

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PORTFOLIO_SAVE_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error instanceof Error ? error.stack : undefined
        }
      };
    }
  });

  // Folder selection dialog
  ipcMain.handle('dialog:selectFolder', async (): Promise<string | null> => {
    try {
      const result = await dialog.showOpenDialog(mainWindow!, {
        properties: ['openDirectory', 'createDirectory'],
        title: 'Select Portfolio Folder'
      });

      return result.canceled ? null : result.filePaths[0];
    } catch (error) {
      console.error('Failed to show folder dialog:', error);
      return null;
    }
  });

  // File selection dialog
  ipcMain.handle('dialog:selectFile', async (event, filters?: { name: string; extensions: string[] }[]): Promise<string | null> => {
    try {
      const result = await dialog.showOpenDialog(mainWindow!, {
        properties: ['openFile'],
        title: 'Select File',
        filters: filters || [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      return result.canceled ? null : result.filePaths[0];
    } catch (error) {
      console.error('Failed to show file dialog:', error);
      return null;
    }
  });

  // Export data
  ipcMain.handle('export:data', async (event, data: any, format: 'csv' | 'json'): Promise<ExportResult> => {
    try {
      const result = await dialog.showSaveDialog(mainWindow!, {
        title: 'Export Data',
        defaultPath: `portfolio-export.${format}`,
        filters: [
          { name: format.toUpperCase() + ' Files', extensions: [format] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (result.canceled || !result.filePath) {
        return {
          success: false,
          error: {
            code: 'EXPORT_CANCELLED',
            message: 'Export was cancelled by user'
          }
        };
      }

      // TODO: Implement actual export logic based on format
      // For now, just save as JSON
      if (format === 'json') {
        await fs.writeFile(result.filePath, JSON.stringify(data, null, 2));
      } else {
        // CSV export would be implemented here
        throw new Error('CSV export not yet implemented');
      }

      return {
        success: true,
        filePath: result.filePath
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'EXPORT_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error instanceof Error ? error.stack : undefined
        }
      };
    }
  });

  // Recent portfolios
  ipcMain.handle('portfolio:getRecent', async (): Promise<string[]> => {
    try {
      return await portfolioManager.getRecentPortfolios();
    } catch (error) {
      console.error('Failed to get recent portfolios:', error);
      return [];
    }
  });

  ipcMain.handle('portfolio:addRecent', async (event, portfolioPath: string): Promise<void> => {
    try {
      await portfolioManager.addRecentPortfolio(portfolioPath);
    } catch (error) {
      console.error('Failed to add recent portfolio:', error);
    }
  });
}
