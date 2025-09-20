/**
 * Portfolio Manager for handling portfolio creation, opening, and saving operations
 * This service runs in the Electron main process and handles all file system operations
 */

import * as path from 'path';
import { ApiVersion, DocumentKind, Portfolio } from '../../shared/types';
import { getCurrentISOString } from '../../shared/utils';
import { BackupManager } from './backup-manager';
import { FileSystemHandler } from './file-system-handler';
import { SchemaValidator } from './schema-validator';

export class PortfolioManager {
    private readonly fileSystemHandler: FileSystemHandler;
    private readonly schemaValidator: SchemaValidator;
    private readonly backupManager: BackupManager;

    constructor() {
        this.fileSystemHandler = new FileSystemHandler();
        this.schemaValidator = new SchemaValidator();
        this.backupManager = new BackupManager();
    }

    /**
     * Creates a new portfolio in the specified folder
     */
    async createPortfolio(folderPath: string, portfolioName: string): Promise<Portfolio> {
        try {
            // Validate folder path exists and is writable
            await this.fileSystemHandler.validateFolderPath(folderPath);

            // Create portfolio structure
            await this.fileSystemHandler.createPortfolioStructure(folderPath);

            // Create portfolio document
            const now = getCurrentISOString();
            const portfolio: Portfolio = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Portfolio,
                metadata: {
                    name: portfolioName,
                    createdAt: now,
                    updatedAt: now,
                    version: 1,
                },
                spec: {
                    name: portfolioName,
                    folderPath,
                    currency: "USD",
                    createdAt: now,
                    lastModified: now,
                },
            };

            // Validate portfolio schema
            this.schemaValidator.validatePortfolio(portfolio);

            // Save portfolio file
            const portfolioFilePath = path.join(folderPath, 'portfolio.json');
            await this.fileSystemHandler.writeJsonFile(portfolioFilePath, portfolio);

            // Create initial empty assets and liabilities files
            await this.fileSystemHandler.writeJsonFile(
                path.join(folderPath, 'assets.json'),
                { assets: [] }
            );
            await this.fileSystemHandler.writeJsonFile(
                path.join(folderPath, 'liabilities.json'),
                { liabilities: [] }
            );

            return portfolio;
        } catch (error) {
            throw new Error(`Failed to create portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Opens an existing portfolio from the specified folder
     */
    async openPortfolio(folderPath: string): Promise<Portfolio> {
        try {
            // Validate folder exists
            await this.fileSystemHandler.validateFolderPath(folderPath);

            // Load portfolio file
            const portfolioFilePath = path.join(folderPath, 'portfolio.json');
            const portfolioData = await this.fileSystemHandler.readJsonFile(portfolioFilePath);

            // Validate and migrate schema if needed
            const portfolio = await this.schemaValidator.validateAndMigratePortfolio(portfolioData);

            // Update last modified timestamp
            portfolio.spec.lastModified = getCurrentISOString();
            portfolio.metadata.updatedAt = getCurrentISOString();
            portfolio.metadata.version += 1;

            // Save updated portfolio
            await this.fileSystemHandler.writeJsonFile(portfolioFilePath, portfolio);

            return portfolio;
        } catch (error) {
            throw new Error(`Failed to open portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Saves portfolio data with automatic backup creation
     */
    async savePortfolio(portfolio: Portfolio): Promise<void> {
        try {
            // Validate portfolio schema
            this.schemaValidator.validatePortfolio(portfolio);

            // Create backup before saving
            await this.backupManager.createBackup(portfolio.spec.folderPath);

            // Update timestamps
            portfolio.spec.lastModified = getCurrentISOString();
            portfolio.metadata.updatedAt = getCurrentISOString();
            portfolio.metadata.version += 1;

            // Save portfolio file
            const portfolioFilePath = path.join(portfolio.spec.folderPath, 'portfolio.json');
            await this.fileSystemHandler.writeJsonFile(portfolioFilePath, portfolio);

        } catch (error) {
            throw new Error(`Failed to save portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Gets the list of recent portfolios from user preferences
     */
    async getRecentPortfolios(): Promise<string[]> {
        try {
            return await this.fileSystemHandler.getRecentPortfolios();
        } catch (error) {
            // Return empty array if preferences file doesn't exist or is corrupted
            return [];
        }
    }

    /**
     * Adds a portfolio to the recent portfolios list
     */
    async addRecentPortfolio(portfolioPath: string): Promise<void> {
        try {
            await this.fileSystemHandler.addRecentPortfolio(portfolioPath);
        } catch (error) {
            // Silently fail for recent portfolios - not critical functionality
            console.warn('Failed to add recent portfolio:', error);
        }
    }

    /**
     * Validates that a folder contains a valid portfolio
     */
    async validatePortfolioFolder(folderPath: string): Promise<boolean> {
        try {
            const portfolioFilePath = path.join(folderPath, 'portfolio.json');
            const portfolioData = await this.fileSystemHandler.readJsonFile(portfolioFilePath);
            this.schemaValidator.validatePortfolio(portfolioData);
            return true;
        } catch {
            return false;
        }
    }
}