/**
 * Backup Manager for creating and managing portfolio backups
 * Creates timestamped backups before save operations to prevent data loss
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { FileSystemHandler } from './file-system-handler';

export class BackupManager {
    private readonly fileSystemHandler: FileSystemHandler;
    private readonly maxBackups = 50; // Keep last 50 backups

    constructor() {
        this.fileSystemHandler = new FileSystemHandler();
    }

    /**
     * Creates a timestamped backup of the entire portfolio folder
     */
    async createBackup(portfolioFolderPath: string): Promise<string> {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFolderName = `backup-${timestamp}`;
            const backupsDir = path.join(portfolioFolderPath, 'backups');
            const backupPath = path.join(backupsDir, backupFolderName);

            // Ensure backups directory exists
            await fs.mkdir(backupsDir, { recursive: true });

            // Create backup directory
            await fs.mkdir(backupPath, { recursive: true });

            // Copy all files except the backups directory itself
            await this.copyPortfolioFiles(portfolioFolderPath, backupPath);

            // Clean up old backups
            await this.cleanupOldBackups(backupsDir);

            return backupPath;
        } catch (error) {
            throw new Error(`Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Copies portfolio files to backup location, excluding the backups directory
     */
    private async copyPortfolioFiles(sourcePath: string, destinationPath: string): Promise<void> {
        const items = await fs.readdir(sourcePath, { withFileTypes: true });

        for (const item of items) {
            const sourceItemPath = path.join(sourcePath, item.name);
            const destItemPath = path.join(destinationPath, item.name);

            // Skip the backups directory to avoid recursive copying
            if (item.name === 'backups') {
                continue;
            }

            if (item.isDirectory()) {
                // Recursively copy directories
                await fs.mkdir(destItemPath, { recursive: true });
                await this.copyPortfolioFiles(sourceItemPath, destItemPath);
            } else {
                // Copy files
                await this.fileSystemHandler.copyFile(sourceItemPath, destItemPath);
            }
        }
    }

    /**
     * Removes old backups to keep only the most recent ones
     */
    private async cleanupOldBackups(backupsDir: string): Promise<void> {
        try {
            const backupFolders = await fs.readdir(backupsDir, { withFileTypes: true });

            // Filter to only backup directories and sort by creation time
            const backupDirs = backupFolders
                .filter(item => item.isDirectory() && item.name.startsWith('backup-'))
                .map(item => ({
                    name: item.name,
                    path: path.join(backupsDir, item.name)
                }));

            // Sort by name (which includes timestamp) in descending order
            backupDirs.sort((a, b) => b.name.localeCompare(a.name));

            // Remove excess backups
            if (backupDirs.length > this.maxBackups) {
                const backupsToRemove = backupDirs.slice(this.maxBackups);

                for (const backup of backupsToRemove) {
                    await this.removeDirectory(backup.path);
                }
            }
        } catch (error) {
            // Don't fail the backup operation if cleanup fails
            console.warn('Failed to cleanup old backups:', error);
        }
    }

    /**
     * Recursively removes a directory and all its contents
     */
    private async removeDirectory(dirPath: string): Promise<void> {
        try {
            await fs.rm(dirPath, { recursive: true, force: true });
        } catch (error) {
            console.warn(`Failed to remove backup directory ${dirPath}:`, error);
        }
    }

    /**
     * Lists all available backups for a portfolio
     */
    async listBackups(portfolioFolderPath: string): Promise<Array<{ name: string; path: string; createdAt: Date }>> {
        try {
            const backupsDir = path.join(portfolioFolderPath, 'backups');

            if (!(await this.fileSystemHandler.fileExists(backupsDir))) {
                return [];
            }

            const backupFolders = await fs.readdir(backupsDir, { withFileTypes: true });

            const backups = [];
            for (const item of backupFolders) {
                if (item.isDirectory() && item.name.startsWith('backup-')) {
                    const backupPath = path.join(backupsDir, item.name);
                    const stats = await fs.stat(backupPath);

                    backups.push({
                        name: item.name,
                        path: backupPath,
                        createdAt: stats.birthtime
                    });
                }
            }

            // Sort by creation time, newest first
            return backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error) {
            console.warn('Failed to list backups:', error);
            return [];
        }
    }

    /**
     * Restores a portfolio from a backup
     */
    async restoreFromBackup(portfolioFolderPath: string, backupName: string): Promise<void> {
        try {
            const backupPath = path.join(portfolioFolderPath, 'backups', backupName);

            // Verify backup exists
            if (!(await this.fileSystemHandler.fileExists(backupPath))) {
                throw new Error(`Backup not found: ${backupName}`);
            }

            // Create a backup of the current state before restoring
            await this.createBackup(portfolioFolderPath);

            // Remove current files (except backups directory)
            const items = await fs.readdir(portfolioFolderPath, { withFileTypes: true });
            for (const item of items) {
                if (item.name !== 'backups') {
                    const itemPath = path.join(portfolioFolderPath, item.name);
                    if (item.isDirectory()) {
                        await fs.rm(itemPath, { recursive: true, force: true });
                    } else {
                        await fs.unlink(itemPath);
                    }
                }
            }

            // Copy backup files to portfolio folder
            await this.copyPortfolioFiles(backupPath, portfolioFolderPath);
        } catch (error) {
            throw new Error(`Failed to restore from backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Gets the total size of all backups for a portfolio
     */
    async getBackupsSize(portfolioFolderPath: string): Promise<number> {
        try {
            const backupsDir = path.join(portfolioFolderPath, 'backups');

            if (!(await this.fileSystemHandler.fileExists(backupsDir))) {
                return 0;
            }

            return await this.getDirectorySize(backupsDir);
        } catch {
            return 0;
        }
    }

    /**
     * Calculates the total size of a directory recursively
     */
    private async getDirectorySize(dirPath: string): Promise<number> {
        let totalSize = 0;

        try {
            const items = await fs.readdir(dirPath, { withFileTypes: true });

            for (const item of items) {
                const itemPath = path.join(dirPath, item.name);

                if (item.isDirectory()) {
                    totalSize += await this.getDirectorySize(itemPath);
                } else {
                    const stats = await fs.stat(itemPath);
                    totalSize += stats.size;
                }
            }
        } catch {
            // Ignore errors for individual files/directories
        }

        return totalSize;
    }
}