// Electron API types for IPC communication between main and renderer processes

// Error types for better error handling
export interface ElectronError {
    code: string;
    message: string;
    details?: string;
}

// Result types for API responses
export interface PortfolioCreateResult {
    success: boolean;
    filePath?: string;
    error?: ElectronError;
}

export interface PortfolioOpenResult {
    success: boolean;
    data?: any; // Will be typed properly when data models are implemented
    error?: ElectronError;
}

export interface PortfolioSaveResult {
    success: boolean;
    error?: ElectronError;
}

export interface ExportResult {
    success: boolean;
    filePath?: string;
    error?: ElectronError;
}

export interface ElectronAPI {
    // Portfolio operations
    createPortfolio: (folderPath: string, portfolioName: string) => Promise<PortfolioCreateResult>;

    openPortfolio: (filePath: string) => Promise<PortfolioOpenResult>;

    savePortfolio: (portfolioData: any) => Promise<PortfolioSaveResult>;

    // File dialog operations
    selectFolder: () => Promise<string | null>;

    selectFile: (filters?: Electron.FileFilter[]) => Promise<string | null>;

    // Export operations
    exportData: (data: any, format: 'csv' | 'json') => Promise<ExportResult>;

    // Recent portfolios management
    getRecentPortfolios: () => Promise<string[]>;

    addRecentPortfolio: (portfolioPath: string) => Promise<void>;
}

// Global window type extension
declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}