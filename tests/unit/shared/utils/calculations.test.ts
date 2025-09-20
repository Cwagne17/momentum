import { calculateFinancialTotals } from '../../../../src/shared/utils/calculations';
import { MonthlySnapshotSchema } from '../../../../src/shared/types/monthly-snapshot';
import { calculateFinancialTotals } from '../../../../src/shared/utils/calculations';
import { calcMockAssets, calcMockLiabilities, calcMockSnapshot } from '../../../mocks/calculations-mock';

describe('calculateFinancialTotals', () => {
  it('calculates totals and breakdowns correctly', () => {
    // Ensure snapshot schema is valid
    expect(() => MonthlySnapshotSchema.parse(calcMockSnapshot)).not.toThrow();

    const totals = calculateFinancialTotals(calcMockSnapshot as any, calcMockAssets as any, calcMockLiabilities as any);

    expect(totals.totalAssets).toBe(50000);
    expect(totals.totalLiabilities).toBe(5000);
    expect(totals.netWorth).toBe(45000);
    expect(totals.liquidAssets).toBe(50000);
    expect(totals.illiquidAssets).toBe(0);
    expect(totals.liquidNetWorth).toBe(45000);
    expect(totals.assetsByType['Cash']).toBe(10000);
    expect(totals.assetsByType['Non-retirement Investment']).toBe(40000);
    expect(totals.liabilitiesByType['Credit Card']).toBe(5000);
  });
});
