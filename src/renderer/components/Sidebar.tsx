import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
  IconButton,
  Divider,
  Box,
  Tooltip,
  Typography,
} from '@mui/material';

interface SidebarProps {
  collapsed?: boolean;
  current: string;
  onNavigate: (screen: string) => void;
  onToggle?: () => void;
}

const IconSvg: React.FC<{ name: string; color?: string }> = ({ name, color }) => {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z" fill={color} />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...common}>
          <path d="M7 11h10v8H7z" fill={color} />
          <path d="M3 7h2V5a1 1 0 0 1 1-1h2v2h6V4h2a1 1 0 0 1 1 1v2h2v14H3V7z" fill={color} />
        </svg>
      );
    case 'list':
      return (
        <svg {...common}>
          <path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z" fill={color} />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common}>
          <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill={color} />
          <path d="M19.4 12.9a7.9 7.9 0 0 0 0-1.8l2.1-1.6-2-3.4-2.5 1a8 8 0 0 0-1.5-.9L15 2h-6l-.5 2.2c-.5.2-1 .5-1.5.9l-2.5-1L2 9.5l2.1 1.6a7.9 7.9 0 0 0 0 1.8L2 14.5 4 18l2.5-1c.5.4 1 .7 1.5.9L9 22h6l.5-2.2c.5-.2 1-.5 1.5-.9l2.5 1L22 14.5l-2.6-1.6z" fill={color} opacity="0.6" />
        </svg>
      );
    default:
      return <svg {...common}><rect width="20" height="20" fill={color} /></svg>;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, current, onNavigate, onToggle }) => {
  const theme = useTheme();
  const width = collapsed ? 72 : 260;

  return (
    <Drawer
      variant="permanent"
      open
      PaperProps={{
        className: 'app-sidebar',
        sx: {
          width,
          transition: 'width 240ms ease',
          boxSizing: 'border-box',
          background: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary.dark,
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', px: 2, minHeight: 80 }}>
        {!collapsed ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1, background: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 0.3 }}>Momentum</Typography>
          </Box>
        ) : (
          <Box />
        )}

        <IconButton size="small" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} sx={{ color: '#fff' }}>
          <i className={`fa-solid ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`} />
        </IconButton>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      <List sx={{ width: '100%', p: 1 }}>
        <ListItemButton
          selected={current === 'dashboard'}
          onClick={() => onNavigate('dashboard')}
          sx={{
            borderRadius: 1,
            mb: 0.5,
            color: '#fff',
            '&.Mui-selected': { background: 'rgba(255,255,255,0.06)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 48, justifyContent: 'center', color: '#fff' }}>
            <i className="fa-solid fa-chart-line" style={{ fontSize: 18 }} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Dashboard" />}
        </ListItemButton>

        <ListItemButton
          selected={current === 'assets'}
          onClick={() => onNavigate('assets')}
          sx={{ borderRadius: 1, mb: 1.2, py: 1.25, color: '#fff', '&.Mui-selected': { background: 'rgba(255,255,255,0.06)' } }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 56, justifyContent: 'center', color: '#fff' }}>
            <i className="fa-solid fa-coins" style={{ fontSize: 18 }} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Assets" sx={{ ml: 1 }} />}
        </ListItemButton>

        <ListItemButton
          selected={current === 'liabilities'}
          onClick={() => onNavigate('liabilities')}
          sx={{ borderRadius: 1, mb: 1.2, py: 1.25, color: '#fff', '&.Mui-selected': { background: 'rgba(255,255,255,0.06)' } }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 56, justifyContent: 'center', color: '#fff' }}>
            <i className="fa-solid fa-hand-holding-dollar" style={{ fontSize: 18 }} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Liabilities" sx={{ ml: 1 }} />}
        </ListItemButton>

        <ListItemButton
          selected={current === 'settings'}
          onClick={() => onNavigate('settings')}
          sx={{ borderRadius: 1, mb: 0.5, color: '#fff', '&.Mui-selected': { background: 'rgba(255,255,255,0.06)' } }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 48, justifyContent: 'center', color: '#fff' }}>
            <i className="fa-solid fa-gear" style={{ fontSize: 18 }} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Settings" />}
        </ListItemButton>
      </List>
    </Drawer>
  );
};
