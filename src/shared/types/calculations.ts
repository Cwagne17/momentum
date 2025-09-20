/**
 * Calculation-related types and validation schemas
 * 
 * This file contains interfaces and schemas for financial calculations,
 * date ranges, and data visualization.
 */

import { z } from 'zod';

/**
 * Date range interface for calculations
 */
export interface DateRange {
    start: Date;
    end: Date;
}

/**
 * Financial totals interface for calculated values
 */
export interface FinancialTotals {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    liquidAssets: number;
    illiquidAssets: number;
    liquidNetWorth: number;
    assetsByType: Record<string, number>;
    liabilitiesByType: Record<string, number>;
}

/**
 * Financial deltas interface for change calculations
 */
export interface FinancialDeltas {
    netWorthMoM: { amount: number; percentage: number };
    netWorthYoY: { amount: number; percentage: number };
    assetsMoM: { amount: number; percentage: number };
    liabilitiesMoM: { amount: number; percentage: number };
}

/**
 * Financial ratios interface
 */
export interface FinancialRatios {
    debtToAssetRatio: number;
}

/**
 * Trend data interface for chart visualizations
 */
export interface TrendData {
    dates: string[];
    netWorthValues: number[];
    assetValues: number[];
    liabilityValues: number[];
    projectionDates?: string[];
    projectionValues?: number[];
}

/**
 * Export format type
 */
export type ExportFormat = "csv" | "json";

/**
 * Date range schema
 */
export const DateRangeSchema = z.object({
    start: z.date(),
    end: z.date(),
}).refine(
    (data) => data.start <= data.end,
    { message: "Start date must be before or equal to end date" }
);

/**
 * Financial totals schema
 */
export const FinancialTotalsSchema = z.object({
    totalAssets: z.number().refine((val) => Number.isFinite(val), { message: "Total assets must be a finite number" }),
    totalLiabilities: z.number().refine((val) => Number.isFinite(val), { message: "Total liabilities must be a finite number" }),
    netWorth: z.number().refine((val) => Number.isFinite(val), { message: "Net worth must be a finite number" }),
    liquidAssets: z.number().refine((val) => Number.isFinite(val), { message: "Liquid assets must be a finite number" }),
    illiquidAssets: z.number().refine((val) => Number.isFinite(val), { message: "Illiquid assets must be a finite number" }),
    liquidNetWorth: z.number().refine((val) => Number.isFinite(val), { message: "Liquid net worth must be a finite number" }),
    assetsByType: z.record(z.string(), z.number().refine((val) => Number.isFinite(val), { message: "Asset value must be a finite number" })),
    liabilitiesByType: z.record(z.string(), z.number().refine((val) => Number.isFinite(val), { message: "Liability value must be a finite number" })),
});

/**
 * Financial deltas schema
 */
export const FinancialDeltasSchema = z.object({
    netWorthMoM: z.object({
        amount: z.number().refine((val) => Number.isFinite(val), { message: "Net worth MoM amount must be a finite number" }),
        percentage: z.number().refine((val) => Number.isFinite(val), { message: "Net worth MoM percentage must be a finite number" }),
    }),
    netWorthYoY: z.object({
        amount: z.number().refine((val) => Number.isFinite(val), { message: "Net worth YoY amount must be a finite number" }),
        percentage: z.number().refine((val) => Number.isFinite(val), { message: "Net worth YoY percentage must be a finite number" }),
    }),
    assetsMoM: z.object({
        amount: z.number().refine((val) => Number.isFinite(val), { message: "Assets MoM amount must be a finite number" }),
        percentage: z.number().refine((val) => Number.isFinite(val), { message: "Assets MoM percentage must be a finite number" }),
    }),
    liabilitiesMoM: z.object({
        amount: z.number().refine((val) => Number.isFinite(val), { message: "Liabilities MoM amount must be a finite number" }),
        percentage: z.number().refine((val) => Number.isFinite(val), { message: "Liabilities MoM percentage must be a finite number" }),
    }),
});

/**
 * Financial ratios schema
 */
export const FinancialRatiosSchema = z.object({
    debtToAssetRatio: z.number().refine((val) => Number.isFinite(val), { message: "Debt to asset ratio must be a finite number" }),
});

/**
 * Trend data schema
 */
export const TrendDataSchema = z.object({
    dates: z.array(z.string()),
    netWorthValues: z.array(z.number().refine((val) => Number.isFinite(val), { message: "Net worth value must be a finite number" })),
    assetValues: z.array(z.number().refine((val) => Number.isFinite(val), { message: "Asset value must be a finite number" })),
    liabilityValues: z.array(z.number().refine((val) => Number.isFinite(val), { message: "Liability value must be a finite number" })),
    projectionDates: z.array(z.string()).optional(),
    projectionValues: z.array(z.number().refine((val) => Number.isFinite(val), { message: "Projection value must be a finite number" })).optional(),
});

/**
 * Export format schema
 */
export const ExportFormatSchema = z.enum(["csv", "json"]);