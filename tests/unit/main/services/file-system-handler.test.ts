/**
 * Unit tests for FileSystemHandler
 */

import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { FileSystemHandler } from '../../../../src/main/services/file-system-handler';

// Mock electron app
jest.mock('electron', () => ({
    app: {
        getPath: jest.fn(() => '/mock/user/data'),
    },
}));

describe('FileSystemHandler', () => {
    let fileSystemHandler: FileSystemHandler;
    let tempDir: string;

    beforeEach(async () => {
        // Create a temporary directory for testing
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'momentum-fs-test-'));
        fileSystemHandler = new FileSystemHandler();
    });

    afterEach(async () => {
        // Clean up temporary directory
        try {
            await fs.rm(tempDir, { recursive: true, force: true });
        } catch {
            // Ignore cleanup errors
        }
    });

    describe('validateFolderPath', () => {
        it('should validate existing writable folder', async () => {
            await expect(fileSystemHandler.validateFolderPath(tempDir)).resolves.toBeUndefined();
        });

        it('should throw error for non-existent folder', async () => {
            const nonExistentPath = path.join(tempDir, 'nonexistent');

            await expect(fileSystemHandler.validateFolderPath(nonExistentPath))
                .rejects.toThrow('ENOENT');
        });

        it('should throw error for file path instead of folder', async () => {
            const filePath = path.join(tempDir, 'test.txt');
            await fs.writeFile(filePath, 'test');

            await expect(fileSystemHandler.validateFolderPath(filePath))
                .rejects.toThrow('Path is not a directory');
        });
    });

    describe('createPortfolioStructure', () => {
        it('should create snapshots and backups directories', async () => {
            await fileSystemHandler.createPortfolioStructure(tempDir);

            const snapshotsDir = path.join(tempDir, 'snapshots');
            const backupsDir = path.join(tempDir, 'backups');

            const snapshotsStats = await fs.stat(snapshotsDir);
            const backupsStats = await fs.stat(backupsDir);

            expect(snapshotsStats.isDirectory()).toBe(true);
            expect(backupsStats.isDirectory()).toBe(true);
        });
    });

    describe('readJsonFile', () => {
        it('should read and parse valid JSON file', async () => {
            const testData = { test: 'data', number: 42 };
            const filePath = path.join(tempDir, 'test.json');

            await fs.writeFile(filePath, JSON.stringify(testData));

            const result = await fileSystemHandler.readJsonFile(filePath);
            expect(result).toEqual(testData);
        });

        it('should throw error for non-existent file', async () => {
            const filePath = path.join(tempDir, 'nonexistent.json');

            await expect(fileSystemHandler.readJsonFile(filePath))
                .rejects.toThrow('ENOENT');
        });

        it('should throw error for invalid JSON', async () => {
            const filePath = path.join(tempDir, 'invalid.json');
            await fs.writeFile(filePath, '{ invalid json }');

            await expect(fileSystemHandler.readJsonFile(filePath))
                .rejects.toThrow('Invalid JSON format');
        });
    });

    describe('writeJsonFile', () => {
        it('should write JSON data to file with formatting', async () => {
            const testData = { test: 'data', nested: { value: 123 } };
            const filePath = path.join(tempDir, 'output.json');

            await fileSystemHandler.writeJsonFile(filePath, testData);

            const fileContent = await fs.readFile(filePath, 'utf-8');
            const parsedData = JSON.parse(fileContent);

            expect(parsedData).toEqual(testData);
            expect(fileContent).toContain('  '); // Should be formatted with spaces
        });

        it('should create directory if it does not exist', async () => {
            const subDir = path.join(tempDir, 'subdir', 'nested');
            const filePath = path.join(subDir, 'test.json');
            const testData = { test: 'data' };

            await fileSystemHandler.writeJsonFile(filePath, testData);

            const fileContent = await fs.readFile(filePath, 'utf-8');
            expect(JSON.parse(fileContent)).toEqual(testData);
        });
    });

    describe('fileExists', () => {
        it('should return true for existing file', async () => {
            const filePath = path.join(tempDir, 'exists.txt');
            await fs.writeFile(filePath, 'content');

            const result = await fileSystemHandler.fileExists(filePath);
            expect(result).toBe(true);
        });

        it('should return false for non-existent file', async () => {
            const filePath = path.join(tempDir, 'nonexistent.txt');

            const result = await fileSystemHandler.fileExists(filePath);
            expect(result).toBe(false);
        });
    });

    describe('listFiles', () => {
        it('should list all files in directory', async () => {
            await fs.writeFile(path.join(tempDir, 'file1.txt'), 'content1');
            await fs.writeFile(path.join(tempDir, 'file2.json'), 'content2');
            await fs.mkdir(path.join(tempDir, 'subdir'));

            const files = await fileSystemHandler.listFiles(tempDir);

            expect(files).toContain('file1.txt');
            expect(files).toContain('file2.json');
            expect(files).toContain('subdir');
        });

        it('should filter files by extension', async () => {
            await fs.writeFile(path.join(tempDir, 'file1.txt'), 'content1');
            await fs.writeFile(path.join(tempDir, 'file2.json'), 'content2');
            await fs.writeFile(path.join(tempDir, 'file3.json'), 'content3');

            const jsonFiles = await fileSystemHandler.listFiles(tempDir, '.json');

            expect(jsonFiles).toEqual(['file2.json', 'file3.json']);
        });

        it('should return empty array for non-existent directory', async () => {
            const nonExistentDir = path.join(tempDir, 'nonexistent');

            const files = await fileSystemHandler.listFiles(nonExistentDir);
            expect(files).toEqual([]);
        });
    });

    describe('copyFile', () => {
        it('should copy file to destination', async () => {
            const sourceFile = path.join(tempDir, 'source.txt');
            const destFile = path.join(tempDir, 'dest.txt');
            const content = 'test content';

            await fs.writeFile(sourceFile, content);
            await fileSystemHandler.copyFile(sourceFile, destFile);

            const copiedContent = await fs.readFile(destFile, 'utf-8');
            expect(copiedContent).toBe(content);
        });

        it('should create destination directory if needed', async () => {
            const sourceFile = path.join(tempDir, 'source.txt');
            const destFile = path.join(tempDir, 'subdir', 'dest.txt');
            const content = 'test content';

            await fs.writeFile(sourceFile, content);
            await fileSystemHandler.copyFile(sourceFile, destFile);

            const copiedContent = await fs.readFile(destFile, 'utf-8');
            expect(copiedContent).toBe(content);
        });
    });

    describe('getFileSize', () => {
        it('should return file size in bytes', async () => {
            const filePath = path.join(tempDir, 'test.txt');
            const content = 'Hello, World!';

            await fs.writeFile(filePath, content);

            const size = await fileSystemHandler.getFileSize(filePath);
            expect(size).toBe(Buffer.byteLength(content, 'utf-8'));
        });

        it('should return 0 for non-existent file', async () => {
            const filePath = path.join(tempDir, 'nonexistent.txt');

            const size = await fileSystemHandler.getFileSize(filePath);
            expect(size).toBe(0);
        });
    });

    describe('getFileModificationTime', () => {
        it('should return modification time for existing file', async () => {
            const filePath = path.join(tempDir, 'test.txt');
            await fs.writeFile(filePath, 'content');

            const modTime = await fileSystemHandler.getFileModificationTime(filePath);
            expect(modTime).not.toBeNull();
            expect(typeof modTime?.getTime).toBe('function');
            expect(Math.abs(modTime!.getTime() - Date.now())).toBeLessThan(5000); // Within 5 seconds
        });

        it('should return null for non-existent file', async () => {
            const filePath = path.join(tempDir, 'nonexistent.txt');

            const modTime = await fileSystemHandler.getFileModificationTime(filePath);
            expect(modTime).toBeNull();
        });
    });
});