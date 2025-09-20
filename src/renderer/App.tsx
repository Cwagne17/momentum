import React, { useState } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Positions } from './pages/Positions';

function App() {
  const [screen, setScreen] = useState<'dashboard' | 'assets' | 'liabilities' | 'settings'>('dashboard');
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const drawerWidth = collapsed ? 72 : 260;

  return (
    <Box className="flex h-screen bg-slate-50">
      <CssBaseline />
      <Sidebar collapsed={collapsed} current={screen} onNavigate={(s) => setScreen(s as any)} onToggle={() => setCollapsed((c) => !c)} />

      <Box component="main" sx={{ flex: 1, ml: `${drawerWidth}px`, overflow: 'auto', transition: 'margin-left 240ms ease' }}>
        <Container maxWidth="lg" sx={{ pt: 6 }}>
          {screen === 'dashboard' && <Dashboard />}
          {screen === 'assets' && <Positions initialTab="assets" />}
          {screen === 'liabilities' && <Positions initialTab="liabilities" />}
          {screen === 'settings' && <div>Settings (WIP)</div>}
        </Container>
      </Box>
    </Box>
  );
}

export default App;
