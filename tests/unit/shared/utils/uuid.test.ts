/**
 * Unit tests for UUID utilities
 */

import { generateUUID, generateValidatedUUID, isValidUUID } from '../../../../src/shared/utils/uuid';

describe('UUID Utilities', () => {
    describe('generateUUID', () => {
        test('should generate a valid UUID v4', () => {
            const uuid = generateUUID();
            expect(typeof uuid).toBe('string');
            expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        });

        test('should generate unique UUIDs', () => {
            const uuid1 = generateUUID();
            const uuid2 = generateUUID();
            expect(uuid1).not.toBe(uuid2);
        });

        test('should generate UUIDs with version 4', () => {
            const uuid = generateUUID();
            // The 13th character should be '4' for version 4
            expect(uuid.charAt(14)).toBe('4');
        });

        test('should generate UUIDs with correct variant', () => {
            const uuid = generateUUID();
            // The 17th character should be 8, 9, a, or b for RFC 4122 variant
            const variantChar = uuid.charAt(19).toLowerCase();
            expect(['8', '9', 'a', 'b']).toContain(variantChar);
        });
    });

    describe('isValidUUID', () => {
        test('should validate correct UUID v4', () => {
            const validUUIDs = [
                'e9be8e40-3cc1-471a-8eee-692a913929cb',
                'fce476f4-4942-432e-a294-36f8e63d2da9',
                '0befa50a-06da-498e-ba1d-da444002b4b0',
            ];

            validUUIDs.forEach(uuid => {
                expect(isValidUUID(uuid)).toBe(true);
            });
        });

        test('should reject invalid UUIDs', () => {
            const invalidUUIDs = [
                'invalid-uuid',
                '123e4567-e89b-12d3-a456-42661417400', // Too short
                '123e4567-e89b-12d3-a456-4266141740000', // Too long
                '123e4567-e89b-22d3-a456-426614174000', // Wrong version (2 instead of 4)
                '123e4567-e89b-12d3-c456-426614174000', // Wrong variant (c instead of 8,9,a,b)
                '', // Empty string
                'not-a-uuid-at-all',
            ];

            invalidUUIDs.forEach(uuid => {
                expect(isValidUUID(uuid)).toBe(false);
            });
        });

        test('should be case insensitive', () => {
            const uuid = 'E9BE8E40-3CC1-471A-8EEE-692A913929CB';
            expect(isValidUUID(uuid)).toBe(true);
            expect(isValidUUID(uuid.toLowerCase())).toBe(true);
        });
    });

    describe('generateValidatedUUID', () => {
        test('should generate a valid UUID', () => {
            const uuid = generateValidatedUUID();
            expect(isValidUUID(uuid)).toBe(true);
        });

        test('should generate unique validated UUIDs', () => {
            const uuid1 = generateValidatedUUID();
            const uuid2 = generateValidatedUUID();
            expect(uuid1).not.toBe(uuid2);
            expect(isValidUUID(uuid1)).toBe(true);
            expect(isValidUUID(uuid2)).toBe(true);
        });
    });
});