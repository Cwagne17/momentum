/**
 * Unit tests for asset types and validation
 */

import { Asset, AssetSchema, AssetType } from '../../../../src/shared/types/asset';
import { ApiVersion, DocumentKind } from '../../../../src/shared/types/base-document';

describe('Asset Types', () => {
    describe('Enums', () => {
        test('AssetType should have correct values', () => {
            expect(AssetType.Cash).toBe('Cash');
            expect(AssetType.RetirementInvestment).toBe('Retirement Investment');
            expect(AssetType.NonRetirementInvestment).toBe('Non-retirement Investment');
            expect(AssetType.Property).toBe('Property');
            expect(AssetType.Vehicle).toBe('Vehicle');
            expect(AssetType.OtherAsset).toBe('Other Asset');
        });
    });

    describe('Interface Structure', () => {
        test('Asset should have correct structure', () => {
            const asset: Asset = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Asset,
                metadata: {
                    name: 'Test Asset',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    id: 'e9be8e40-3cc1-471a-8eee-692a913929cb',
                    name: 'Checking Account',
                    type: AssetType.Cash,
                    isLiquid: true,
                    isArchived: false,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            expect(asset.kind).toBe(DocumentKind.Asset);
            expect(asset.spec.type).toBe(AssetType.Cash);
            expect(asset.spec.isLiquid).toBe(true);
        });
    });

    describe('Validation', () => {
        test('should validate correct asset', () => {
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
                    id: 'e9be8e40-3cc1-471a-8eee-692a913929cb',
                    name: 'Checking Account',
                    type: AssetType.Cash,
                    isLiquid: true,
                    isArchived: false,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            expect(() => AssetSchema.parse(validAsset)).not.toThrow();
        });

        test('should reject asset with invalid UUID', () => {
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
                    name: 'Checking Account',
                    type: AssetType.Cash,
                    isLiquid: true,
                    isArchived: false,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            expect(() => AssetSchema.parse(invalidAsset)).toThrow();
        });
    });
});

describe('AssetEntry Types', () => {
    test('AssetEntry should have correct structure', () => {
        const assetEntry = {
            apiVersion: ApiVersion.V1,
            kind: DocumentKind.Entry,
            metadata: {
                name: 'Test Asset Entry',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                version: 1,
            },
            spec: {
                id: '0befa50a-06da-498e-ba1d-da444002b4b0',
                assetId: 'e9be8e40-3cc1-471a-8eee-692a913929cb',
                value: 1000.50,
            },
        };

        expect(assetEntry.kind).toBe(DocumentKind.Entry);
        expect(assetEntry.spec.assetId).toBeDefined();
        expect(assetEntry.spec.value).toBe(1000.50);
    });
});