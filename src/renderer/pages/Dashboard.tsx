import React, { useMemo, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, useTheme, Button, Stack } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { uiMockAssets, uiMockLiabilities, uiMockSnapshots } from '../mocks/portfolio-ui-mock';
import { calculateFinancialTotals } from '../../shared/utils/calculations';

export const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [range, setRange] = useState<'YTD'|'1Y'|'3Y'|'5Y'|'ALL'>('YTD');

  // Build time series from snapshots
  const snapshots = uiMockSnapshots.slice(); // ascending by time

  // helper to parse 'YYYY-MM' to Date
  const parseMonth = (m: string) => {
    const [y, mm] = m.split('-').map(Number);
    return new Date(y, mm - 1, 1);
  };

  const filteredSnapshots = useMemo(() => {
    if (range === 'ALL') return snapshots;
    const now = new Date(snapshots[snapshots.length - 1] ? parseMonth(snapshots[snapshots.length - 1].spec.month) : new Date());

    if (range === 'YTD') {
      return snapshots.filter(s => parseMonth(s.spec.month).getFullYear() === now.getFullYear());
    }

    const monthsBack = range === '1Y' ? 12 : range === '3Y' ? 36 : range === '5Y' ? 60 : 12;
    const cutoff = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 1);
    return snapshots.filter(s => parseMonth(s.spec.month) >= cutoff);
  }, [range, snapshots]);

  const trendDates = filteredSnapshots.map(s => s.spec.month);
  const netWorthValues = filteredSnapshots.map(s => calculateFinancialTotals(s as any, uiMockAssets as any, uiMockLiabilities as any).netWorth);

  const latest = uiMockSnapshots[uiMockSnapshots.length - 1];
  const totalsLatest = calculateFinancialTotals(latest as any, uiMockAssets as any, uiMockLiabilities as any);

  const assetsByType = totalsLatest.assetsByType || {};
  const liabilitiesByType = totalsLatest.liabilitiesByType || {};

  const assetsPie = Object.entries(assetsByType).map(([k,v]) => ({ name: k, value: v }));
  const liabilitiesPie = Object.entries(liabilitiesByType).map(([k,v]) => ({ name: k, value: v }));

  // compact stats
  const netWorth = totalsLatest.netWorth;
  const liquidNetWorth = totalsLatest.liquidNetWorth;
  const totalAssets = totalsLatest.totalAssets;
  const totalLiabilities = totalsLatest.totalLiabilities;

  return (
    <Box sx={{ pt: 4, pb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h3">Dashboard</Typography>
        <Stack direction="row" spacing={1}>
          {(['YTD','1Y','3Y','5Y','ALL'] as const).map(r => (
            <Button key={r} variant={r === range ? 'contained' : 'outlined'} onClick={() => setRange(r)}>{r}</Button>
          ))}
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card className="card">
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>Net Worth</Typography>
              <Typography variant="h4" sx={{ mt: 1, color: theme.palette.primary.main, fontWeight: 700 }}>${netWorth.toLocaleString()}</Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>Liquid: ${liquidNetWorth.toLocaleString()}</Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Assets: ${totalAssets.toLocaleString()} • Liabilities: ${totalLiabilities.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="card">
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>Assets Breakdown</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <PieChart series={[{ data: assetsPie.map(p => p.value) }]} labels={assetsPie.map(p => p.name)} width={200} height={120} />
                </Box>
                <Box sx={{ flex: '1 1 160px' }}>
                  {assetsPie.map(p => (
                    <Typography key={p.name} variant="body2">{p.name}: ${Math.round(p.value).toLocaleString()}</Typography>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="card">
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>Liabilities Breakdown</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <PieChart series={[{ data: liabilitiesPie.map(p => p.value) }]} labels={liabilitiesPie.map(p => p.name)} width={200} height={120} />
                </Box>
                <Box sx={{ flex: '1 1 160px' }}>
                  {liabilitiesPie.map(p => (
                    <Typography key={p.name} variant="body2">{p.name}: ${Math.round(p.value).toLocaleString()}</Typography>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card className="card">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Net Worth Trend</Typography>
          <Box sx={{ height: 320 }}>
            <LineChart
              width={900}
              height={320}
              series={[{ data: netWorthValues, label: 'Net Worth', color: theme.palette.primary.main }]}
              xAxis={[{ scaleType: 'point', data: trendDates }]}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
