import React, { useMemo, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import { generateValidatedUUID } from '../../shared/utils/uuid';
import { AssetType } from '../../shared/types/asset';
import { LiabilityType } from '../../shared/types/liability';
import { uiMockAssets, uiMockLiabilities, uiMockSnapshots } from '../mocks/portfolio-ui-mock';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type PositionRow = {
  id: string;
  name: string;
  category: string;
  monthly: number[]; // length matches snapshots length
  // optional metadata
  type?: string;
  isLiquid?: boolean;
};

// Build initial rows from ui mock snapshots so values are traceable
function buildAssetRowsFromMocks(): PositionRow[] {
  const months = uiMockSnapshots.map(s => s.spec.month);
  return uiMockAssets.map(a => {
    const monthly = months.map(m => {
      const snap = uiMockSnapshots.find(s => s.spec.month === m);
      if (!snap) return 0;
      const entry = snap.spec.assetEntries.find((ae: any) => ae.assetId === a.spec.id);
      return entry ? entry.value : 0;
    });
    return { id: a.spec.id, name: a.spec.name, category: String(a.spec.type || 'Other'), monthly, type: String(a.spec.type), isLiquid: Boolean(a.spec.isLiquid) };
  });
}

function buildLiabilityRowsFromMocks(): PositionRow[] {
  const months = uiMockSnapshots.map(s => s.spec.month);
  return uiMockLiabilities.map(l => {
    const monthly = months.map(m => {
      const snap = uiMockSnapshots.find(s => s.spec.month === m);
      if (!snap) return 0;
      const entry = snap.spec.liabilityEntries.find((le: any) => le.liabilityId === l.spec.id);
      return entry ? entry.value : 0;
    });
    return { id: l.spec.id, name: l.spec.name, category: String(l.spec.type || 'Other'), monthly, type: String(l.spec.type) };
  });
}

const initialAssets: PositionRow[] = buildAssetRowsFromMocks();
const initialLiabilities: PositionRow[] = buildLiabilityRowsFromMocks();

export const Positions: React.FC<{ initialTab?: 'assets' | 'liabilities' }> = ({ initialTab }) => {
  const theme = useTheme();
  const [tab, setTab] = useState<'assets' | 'liabilities'>(initialTab || 'assets');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [assets, setAssets] = useState<PositionRow[]>(initialAssets);
  const [liabilities, setLiabilities] = useState<PositionRow[]>(initialLiabilities);

  // Add dialog
  const [openAdd, setOpenAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'asset' | 'liability'>('asset');
  const [newAssetType, setNewAssetType] = useState<AssetType>(AssetType.Cash);
  const [newIsLiquid, setNewIsLiquid] = useState<boolean>(true);
  const [newLiabilityType, setNewLiabilityType] = useState<LiabilityType>(LiabilityType.CreditCard);

  const currentData = tab === 'assets' ? assets : liabilities;
  const setCurrentData = (updater: (prev: PositionRow[]) => PositionRow[]) => {
    if (tab === 'assets') setAssets(prev => updater(prev));
    else setLiabilities(prev => updater(prev));
  };

  // Snapshot months from mocks
  const snapshotMonths = uiMockSnapshots.map(s => s.spec.month);

  // Selected snapshot index (defaults to latest)
  const [selectedSnapshotIndex, setSelectedSnapshotIndex] = useState<number>(Math.max(0, snapshotMonths.length - 1));

  // Compute total for selected snapshot
  const totalValue = useMemo(() => {
    return currentData.reduce((acc, row) => acc + (row.monthly[selectedSnapshotIndex] || 0), 0);
  }, [currentData, selectedSnapshotIndex]);

  function handleUpdateBalance(id: string, value: number) {
    setCurrentData(prev => prev.map(r => (r.id === id ? { ...r, monthly: r.monthly.map((m, i) => (i === selectedSnapshotIndex ? value : m)) } : r)));
  }

  function handleAdd() {
    if (!newName) return;
    const base: PositionRow = { id: generateValidatedUUID(), name: newName, category: '', monthly: new Array(snapshotMonths.length).fill(0) };
    if (newType === 'asset') {
      const row: PositionRow = { ...base, type: newAssetType, isLiquid: newIsLiquid };
      setAssets(a => [row, ...a]);
    } else {
      const row: PositionRow = { ...base, type: newLiabilityType };
      setLiabilities(l => [row, ...l]);
    }
    setOpenAdd(false);
    setNewName('');
    setNewAssetType(AssetType.Cash);
    setNewIsLiquid(true);
    setNewLiabilityType(LiabilityType.CreditCard);
  }

  function changeYear(delta: number) {
    setYear(y => y + delta);
  }

  return (
    <Box sx={{ pt: 6, pb: 8 }}>
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
        {tab === 'assets' ? 'Assets' : 'Liabilities'}
      </Typography>

      {/* Only show internal tabs when user didn't navigate directly from sidebar */}
      { !initialTab && (
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 4 }}>
          <Tab value="assets" label="Assets" />
          <Tab value="liabilities" label="Liabilities" />
        </Tabs>
      )}

      {/* Simplified header: total */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>Total {tab === 'assets' ? 'Assets' : 'Liabilities'}</Typography>
          <Typography variant="h4" sx={{ mt: 1, color: tab === 'assets' ? 'teal' : 'indianred', fontWeight: 700 }}>${Math.round(totalValue).toLocaleString()}</Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>Month: {snapshotMonths[selectedSnapshotIndex]}</Typography>
        </Box>

        {/* month selector */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField select size="small" value={selectedSnapshotIndex} onChange={(e) => setSelectedSnapshotIndex(Number(e.target.value))}>
            {snapshotMonths.map((m, i) => (
              <MenuItem key={m} value={i}>{m}</MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      <Typography variant="caption" sx={{ display: 'block', mb: 2, color: theme.palette.text.secondary }}>
        Data source: uiMockSnapshots (mock/demo data) — values are editable inline.
      </Typography>

      {/* YTD Editable Table */}
      <Card className="card">
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 220 }}>Name</TableCell>
                  <TableCell sx={{ minWidth: 180 }}>Type</TableCell>
                  {tab === 'assets' && <TableCell>Liquid</TableCell>}
                  <TableCell sx={{ minWidth: 120, textAlign: 'right' }}>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map(row => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ width: 220 }}>{row.name}</TableCell>
                    <TableCell sx={{ width: 180 }}>{row.type || '-'}</TableCell>
                    {tab === 'assets' && <TableCell>{row.isLiquid ? 'Yes' : 'No'}</TableCell>}
                    <TableCell sx={{ maxWidth: 160, padding: '6px 8px' }} align="right">
                      <TextField size="small" type="number" inputProps={{ style: { textAlign: 'right' } }} value={row.monthly[selectedSnapshotIndex] || 0} onChange={(e) => handleUpdateBalance(row.id, Number(e.target.value || 0))} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      {/* Floating Add Button */}
      <Box sx={{ position: 'fixed', right: 28, bottom: 28, zIndex: 1400 }}>
        <Button onClick={() => { setNewType(tab === 'assets' ? 'asset' : 'liability'); setOpenAdd(true); }} variant="contained" sx={{ borderRadius: '50%', width: 56, height: 56, minWidth: 56, boxShadow: '0 6px 18px rgba(3, 106, 140, 0.16)' }}>
          <i className="fa-solid fa-plus" />
        </Button>
      </Box>

      {/* Add Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
        <DialogTitle>{newType === 'asset' ? 'Add Asset' : 'Add Liability'}</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, mt: 1 }}>
            <TextField fullWidth label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} />

            {newType === 'asset' ? (
              <>
                <TextField label="Asset Type" select value={newAssetType} onChange={(e) => setNewAssetType(e.target.value as AssetType)}>
                  {Object.values(AssetType).map(v => <MenuItem value={v} key={v}>{v}</MenuItem>)}
                </TextField>
                <TextField label="Is Liquid" select value={String(newIsLiquid)} onChange={(e) => setNewIsLiquid(e.target.value === 'true')}>
                  <MenuItem value={'true'}>Yes</MenuItem>
                  <MenuItem value={'false'}>No</MenuItem>
                </TextField>
              </>
            ) : (
              <TextField label="Liability Type" select value={newLiabilityType} onChange={(e) => setNewLiabilityType(e.target.value as LiabilityType)}>
                {Object.values(LiabilityType).map(v => <MenuItem value={v} key={v}>{v}</MenuItem>)}
              </TextField>
            )}

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
