import { MonthlySnapshot } from '../types/monthly-snapshot';
import { Asset } from '../types/asset';
import { Liability } from '../types/liability';
import { FinancialTotals } from '../types/calculations';

/**
 * Calculates financial totals for a given monthly snapshot using asset/liability definitions.
 *
 * Grounding:
 * - Implements calculations per .kiro/specs/momentum-net-worth-tracker/requirements.md (Requirement 3)
 * - Follows data model in .builder/rules/03-data-model.mdc
 */
export function calculateFinancialTotals(
  snapshot: MonthlySnapshot,
  assets: Asset[],
  liabilities: Liability[]
): FinancialTotals {
  const assetMap = new Map<string, Asset>();
  for (const a of assets) {
    assetMap.set(a.spec.id, a);
  }

  const liabilityMap = new Map<string, Liability>();
  for (const l of liabilities) {
    liabilityMap.set(l.spec.id, l);
  }

  let totalAssets = 0;
  let totalLiabilities = 0;
  let liquidAssets = 0;

  const assetsByType: Record<string, number> = {};
  const liabilitiesByType: Record<string, number> = {};

  for (const entry of snapshot.spec.assetEntries) {
    const value = Number(entry.value) || 0;
    totalAssets += value;

    const asset = assetMap.get(entry.assetId);
    const type = asset ? asset.spec.type : 'Unknown';
    const isArchived = asset ? asset.spec.isArchived : false;
    const isLiquid = asset ? asset.spec.isLiquid : false;

    if (!isArchived) {
      assetsByType[type] = (assetsByType[type] || 0) + value;
      if (isLiquid) {
        liquidAssets += value;
      }
    }
  }

  for (const entry of snapshot.spec.liabilityEntries) {
    const value = Number(entry.value) || 0;
    totalLiabilities += value;

    const liability = liabilityMap.get(entry.liabilityId);
    const type = liability ? liability.spec.type : 'Unknown';
    const isArchived = liability ? liability.spec.isArchived : false;

    if (!isArchived) {
      liabilitiesByType[type] = (liabilitiesByType[type] || 0) + value;
    }
  }

  const illiquidAssets = totalAssets - liquidAssets;
  const netWorth = totalAssets - totalLiabilities;
  const liquidNetWorth = liquidAssets - totalLiabilities;

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    liquidAssets,
    illiquidAssets,
    liquidNetWorth,
    assetsByType,
    liabilitiesByType,
  };
}
