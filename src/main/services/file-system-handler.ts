/**
 * File System Handler for all file operations in the main process
 * Handles reading, writing, and validation of files with proper error handling
 */

import { app } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';

export class FileSystemHandler {
    private readonly preferencesPath: string;

    constructor() {
        // Store preferences in the user data directory
        this.preferencesPath = path.join(app.getPath('userData'), 'preferences.json');
    }

    /**
     * Validates that a folder path exists and is writable
     */
    async validateFolderPath(folderPath: string): Promise<void> {
        try {
            const stats = await fs.stat(folderPath);
            if (!stats.isDirectory()) {
                throw new Error('Path is not a directory');
            }

            // Test write permissions by creating a temporary file
            const testFile = path.join(folderPath, '.momentum-test');
            await fs.writeFile(testFile, 'test');
            await fs.unlink(testFile);
        } catch (error) {
            // If this is a filesystem error with a code, rethrow it to preserve the original error
            if (error && typeof (error as any).code === 'string') {
                throw error;
            }

            // Otherwise, rethrow as-is
            throw error;
        }
    }

    /**
     * Creates the portfolio folder structure
     */
    async createPortfolioStructure(folderPath: string): Promise<void> {
        try {
            // Create snapshots directory
            const snapshotsDir = path.join(folderPath, 'snapshots');
            await fs.mkdir(snapshotsDir, { recursive: true });

            // Create backups directory
            const backupsDir = path.join(folderPath, 'backups');
            await fs.mkdir(backupsDir, { recursive: true });
        } catch (error) {
            throw new Error(`Failed to create portfolio structure: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Reads and parses a JSON file
     */
    async readJsonFile(filePath: string): Promise<any> {
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new Error(`Invalid JSON format in file: ${filePath}`);
            }

            // Preserve filesystem error codes (ENOENT, EACCES, etc.) by rethrowing the original error
            if (error && typeof (error as any).code === 'string') {
                throw error;
            }

            throw error;
        }
    }

    /**
     * Writes data to a JSON file with proper formatting
     */
    async writeJsonFile(filePath: string, data: any): Promise<void> {
        try {
            // Ensure directory exists
            const dir = path.dirname(filePath);
            await fs.mkdir(dir, { recursive: true });

            // Write file with pretty formatting
            const jsonContent = JSON.stringify(data, null, 2);
            await fs.writeFile(filePath, jsonContent, 'utf-8');
        } catch (error) {
            if (error instanceof Error && 'code' in error) {
                switch ((error as any).code) {
                    case 'EACCES':
                    case 'EPERM':
                        throw new Error(`Permission denied: ${filePath}`);
                    case 'ENOSPC':
                        throw new Error('Insufficient disk space');
                    default:
                        throw new Error(`Failed to write file: ${error.message}`);
                }
            }
            throw error;
        }
    }

    /**
     * Checks if a file exists
     */
    async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Gets the list of files in a directory
     */
    async listFiles(dirPath: string, extension?: string): Promise<string[]> {
        try {
            const files = await fs.readdir(dirPath);
            if (extension) {
                return files.filter(file => path.extname(file) === extension);
            }
            return files;
        } catch (error: any) {
            if (error && error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    /**
     * Copies a file from source to destination
     */
    async copyFile(sourcePath: string, destinationPath: string): Promise<void> {
        try {
            // Ensure destination directory exists
            const dir = path.dirname(destinationPath);
            await fs.mkdir(dir, { recursive: true });

            await fs.copyFile(sourcePath, destinationPath);
        } catch (error) {
            throw new Error(`Failed to copy file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Gets recent portfolios from preferences
     */
    async getRecentPortfolios(): Promise<string[]> {
        try {
            if (!(await this.fileExists(this.preferencesPath))) {
                return [];
            }

            const preferences = await this.readJsonFile(this.preferencesPath);
            return preferences.recentPortfolios || [];
        } catch {
            return [];
        }
    }

    /**
     * Adds a portfolio to the recent portfolios list
     */
    async addRecentPortfolio(portfolioPath: string): Promise<void> {
        try {
            let preferences: any = {};

            if (await this.fileExists(this.preferencesPath)) {
                try {
                    preferences = await this.readJsonFile(this.preferencesPath);
                } catch {
                    // If preferences file is corrupted, start fresh
                    preferences = {};
                }
            }

            if (!preferences.recentPortfolios) {
                preferences.recentPortfolios = [];
            }

            // Remove existing entry if present
            preferences.recentPortfolios = preferences.recentPortfolios.filter(
                (path: string) => path !== portfolioPath
            );

            // Add to beginning of list
            preferences.recentPortfolios.unshift(portfolioPath);

            // Keep only the 10 most recent
            preferences.recentPortfolios = preferences.recentPortfolios.slice(0, 10);

            await this.writeJsonFile(this.preferencesPath, preferences);
        } catch (error) {
            // Don't throw for preferences - it's not critical
            console.warn('Failed to update recent portfolios:', error);
        }
    }

    /**
     * Gets the size of a file in bytes
     */
    async getFileSize(filePath: string): Promise<number> {
        try {
            const stats = await fs.stat(filePath);
            return stats.size;
        } catch {
            return 0;
        }
    }

    /**
     * Gets the modification time of a file
     */
    async getFileModificationTime(filePath: string): Promise<Date | null> {
        try {
            const stats = await fs.stat(filePath);
            return stats.mtime;
        } catch {
            return null;
        }
    }
}
