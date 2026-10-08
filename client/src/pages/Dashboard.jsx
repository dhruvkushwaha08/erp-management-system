import React, { useEffect, useState } from 'react';

import {
  Alert,
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Stack
} from '@mui/material';

import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import api from '../services/api';
import PageHeader from '../components/PageHeader';
import { message } from '../utils/errors';

const cards = [
  {
    key: 'products',
    label: 'Products',
    icon: InventoryIcon
  },
  {
    key: 'customers',
    label: 'Customers',
    icon: PeopleIcon
  },
  {
    key: 'salesOrders',
    label: 'Sales Orders',
    icon: ShoppingCartIcon
  },
  {
    key: 'invoices',
    label: 'Invoices',
    icon: ReceiptIcon
  }
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard')
      .then((response) => {
        setData(response.data);
        setError('');
      })
      .catch((err) => {
        setError(message(err));
      });
  }, []);

  if (!data && !error) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'grid',
          placeItems: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const counts = data?.counts || {};

  const lowStock = Array.isArray(data?.lowStock)
    ? data.lowStock
    : [];

  const revenue = Number(data?.revenue || 0);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Operational overview of your ERP workspace"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {data && (
        <>
          {/* Summary Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 2.5,
              mb: 3
            }}
          >
            {cards.map(({ key, label, icon: Icon }) => (
              <Card
                key={key}
                elevation={0}
                sx={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 3,
                  transition: '0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        fontWeight={500}
                      >
                        {label}
                      </Typography>

                      <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{ mt: 1 }}
                      >
                        {counts[key] ?? 0}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor: '#eef2ff'
                      }}
                    >
                      <Icon color="primary" />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Secondary Summary */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 2.5,
              mb: 3
            }}
          >
            <Card
              elevation={0}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 3
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      backgroundColor: '#fff7ed'
                    }}
                  >
                    <LocalShippingIcon color="warning" />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Purchase Orders
                    </Typography>

                    <Typography variant="h5" fontWeight={800}>
                      {counts.purchaseOrders ?? 0}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 3
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      backgroundColor: '#fef2f2'
                    }}
                  >
                    <WarningAmberIcon color="error" />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Low Stock Items
                    </Typography>

                    <Typography variant="h5" fontWeight={800}>
                      {lowStock.length}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 3
              }}
            >
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Invoice Value
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{ mt: 1 }}
                >
                  ₹{revenue.toLocaleString('en-IN')}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Non-cancelled invoices
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Main Dashboard Content */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'minmax(0, 2fr) minmax(280px, 1fr)',
              gap: 2.5,
              '@media(max-width:900px)': {
                gridTemplateColumns: '1fr'
              }
            }}
          >
            {/* Low Stock */}
            <Card
              elevation={0}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 3
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 2.5 }}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    Low Stock Products
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Products that need attention
                  </Typography>
                </Box>

                {lowStock.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Product</b>
                        </TableCell>

                        <TableCell>
                          <b>SKU</b>
                        </TableCell>

                        <TableCell>
                          <b>Stock</b>
                        </TableCell>

                        <TableCell>
                          <b>Reorder Level</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {lowStock.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            {product.title || '-'}
                          </TableCell>

                          <TableCell>
                            {product.sku || '-'}
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={product.stock ?? 0}
                              color="error"
                              size="small"
                            />
                          </TableCell>

                          <TableCell>
                            {product.reorderLevel ?? 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Box sx={{ p: 3 }}>
                    <Typography
                      color="text.secondary"
                      align="center"
                    >
                      No low-stock products.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Revenue Card */}
            <Card
              elevation={0}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Revenue Overview
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 3 }}
                >
                  Total Invoice Value
                </Typography>

                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{ mt: 1 }}
                >
                  ₹{revenue.toLocaleString('en-IN')}
                </Typography>

                <Chip
                  label="Non-cancelled invoices"
                  size="small"
                  sx={{ mt: 2 }}
                />

                <Box
                  sx={{
                    mt: 4,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#f8fafc'
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Keep your inventory, sales and
                    purchasing data up to date for
                    accurate reporting.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </>
      )}
    </>
  );
}