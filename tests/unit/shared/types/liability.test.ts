/**
 * Unit tests for liability types and validation
 */

import { ApiVersion, DocumentKind } from '../../../../src/shared/types/base-document';
import { Liability, LiabilitySchema, LiabilityType } from '../../../../src/shared/types/liability';

describe('Liability Types', () => {
    describe('Enums', () => {
        test('LiabilityType should have correct values', () => {
            expect(LiabilityType.CreditCard).toBe('Credit Card');
            expect(LiabilityType.CarLoan).toBe('Car Loan');
            expect(LiabilityType.StudentLoan).toBe('Student Loan');
            expect(LiabilityType.MedicalBills).toBe('Medical Bills');
            expect(LiabilityType.PersonalLoan).toBe('Personal Loan');
            expect(LiabilityType.Mortgage).toBe('Mortgage');
            expect(LiabilityType.OtherLiability).toBe('Other Liability');
        });
    });

    describe('Interface Structure', () => {
        test('Liability should have correct structure', () => {
            const liability: Liability = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Liability,
                metadata: {
                    name: 'Test Liability',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    id: 'fce476f4-4942-432e-a294-36f8e63d2da9',
                    name: 'Credit Card',
                    type: LiabilityType.CreditCard,
                    isArchived: false,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            expect(liability.kind).toBe(DocumentKind.Liability);
            expect(liability.spec.type).toBe(LiabilityType.CreditCard);
        });
    });

    describe('Validation', () => {
        test('should validate correct liability', () => {
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
                    id: 'fce476f4-4942-432e-a294-36f8e63d2da9',
                    name: 'Credit Card',
                    type: LiabilityType.CreditCard,
                    isArchived: false,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            expect(() => LiabilitySchema.parse(validLiability)).not.toThrow();
        });
    });
});
describe('LiabilityEntry Types', () => {
    test('LiabilityEntry should have correct structure', () => {
        const liabilityEntry = {
            apiVersion: ApiVersion.V1,
            kind: DocumentKind.Entry,
            metadata: {
                name: 'Test Liability Entry',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                version: 1,
            },
            spec: {
                id: 'f6a7b8c9-d0e1-4234-f567-890123456789',
                liabilityId: 'fce476f4-4942-432e-a294-36f8e63d2da9',
                value: 500.00,
            },
        };

        expect(liabilityEntry.kind).toBe(DocumentKind.Entry);
        expect(liabilityEntry.spec.liabilityId).toBeDefined();
        expect(liabilityEntry.spec.value).toBe(500.00);
    });
});