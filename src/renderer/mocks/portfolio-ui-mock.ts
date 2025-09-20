import { ApiVersion, DocumentKind } from '../../shared/types/base-document';
import { AssetType } from '../../shared/types/asset';
import { LiabilityType } from '../../shared/types/liability';

export const uiMockAssets = [
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
      name: 'Brokerage',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      version: 1,
    },
    spec: {
      id: 'a1b2c3d4-e5f6-4789-a012-345678901234',
      name: 'Brokerage',
      type: AssetType.NonRetirementInvestment,
      isLiquid: true,
      isArchived: false,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  },
];

export const uiMockLiabilities = [
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
      name: 'Credit Card',
      type: LiabilityType.CreditCard,
      isArchived: false,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  },
];

export const uiMockSnapshots = [
  {
    apiVersion: ApiVersion.V1,
    kind: DocumentKind.MonthlySnapshot,
    metadata: {
      name: '2024-01',
      createdAt: '2024-01-31T00:00:00.000Z',
      updatedAt: '2024-01-31T00:00:00.000Z',
      version: 1,
    },
    spec: {
      month: '2024-01',
      assetEntries: [
        { id: 'ae1', assetId: 'e9be8e40-3cc1-471a-8eee-692a913929cb', value: 5000 },
        { id: 'ae2', assetId: 'a1b2c3d4-e5f6-4789-a012-345678901234', value: 75000 },
      ],
      liabilityEntries: [
        { id: 'le1', liabilityId: 'fce476f4-4942-432e-a294-36f8e63d2da9', value: 2500 },
      ],
      createdAt: '2024-01-31T00:00:00.000Z',
      updatedAt: '2024-01-31T00:00:00.000Z',
    },
  },
  {
    apiVersion: ApiVersion.V1,
    kind: DocumentKind.MonthlySnapshot,
    metadata: {
      name: '2024-02',
      createdAt: '2024-02-28T00:00:00.000Z',
      updatedAt: '2024-02-28T00:00:00.000Z',
      version: 1,
    },
    spec: {
      month: '2024-02',
      assetEntries: [
        { id: 'ae3', assetId: 'e9be8e40-3cc1-471a-8eee-692a913929cb', value: 5200 },
        { id: 'ae4', assetId: 'a1b2c3d4-e5f6-4789-a012-345678901234', value: 77500 },
      ],
      liabilityEntries: [
        { id: 'le2', liabilityId: 'fce476f4-4942-432e-a294-36f8e63d2da9', value: 2200 },
      ],
      createdAt: '2024-02-28T00:00:00.000Z',
      updatedAt: '2024-02-28T00:00:00.000Z',
    },
  },
];
