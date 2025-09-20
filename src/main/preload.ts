import type { ElectronAPI } from '@shared/types';
import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  // Portfolio operations
  createPortfolio: (folderPath: string, portfolioName: string) =>
    ipcRenderer.invoke('portfolio:create', folderPath, portfolioName),

  openPortfolio: (filePath: string) =>
    ipcRenderer.invoke('portfolio:open', filePath),

  savePortfolio: (portfolioData: any) =>
    ipcRenderer.invoke('portfolio:save', portfolioData),

  // File operations
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),

  selectFile: (filters?: Electron.FileFilter[]) =>
    ipcRenderer.invoke('dialog:selectFile', filters),

  // Export operations
  exportData: (data: any, format: 'csv' | 'json') =>
    ipcRenderer.invoke('export:data', data, format),

  // Recent portfolios
  getRecentPortfolios: () => ipcRenderer.invoke('portfolio:getRecent'),

  addRecentPortfolio: (portfolioPath: string) =>
    ipcRenderer.invoke('portfolio:addRecent', portfolioPath),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
