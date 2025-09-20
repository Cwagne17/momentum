/**
 * Unit tests for monthly snapshot types and validation
 */

import { ApiVersion, DocumentKind } from '../../../../src/shared/types/base-document';
import { MonthlySnapshot, MonthlySnapshotSchema } from '../../../../src/shared/types/monthly-snapshot';

describe('MonthlySnapshot Types', () => {
    describe('Interface Structure', () => {
        test('MonthlySnapshot should have correct structure', () => {
            const snapshot: MonthlySnapshot = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.MonthlySnapshot,
                metadata: {
                    name: 'Test Snapshot',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    month: '2024-01',
                    assetEntries: [
                        {
                            id: '0befa50a-06da-498e-ba1d-da444002b4b0',
                            assetId: 'e9be8e40-3cc1-471a-8eee-692a913929cb',
                            value: 1000.50,
                        },
                    ],
                    liabilityEntries: [
                        {
                            id: '51441749-4654-488f-9439-be2f3c60c07d',
                            liabilityId: 'fce476f4-4942-432e-a294-36f8e63d2da9',
                            value: 500.00,
                        },
                    ],
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                },
            };

            expect(snapshot.kind).toBe(DocumentKind.MonthlySnapshot);
            expect(snapshot.spec.month).toBe('2024-01');
            expect(snapshot.spec.assetEntries).toHaveLength(1);
            expect(snapshot.spec.liabilityEntries).toHaveLength(1);
        });
    });

    describe('Validation', () => {
        test('should validate correct monthly snapshot', () => {
            const validSnapshot = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.MonthlySnapshot,
                metadata: {
                    name: 'Test Snapshot',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    month: '2024-01',
                    assetEntries: [
                        {
                            id: '0befa50a-06da-498e-ba1d-da444002b4b0',
                            assetId: 'e9be8e40-3cc1-471a-8eee-692a913929cb',
                            value: 1000.50,
                        },
                    ],
                    liabilityEntries: [
                        {
                            id: '51441749-4654-488f-9439-be2f3c60c07d',
                            liabilityId: 'fce476f4-4942-432e-a294-36f8e63d2da9',
                            value: 500.00,
                        },
                    ],
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                },
            };

            expect(() => MonthlySnapshotSchema.parse(validSnapshot)).not.toThrow();
        });

        test('should reject snapshot with invalid month format', () => {
            const invalidSnapshot = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.MonthlySnapshot,
                metadata: {
                    name: 'Test Snapshot',
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

            expect(() => MonthlySnapshotSchema.parse(invalidSnapshot)).toThrow();
        });
    });
});