/**
 * Unit tests for date utilities
 */

import {
    formatToMonthString,
    getCurrentISOString,
    getCurrentMonthString,
    getMonthsDifference,
    getMonthStringsBetween,
    getNextMonthString,
    getPreviousMonthString,
    isSameMonth,
    isValidISODateTime,
    isValidMonthString,
    parseMonthString
} from '../../../../src/shared/utils/date';

describe('Date Utilities', () => {
    describe('formatToMonthString', () => {
        test('should format date to YYYY-MM string', () => {
            const date = new Date(2024, 0, 15); // January 15, 2024
            expect(formatToMonthString(date)).toBe('2024-01');
        });

        test('should handle different months correctly', () => {
            expect(formatToMonthString(new Date(2024, 11, 1))).toBe('2024-12'); // December
            expect(formatToMonthString(new Date(2023, 5, 30))).toBe('2023-06'); // June
        });
    });

    describe('parseMonthString', () => {
        test('should parse valid month string to Date', () => {
            const date = parseMonthString('2024-01');
            expect(date.getFullYear()).toBe(2024);
            expect(date.getMonth()).toBe(0); // January (0-indexed)
            expect(date.getDate()).toBe(1); // First day of month
        });

        test('should throw error for invalid month string', () => {
            expect(() => parseMonthString('2024-1')).toThrow();
            expect(() => parseMonthString('2024-13')).toThrow();
            expect(() => parseMonthString('24-01')).toThrow();
            expect(() => parseMonthString('invalid')).toThrow();
        });
    });

    describe('getCurrentMonthString', () => {
        test('should return current month in YYYY-MM format', () => {
            const result = getCurrentMonthString();
            expect(result).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
        });
    });

    describe('getPreviousMonthString', () => {
        test('should return previous month from given month', () => {
            expect(getPreviousMonthString('2024-02')).toBe('2024-01');
            expect(getPreviousMonthString('2024-01')).toBe('2023-12');
        });

        test('should return previous month from current month when no parameter', () => {
            const result = getPreviousMonthString();
            expect(result).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
        });
    });

    describe('getNextMonthString', () => {
        test('should return next month from given month', () => {
            expect(getNextMonthString('2024-01')).toBe('2024-02');
            expect(getNextMonthString('2024-12')).toBe('2025-01');
        });

        test('should return next month from current month when no parameter', () => {
            const result = getNextMonthString();
            expect(result).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
        });
    });

    describe('isValidMonthString', () => {
        test('should validate correct month strings', () => {
            expect(isValidMonthString('2024-01')).toBe(true);
            expect(isValidMonthString('2024-12')).toBe(true);
            expect(isValidMonthString('2023-06')).toBe(true);
        });

        test('should reject invalid month strings', () => {
            expect(isValidMonthString('2024-1')).toBe(false);
            expect(isValidMonthString('2024-13')).toBe(false);
            expect(isValidMonthString('24-01')).toBe(false);
            expect(isValidMonthString('2024-00')).toBe(false);
            expect(isValidMonthString('invalid')).toBe(false);
        });
    });

    describe('getCurrentISOString', () => {
        test('should return valid ISO string', () => {
            const result = getCurrentISOString();
            expect(isValidISODateTime(result)).toBe(true);
        });
    });

    describe('isValidISODateTime', () => {
        test('should validate correct ISO datetime strings', () => {
            expect(isValidISODateTime('2024-01-01T00:00:00.000Z')).toBe(true);
            expect(isValidISODateTime('2024-12-31T23:59:59.999Z')).toBe(true);
        });

        test('should reject invalid ISO datetime strings', () => {
            expect(isValidISODateTime('2024-01-01')).toBe(false);
            expect(isValidISODateTime('invalid-date')).toBe(false);
            expect(isValidISODateTime('')).toBe(false);
        });
    });

    describe('getMonthsDifference', () => {
        test('should calculate months difference correctly', () => {
            const start = new Date(2024, 0, 1); // January 2024
            const end = new Date(2024, 5, 1); // June 2024
            expect(getMonthsDifference(start, end)).toBe(5);
        });

        test('should handle year boundaries', () => {
            const start = new Date(2023, 10, 1); // November 2023
            const end = new Date(2024, 1, 1); // February 2024
            expect(getMonthsDifference(start, end)).toBe(3);
        });

        test('should return negative for reverse order', () => {
            const start = new Date(2024, 5, 1); // June 2024
            const end = new Date(2024, 0, 1); // January 2024
            expect(getMonthsDifference(start, end)).toBe(-5);
        });
    });

    describe('getMonthStringsBetween', () => {
        test('should return array of month strings between dates', () => {
            const start = new Date(2024, 0, 1); // January 2024
            const end = new Date(2024, 2, 1); // March 2024
            const result = getMonthStringsBetween(start, end);
            expect(result).toEqual(['2024-01', '2024-02', '2024-03']);
        });

        test('should handle single month', () => {
            const start = new Date(2024, 0, 1); // January 2024
            const end = new Date(2024, 0, 31); // January 2024
            const result = getMonthStringsBetween(start, end);
            expect(result).toEqual(['2024-01']);
        });

        test('should handle year boundaries', () => {
            const start = new Date(2023, 11, 1); // December 2023
            const end = new Date(2024, 1, 1); // February 2024
            const result = getMonthStringsBetween(start, end);
            expect(result).toEqual(['2023-12', '2024-01', '2024-02']);
        });
    });

    describe('isSameMonth', () => {
        test('should return true for dates in same month', () => {
            const date1 = new Date(2024, 0, 1); // January 1, 2024
            const date2 = new Date(2024, 0, 31); // January 31, 2024
            expect(isSameMonth(date1, date2)).toBe(true);
        });

        test('should return false for dates in different months', () => {
            const date1 = new Date(2024, 0, 31); // January 31, 2024
            const date2 = new Date(2024, 1, 1); // February 1, 2024
            expect(isSameMonth(date1, date2)).toBe(false);
        });

        test('should return false for dates in different years', () => {
            const date1 = new Date(2023, 0, 1); // January 1, 2023
            const date2 = new Date(2024, 0, 1); // January 1, 2024
            expect(isSameMonth(date1, date2)).toBe(false);
        });
    });


});
