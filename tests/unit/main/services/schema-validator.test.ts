/**
 * Unit tests for SchemaValidator
 */

import { SchemaValidator } from '../../../../src/main/services/schema-validator';
import { ApiVersion, AssetType, DocumentKind, LiabilityType } from '../../../../src/shared/types';

describe('SchemaValidator', () => {
    let schemaValidator: SchemaValidator;

    beforeEach(() => {
        schemaValidator = new SchemaValidator();
    });

    describe('validatePortfolio', () => {
        it('should validate valid portfolio document', () => {
            const validPortfolio = {
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
                    folderPath: '/path/to/portfolio',
                    currency: 'USD' as const,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    lastModified: '2024-01-01T00:00:00.000Z',
                },
            };

            const result = schemaValidator.validatePortfolio(validPortfolio);
            expect(result).toEqual(validPortfolio);
        });

        it('should throw error for invalid portfolio document', () => {
            const invalidPortfolio = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Portfolio,
                metadata: {
                    name: 'Test Portfolio',
                    // missing required fields
                },
                spec: {
                    // missing required fields
                },
            };

            expect(() => schemaValidator.validatePortfolio(invalidPortfolio))
                .toThrow('Portfolio validation failed');
        });

        it('should throw error for wrong document kind', () => {
            const wrongKind = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Asset, // Wrong kind
                metadata: {
                    name: 'Test Portfolio',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    name: 'Test Portfolio',
                    folderPath: '/path/to/portfolio',
                    currency: 'USD' as const,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    lastModified: '2024-01-01T00:00:00.000Z',
                },
            };

            expect(() => schemaValidator.validatePortfolio(wrongKind))
                .toThrow('Portfolio validation failed');
        });
    });

    describe('validateAsset', () => {
        it('should validate valid asset document', () => {
            const validAsset = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Asset,
                metadata: {
                    name: 'Test Asset',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    id: '123e4567-e89b-42d3-a456-426614174000',
                    name: 'Savings Account',
                    type: AssetType.Cash,
                    isLiquid: true,
                    isArchived: false,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            const result = schemaValidator.validateAsset(validAsset);
            expect(result).toEqual(validAsset);
        });

        it('should throw error for invalid UUID format', () => {
            const invalidAsset = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Asset,
                metadata: {
                    name: 'Test Asset',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    id: 'invalid-uuid',
                    name: 'Savings Account',
                    type: AssetType.Cash,
                    isLiquid: true,
                    isArchived: false,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            expect(() => schemaValidator.validateAsset(invalidAsset))
                .toThrow('Asset validation failed');
        });
    });

    describe('validateLiability', () => {
        it('should validate valid liability document', () => {
            const validLiability = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Liability,
                metadata: {
                    name: 'Test Liability',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    id: '123e4567-e89b-42d3-a456-426614174000',
                    name: 'Credit Card',
                    type: LiabilityType.CreditCard,
                    isArchived: false,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            const result = schemaValidator.validateLiability(validLiability);
            expect(result).toEqual(validLiability);
        });
    });

    describe('validateMonthlySnapshot', () => {
        it('should validate valid monthly snapshot document', () => {
            const validSnapshot = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.MonthlySnapshot,
                metadata: {
                    name: '2024-01',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    month: '2024-01',
                    assetEntries: [],
                    liabilityEntries: [],
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                },
            };

            const result = schemaValidator.validateMonthlySnapshot(validSnapshot);
            expect(result).toEqual(validSnapshot);
        });

        it('should throw error for invalid month format', () => {
            const invalidSnapshot = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.MonthlySnapshot,
                metadata: {
                    name: '2024-1', // Invalid format
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    month: '2024-1', // Invalid format
                    assetEntries: [],
                    liabilityEntries: [],
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                },
            };

            expect(() => schemaValidator.validateMonthlySnapshot(invalidSnapshot))
                .toThrow('Monthly snapshot validation failed');
        });
    });

    describe('validateAndMigratePortfolio', () => {
        it('should validate and return V1 portfolio without migration', async () => {
            const validPortfolio = {
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
                    folderPath: '/path/to/portfolio',
                    currency: 'USD' as const,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    lastModified: '2024-01-01T00:00:00.000Z',
                },
            };

            const result = await schemaValidator.validateAndMigratePortfolio(validPortfolio);
            expect(result).toEqual(validPortfolio);
        });

        it('should throw error for missing apiVersion', async () => {
            const invalidData = {
                kind: DocumentKind.Portfolio,
                // missing apiVersion
            };

            await expect(schemaValidator.validateAndMigratePortfolio(invalidData))
                .rejects.toThrow('Invalid portfolio data: Missing apiVersion');
        });

        it('should throw error for unsupported apiVersion', async () => {
            const unsupportedVersion = {
                apiVersion: 'unsupported/v2',
                kind: DocumentKind.Portfolio,
            };

            await expect(schemaValidator.validateAndMigratePortfolio(unsupportedVersion))
                .rejects.toThrow('Unsupported API version: unsupported/v2');
        });

        it('should throw error for invalid data type', async () => {
            await expect(schemaValidator.validateAndMigratePortfolio(null))
                .rejects.toThrow('Invalid portfolio data: Expected object');

            await expect(schemaValidator.validateAndMigratePortfolio('string'))
                .rejects.toThrow('Invalid portfolio data: Expected object');
        });
    });

    describe('validateDocumentKind', () => {
        it('should pass for correct document kind', () => {
            const data = { kind: DocumentKind.Portfolio };

            expect(() => schemaValidator.validateDocumentKind(data, DocumentKind.Portfolio))
                .not.toThrow();
        });

        it('should throw error for missing kind', () => {
            const data = {};

            expect(() => schemaValidator.validateDocumentKind(data, DocumentKind.Portfolio))
                .toThrow('Invalid document: Missing kind');
        });

        it('should throw error for wrong kind', () => {
            const data = { kind: DocumentKind.Asset };

            expect(() => schemaValidator.validateDocumentKind(data, DocumentKind.Portfolio))
                .toThrow('Invalid document kind: Expected Portfolio, got Asset');
        });
    });

    describe('validateMetadata', () => {
        it('should pass for valid metadata', () => {
            const data = {
                metadata: {
                    name: 'Test',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
            };

            expect(() => schemaValidator.validateMetadata(data)).not.toThrow();
        });

        it('should throw error for missing metadata', () => {
            const data = {};

            expect(() => schemaValidator.validateMetadata(data))
                .toThrow('Invalid document: Missing metadata');
        });

        it('should throw error for missing required fields', () => {
            const data = {
                metadata: {
                    name: 'Test',
                    // missing other required fields
                },
            };

            expect(() => schemaValidator.validateMetadata(data))
                .toThrow('Invalid document: Missing metadata.createdAt');
        });
    });

    describe('utility methods', () => {
        it('should return false for needsMigration with V1 data', () => {
            const data = { apiVersion: ApiVersion.V1 };
            expect(schemaValidator.needsMigration(data)).toBe(false);
        });

        it('should return true for needsMigration with non-V1 data', () => {
            const data = { apiVersion: 'old/v0' };
            expect(schemaValidator.needsMigration(data)).toBe(true);
        });

        it('should return current API version', () => {
            expect(schemaValidator.getCurrentApiVersion()).toBe(ApiVersion.V1);
        });
    });
});