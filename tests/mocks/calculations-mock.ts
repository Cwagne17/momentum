import { AssetType } from '../../src/shared/types/asset';
import { LiabilityType } from '../../src/shared/types/liability';
import { ApiVersion, DocumentKind } from '../../src/shared/types/base-document';
import { generateValidatedUUID } from '../../src/shared/utils/uuid';

const asset1Id = generateValidatedUUID();
const asset2Id = generateValidatedUUID();
const liability1Id = generateValidatedUUID();

export const calcMockAssets = [
  {
    apiVersion: ApiVersion.V1,
    kind: DocumentKind.Asset,
    metadata: {
      name: 'Cash Account',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
    spec: {
      id: asset1Id,
      name: 'Cash Account',
      type: AssetType.Cash,
      isLiquid: true,
      isArchived: false,
      createdAt: new Date().toISOString(),
    },
  },
  {
    apiVersion: ApiVersion.V1,
    kind: DocumentKind.Asset,
    metadata: {
      name: 'Brokerage',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
    spec: {
      id: asset2Id,
      name: 'Brokerage',
      type: AssetType.NonRetirementInvestment,
      isLiquid: true,
      isArchived: false,
      createdAt: new Date().toISOString(),
    },
  },
];

export const calcMockLiabilities = [
  {
    apiVersion: ApiVersion.V1,
    kind: DocumentKind.Liability,
    metadata: {
      name: 'Credit Card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
    spec: {
      id: liability1Id,
      name: 'Credit Card',
      type: LiabilityType.CreditCard,
      isArchived: false,
      createdAt: new Date().toISOString(),
    },
  },
];

export const calcMockSnapshot = {
  apiVersion: ApiVersion.V1,
  kind: DocumentKind.MonthlySnapshot,
  metadata: {
    name: 'snapshot-2024-06',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  },
  spec: {
    month: '2024-06',
    assetEntries: [
      { id: generateValidatedUUID(), assetId: asset1Id, value: 10000 },
      { id: generateValidatedUUID(), assetId: asset2Id, value: 40000 },
    ],
    liabilityEntries: [{ id: generateValidatedUUID(), liabilityId: liability1Id, value: 5000 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};
