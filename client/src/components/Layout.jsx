import React, { useState } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate
} from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { useAuth } from '../context/AuthContext';

const width = 250;

export default function Layout() {
  const [open, setOpen] = useState(true);
  const [anchor, setAnchor] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const items = [
    ['/dashboard', 'Dashboard', DashboardIcon],
    ['/products', 'Products', InventoryIcon],
    ['/customers', 'Customers', PeopleIcon],
    ['/suppliers', 'Suppliers', BusinessIcon],
    ['/sales-orders', 'Sales Orders', ShoppingCartIcon],
    ['/purchase-orders', 'Purchase Orders', LocalShippingIcon],
    ['/grn', 'GRN', ReceiptLongIcon],
    ['/invoices', 'Invoices', ReceiptLongIcon],
    ...(user?.role === 'Admin'
      ? [['/admin', 'User Management', AdminPanelSettingsIcon]]
      : [])
  ];

  const handleLogout = () => {
    setAnchor(null);
    logout();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#f5f7fb'
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1300,
          ml: open ? `${width}px` : 0,
          width: open ? `calc(100% - ${width}px)` : '100%'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setOpen(!open)}
            edge="start"
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              ml: 2,
              fontWeight: 700
            }}
          >
            ERP Management System
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            onClick={(event) => setAnchor(event.currentTarget)}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34
              }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={() => setAnchor(null)}
          >
            <MenuItem disabled>
              {user?.name} · {user?.role}
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width,
            boxSizing: 'border-box'
          }
        }}
      >
        <Toolbar />

        <Box
          sx={{
            p: 2,
            fontWeight: 800,
            fontSize: 18
          }}
        >
          ERP
        </Box>

        <List>
          {items.map(([path, label, Icon]) => (
            <ListItemButton
              key={path}
              selected={
                location.pathname === path ||
                location.pathname.startsWith(`${path}/`)
              }
              onClick={() => navigate(path)}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>

              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 11,
          minWidth: 0
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}