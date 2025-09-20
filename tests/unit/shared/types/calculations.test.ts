/**
 * Unit tests for calculation types and validation
 */

import {
    DateRangeSchema,
    ExportFormatSchema,
    FinancialDeltasSchema,
    FinancialRatiosSchema,
    FinancialTotalsSchema,
    TrendDataSchema,
} from '../../../../src/shared/types/calculations';

describe('Calculation Types', () => {
    describe('DateRangeSchema', () => {
        test('should validate correct date range', () => {
            const validRange = {
                start: new Date('2024-01-01'),
                end: new Date('2024-12-31'),
            };

            expect(() => DateRangeSchema.parse(validRange)).not.toThrow();
        });

        test('should reject range where start is after end', () => {
            const invalidRange = {
                start: new Date('2024-12-31'),
                end: new Date('2024-01-01'),
            };

            expect(() => DateRangeSchema.parse(invalidRange)).toThrow();
        });
    });

    describe('FinancialTotalsSchema', () => {
        test('should validate correct financial totals', () => {
            const validTotals = {
                totalAssets: 100000,
                totalLiabilities: 50000,
                netWorth: 50000,
                liquidAssets: 25000,
                illiquidAssets: 75000,
                liquidNetWorth: -25000,
                assetsByType: { Cash: 25000, Property: 75000 },
                liabilitiesByType: { Mortgage: 50000 },
            };

            expect(() => FinancialTotalsSchema.parse(validTotals)).not.toThrow();
        });
    });

    describe('FinancialDeltasSchema', () => {
        test('should validate correct financial deltas', () => {
            const validDeltas = {
                netWorthMoM: { amount: 1000, percentage: 2.5 },
                netWorthYoY: { amount: 12000, percentage: 15.0 },
                assetsMoM: { amount: 500, percentage: 1.2 },
                liabilitiesMoM: { amount: -500, percentage: -2.0 },
            };

            expect(() => FinancialDeltasSchema.parse(validDeltas)).not.toThrow();
        });
    });

    describe('FinancialRatiosSchema', () => {
        test('should validate correct financial ratios', () => {
            const validRatios = {
                debtToAssetRatio: 0.35,
            };

            expect(() => FinancialRatiosSchema.parse(validRatios)).not.toThrow();
        });
    });

    describe('TrendDataSchema', () => {
        test('should validate correct trend data', () => {
            const validTrendData = {
                dates: ['2024-01', '2024-02', '2024-03'],
                netWorthValues: [100000, 102000, 105000],
                assetValues: [150000, 152000, 155000],
                liabilityValues: [50000, 50000, 50000],
                projectionDates: ['2024-04', '2024-05'],
                projectionValues: [107000, 109000],
            };

            expect(() => TrendDataSchema.parse(validTrendData)).not.toThrow();
        });
    });

    describe('ExportFormatSchema', () => {
        test('should validate correct export formats', () => {
            expect(() => ExportFormatSchema.parse('csv')).not.toThrow();
            expect(() => ExportFormatSchema.parse('json')).not.toThrow();
        });

        test('should reject invalid export format', () => {
            expect(() => ExportFormatSchema.parse('xml')).toThrow();
        });
    });
});