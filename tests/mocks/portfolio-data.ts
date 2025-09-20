/**
 * Mock portfolio data for testing
 */

import { Asset, AssetType } from '../../src/shared/types/asset';
import { ApiVersion, DocumentKind } from '../../src/shared/types/base-document';
import { Liability, LiabilityType } from '../../src/shared/types/liability';
import { MonthlySnapshot } from '../../src/shared/types/monthly-snapshot';
import { Portfolio } from '../../src/shared/types/portfolio';

/**
 * Mock portfolio document
 */
export const mockPortfolio: Portfolio = {
    apiVersion: ApiVersion.V1,
    kind: DocumentKind.Portfolio,
    metadata: {
        name: 'Test Portfolio',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        version: 1,
    },
    spec: {
        name: 'John Doe Portfolio',
        folderPath: '/Users/johndoe/Documents/portfolio',
        currency: 'USD',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastModified: '2024-01-01T00:00:00.000Z',
    },
};

/**
 * Mock asset documents
 */
export const mockAssets: Asset[] = [
    {
        apiVersion: ApiVersion.V1,
        kind: DocumentKind.Asset,
        metadata: {
            name: 'Checking Account',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            version: 1,
        },
        spec: {
            id: 'e9be8e40-3cc1-471a-8eee-692a913929cb',
            name: 'Chase Checking',
            type: AssetType.Cash,
            isLiquid: true,
            isArchived: false,
            createdAt: '2024-01-01T00:00:00.000Z',
        },
    },
    {
        apiVersion: ApiVersion.V1,
        kind: DocumentKind.Asset,
        metadata: {
            name: '401k Account',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            version: 1,
        },
        spec: {
            id: 'a1b2c3d4-e5f6-4789-a012-345678901234',
            name: 'Company 401k',
            type: AssetType.RetirementInvestment,
            isLiquid: false,
            isArchived: false,
            createdAt: '2024-01-01T00:00:00.000Z',
        },
    },
    {
        apiVersion: ApiVersion.V1,
        kind: DocumentKind.Asset,
        metadata: {
            name: 'Primary Residence',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            version: 1,
        },
        spec: {
            id: 'b2c3d4e5-f6a7-4890-b123-456789012345',
            name: 'Home',
            type: AssetType.Property,
            isLiquid: false,
            isArchived: false,
            createdAt: '2024-01-01T00:00:00.000Z',
        },
    },
];

/**
 * Mock liability documents
 */
export const mockLiabilities: Liability[] = [
    {
        apiVersion: ApiVersion.V1,
        kind: DocumentKind.Liability,
        metadata: {
            name: 'Credit Card',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            version: 1,
        },
        spec: {
            id: 'fce476f4-4942-432e-a294-36f8e63d2da9',
            name: 'Chase Sapphire',
            type: LiabilityType.CreditCard,
            isArchived: false,
            createdAt: '2024-01-01T00:00:00.000Z',
        },
    },
    {
        apiVersion: ApiVersion.V1,
        kind: DocumentKind.Liability,
        metadata: {
            name: 'Mortgage',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            version: 1,
        },
        spec: {
            id: 'c3d4e5f6-a7b8-4901-c234-567890123456',
            name: 'Home Mortgage',
            type: LiabilityType.Mortgage,
            isArchived: false,
            createdAt: '2024-01-01T00:00:00.000Z',
        },
    },
];

/**
 * Mock monthly snapshot documents
 */
export const mockMonthlySnapshots: MonthlySnapshot[] = [
    {
        apiVersion: ApiVersion.V1,
        kind: DocumentKind.MonthlySnapshot,
        metadata: {
            name: 'January 2024 Snapshot',
            createdAt: '2024-01-31T00:00:00.000Z',
            updatedAt: '2024-01-31T00:00:00.000Z',
            version: 1,
        },
        spec: {
            month: '2024-01',
            assetEntries: [
                {
                    id: '0befa50a-06da-498e-ba1d-da444002b4b0',
                    assetId: 'e9be8e40-3cc1-471a-8eee-692a913929cb',
                    value: 5000.00,
                },
                {
                    id: 'd4e5f6a7-b8c9-4012-d345-678901234567',
                    assetId: 'a1b2c3d4-e5f6-4789-a012-345678901234',
                    value: 75000.00,
                },
                {
                    id: 'e5f6a7b8-c9d0-4123-e456-789012345678',
                    assetId: 'b2c3d4e5-f6a7-4890-b123-456789012345',
                    value: 350000.00,
                },
            ],
            liabilityEntries: [
                {
                    id: '51441749-4654-488f-9439-be2f3c60c07d',
                    liabilityId: 'fce476f4-4942-432e-a294-36f8e63d2da9',
                    value: 2500.00,
                },
                {
                    id: 'ca13df02-d6a1-463d-ad3d-721ddab65777',
                    liabilityId: 'c3d4e5f6-a7b8-4901-c234-567890123456',
                    value: 280000.00,
                },
            ],
            createdAt: '2024-01-31T00:00:00.000Z',
            updatedAt: '2024-01-31T00:00:00.000Z',
        },
    },
    {
        apiVersion: ApiVersion.V1,
        kind: DocumentKind.MonthlySnapshot,
        metadata: {
            name: 'February 2024 Snapshot',
            createdAt: '2024-02-29T00:00:00.000Z',
            updatedAt: '2024-02-29T00:00:00.000Z',
            version: 1,
        },
        spec: {
            month: '2024-02',
            assetEntries: [
                {
                    id: 'b8c9d0e1-f2a3-4456-b789-012345678901',
                    assetId: 'e9be8e40-3cc1-471a-8eee-692a913929cb',
                    value: 5200.00,
                },
                {
                    id: 'c9d0e1f2-a3b4-4567-c890-123456789012',
                    assetId: 'a1b2c3d4-e5f6-4789-a012-345678901234',
                    value: 77500.00,
                },
                {
                    id: 'd0e1f2a3-b4c5-4678-d901-234567890123',
                    assetId: 'b2c3d4e5-f6a7-4890-b123-456789012345',
                    value: 352000.00,
                },
            ],
            liabilityEntries: [
                {
                    id: '19c340bf-8925-48c6-a47d-3055f615667e',
                    liabilityId: 'fce476f4-4942-432e-a294-36f8e63d2da9',
                    value: 2200.00,
                },
                {
                    id: '9ac93a76-9689-4a0c-a6d2-6b02ac293f58',
                    liabilityId: 'c3d4e5f6-a7b8-4901-c234-567890123456',
                    value: 279000.00,
                },
            ],
            createdAt: '2024-02-29T00:00:00.000Z',
            updatedAt: '2024-02-29T00:00:00.000Z',
        },
    },
];

/**
 * Mock financial calculation results
 */
export const mockFinancialTotals = {
    totalAssets: 430000.00,
    totalLiabilities: 282500.00,
    netWorth: 147500.00,
    liquidAssets: 5000.00,
    illiquidAssets: 425000.00,
    liquidNetWorth: -277500.00,
    assetsByType: {
        [AssetType.Cash]: 5000.00,
        [AssetType.RetirementInvestment]: 75000.00,
        [AssetType.Property]: 350000.00,
    },
    liabilitiesByType: {
        [LiabilityType.CreditCard]: 2500.00,
        [LiabilityType.Mortgage]: 280000.00,
    },
};