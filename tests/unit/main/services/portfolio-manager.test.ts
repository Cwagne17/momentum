/**
 * Unit tests for PortfolioManager
 */

import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { BackupManager } from '../../../../src/main/services/backup-manager';
import { FileSystemHandler } from '../../../../src/main/services/file-system-handler';
import { PortfolioManager } from '../../../../src/main/services/portfolio-manager';
import { SchemaValidator } from '../../../../src/main/services/schema-validator';
import { ApiVersion, DocumentKind } from '../../../../src/shared/types';

// Mock the dependencies
jest.mock('../../../../src/main/services/file-system-handler');
jest.mock('../../../../src/main/services/schema-validator');
jest.mock('../../../../src/main/services/backup-manager');

describe('PortfolioManager', () => {
    let portfolioManager: PortfolioManager;
    let mockFileSystemHandler: jest.Mocked<FileSystemHandler>;
    let mockSchemaValidator: jest.Mocked<SchemaValidator>;
    let mockBackupManager: jest.Mocked<BackupManager>;
    let tempDir: string;

    beforeEach(async () => {
        // Create a temporary directory for testing
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'momentum-test-'));

        // Clear all mocks
        jest.clearAllMocks();

        // Create mocked instances
        mockFileSystemHandler = {
            validateFolderPath: jest.fn(),
            createPortfolioStructure: jest.fn(),
            writeJsonFile: jest.fn(),
            readJsonFile: jest.fn(),
            getRecentPortfolios: jest.fn(),
            addRecentPortfolio: jest.fn(),
        } as any;

        mockSchemaValidator = {
            validatePortfolio: jest.fn(),
            validateAndMigratePortfolio: jest.fn(),
        } as any;

        mockBackupManager = {
            createBackup: jest.fn(),
        } as any;

        // Setup default mock implementations
        mockFileSystemHandler.validateFolderPath.mockResolvedValue();
        mockFileSystemHandler.createPortfolioStructure.mockResolvedValue();
        mockFileSystemHandler.writeJsonFile.mockResolvedValue();
        mockFileSystemHandler.readJsonFile.mockResolvedValue({});
        mockFileSystemHandler.getRecentPortfolios.mockResolvedValue([]);
        mockFileSystemHandler.addRecentPortfolio.mockResolvedValue();

        mockSchemaValidator.validatePortfolio.mockImplementation((data) => data);
        mockSchemaValidator.validateAndMigratePortfolio.mockImplementation((data) => Promise.resolve(data));

        mockBackupManager.createBackup.mockResolvedValue(path.join(tempDir, 'backup'));

        // Create portfolio manager with mocked dependencies
        portfolioManager = new PortfolioManager();
        (portfolioManager as any).fileSystemHandler = mockFileSystemHandler;
        (portfolioManager as any).schemaValidator = mockSchemaValidator;
        (portfolioManager as any).backupManager = mockBackupManager;
    });

    afterEach(async () => {
        // Clean up temporary directory
        try {
            await fs.rm(tempDir, { recursive: true, force: true });
        } catch {
            // Ignore cleanup errors
        }
    });

    describe('createPortfolio', () => {
        it('should create a new portfolio successfully', async () => {
            const folderPath = path.join(tempDir, 'test-portfolio');
            const portfolioName = 'Test Portfolio';

            const result = await portfolioManager.createPortfolio(folderPath, portfolioName);

            expect(result).toMatchObject({
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Portfolio,
                metadata: {
                    name: portfolioName,
                    version: 1,
                },
                spec: {
                    name: portfolioName,
                    folderPath,
                    currency: 'USD',
                },
            });

            expect(mockFileSystemHandler.validateFolderPath).toHaveBeenCalledWith(folderPath);
            expect(mockFileSystemHandler.createPortfolioStructure).toHaveBeenCalledWith(folderPath);
            expect(mockSchemaValidator.validatePortfolio).toHaveBeenCalled();
            expect(mockFileSystemHandler.writeJsonFile).toHaveBeenCalledTimes(3); // portfolio.json, assets.json, liabilities.json
        });

        it('should throw error if folder validation fails', async () => {
            const folderPath = '/invalid/path';
            const portfolioName = 'Test Portfolio';

            mockFileSystemHandler.validateFolderPath.mockRejectedValue(new Error('Folder does not exist'));

            await expect(portfolioManager.createPortfolio(folderPath, portfolioName))
                .rejects.toThrow('Failed to create portfolio: Folder does not exist');
        });

        it('should throw error if schema validation fails', async () => {
            const folderPath = path.join(tempDir, 'test-portfolio');
            const portfolioName = 'Test Portfolio';

            mockSchemaValidator.validatePortfolio.mockImplementation(() => {
                throw new Error('Invalid schema');
            });

            await expect(portfolioManager.createPortfolio(folderPath, portfolioName))
                .rejects.toThrow('Failed to create portfolio: Invalid schema');
        });
    });

    describe('openPortfolio', () => {
        it('should open an existing portfolio successfully', async () => {
            const folderPath = path.join(tempDir, 'existing-portfolio');
            const mockPortfolio = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Portfolio,
                metadata: {
                    name: 'Existing Portfolio',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    name: 'Existing Portfolio',
                    folderPath,
                    currency: 'USD' as const,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    lastModified: '2024-01-01T00:00:00.000Z',
                },
            };

            mockFileSystemHandler.readJsonFile.mockResolvedValue(mockPortfolio);
            mockSchemaValidator.validateAndMigratePortfolio.mockResolvedValue(mockPortfolio);

            const result = await portfolioManager.openPortfolio(folderPath);

            expect(result).toMatchObject({
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Portfolio,
                spec: {
                    name: 'Existing Portfolio',
                    folderPath,
                },
            });

            expect(mockFileSystemHandler.validateFolderPath).toHaveBeenCalledWith(folderPath);
            expect(mockFileSystemHandler.readJsonFile).toHaveBeenCalledWith(
                path.join(folderPath, 'portfolio.json')
            );
            expect(mockSchemaValidator.validateAndMigratePortfolio).toHaveBeenCalledWith(mockPortfolio);
        });

        it('should throw error if portfolio file does not exist', async () => {
            const folderPath = path.join(tempDir, 'nonexistent-portfolio');

            mockFileSystemHandler.readJsonFile.mockRejectedValue(new Error('File not found'));

            await expect(portfolioManager.openPortfolio(folderPath))
                .rejects.toThrow('Failed to open portfolio: File not found');
        });
    });

    describe('savePortfolio', () => {
        it('should save portfolio with backup creation', async () => {
            const mockPortfolio = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Portfolio,
                metadata: {
                    name: 'Test Portfolio',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    name: 'Test Portfolio',
                    folderPath: tempDir,
                    currency: 'USD' as const,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    lastModified: '2024-01-01T00:00:00.000Z',
                },
            };

            await portfolioManager.savePortfolio(mockPortfolio);

            expect(mockSchemaValidator.validatePortfolio).toHaveBeenCalledWith(mockPortfolio);
            expect(mockBackupManager.createBackup).toHaveBeenCalledWith(tempDir);
            expect(mockFileSystemHandler.writeJsonFile).toHaveBeenCalledWith(
                path.join(tempDir, 'portfolio.json'),
                expect.objectContaining({
                    metadata: expect.objectContaining({
                        version: 2, // Should increment version
                    }),
                })
            );
        });

        it('should throw error if validation fails', async () => {
            const mockPortfolio = { invalid: 'data' };

            mockSchemaValidator.validatePortfolio.mockImplementation(() => {
                throw new Error('Invalid portfolio');
            });

            await expect(portfolioManager.savePortfolio(mockPortfolio as any))
                .rejects.toThrow('Failed to save portfolio: Invalid portfolio');
        });
    });

    describe('getRecentPortfolios', () => {
        it('should return recent portfolios list', async () => {
            const recentPaths = ['/path/to/portfolio1', '/path/to/portfolio2'];
            mockFileSystemHandler.getRecentPortfolios.mockResolvedValue(recentPaths);

            const result = await portfolioManager.getRecentPortfolios();

            expect(result).toEqual(recentPaths);
            expect(mockFileSystemHandler.getRecentPortfolios).toHaveBeenCalled();
        });

        it('should return empty array if getting recent portfolios fails', async () => {
            mockFileSystemHandler.getRecentPortfolios.mockRejectedValue(new Error('File not found'));

            const result = await portfolioManager.getRecentPortfolios();

            expect(result).toEqual([]);
        });
    });

    describe('addRecentPortfolio', () => {
        it('should add portfolio to recent list', async () => {
            const portfolioPath = '/path/to/portfolio';

            await portfolioManager.addRecentPortfolio(portfolioPath);

            expect(mockFileSystemHandler.addRecentPortfolio).toHaveBeenCalledWith(portfolioPath);
        });

        it('should not throw if adding recent portfolio fails', async () => {
            const portfolioPath = '/path/to/portfolio';
            mockFileSystemHandler.addRecentPortfolio.mockRejectedValue(new Error('Write failed'));

            // Should not throw
            await expect(portfolioManager.addRecentPortfolio(portfolioPath)).resolves.toBeUndefined();
        });
    });

    describe('validatePortfolioFolder', () => {
        it('should return true for valid portfolio folder', async () => {
            const folderPath = path.join(tempDir, 'valid-portfolio');
            const mockPortfolio = { apiVersion: ApiVersion.V1, kind: DocumentKind.Portfolio };

            mockFileSystemHandler.readJsonFile.mockResolvedValue(mockPortfolio);
            mockSchemaValidator.validatePortfolio.mockReturnValue(mockPortfolio as any);

            const result = await portfolioManager.validatePortfolioFolder(folderPath);

            expect(result).toBe(true);
        });

        it('should return false for invalid portfolio folder', async () => {
            const folderPath = path.join(tempDir, 'invalid-portfolio');

            mockFileSystemHandler.readJsonFile.mockRejectedValue(new Error('File not found'));

            const result = await portfolioManager.validatePortfolioFolder(folderPath);

            expect(result).toBe(false);
        });
    });
});