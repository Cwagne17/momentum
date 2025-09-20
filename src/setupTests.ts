// Jest setup file for testing configuration
// Add any global test setup here

// Mock Electron APIs for testing
Object.defineProperty(window, 'electronAPI', {
    value: {
        createPortfolio: jest.fn(),
        openPortfolio: jest.fn(),
        savePortfolio: jest.fn(),
        selectFolder: jest.fn(),
        selectFile: jest.fn(),
        exportData: jest.fn(),
        getRecentPortfolios: jest.fn(),
        addRecentPortfolio: jest.fn(),
    },
    writable: true,
});

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};