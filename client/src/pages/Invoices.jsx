import React, { useEffect, useState } from 'react';

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import PageHeader from '../components/PageHeader';
import CrudTable, { StatusChip } from '../components/CrudTable';
import api from '../services/api';
import { message } from '../utils/errors';
import { useAuth } from '../context/AuthContext';

export default function Invoices() {
  const { user } = useAuth();

  const canCreate = ['Admin', 'Sales'].includes(user?.role);

  const [data, setData] = useState({
    items: [],
    total: 0
  });

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    salesOrder: ''
  });

  const [error, setError] = useState('');

  const load = () => {
    api
      .get('/invoices', {
        params: {
          page
        }
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(message(err));
      });
  };

  useEffect(() => {
    load();

    api
      .get('/sales-orders', {
        params: {
          page: 1,
          limit: 100
        }
      })
      .then((res) => {
        setOrders(res.data.items || []);
      })
      .catch((err) => {
        setError(message(err));
      });
  }, [page]);

  const save = async () => {
    try {
      await api.post('/invoices', form);

      setOpen(false);

      setForm({
        salesOrder: ''
      });

      load();
    } catch (err) {
      setError(message(err));
    }
  };

  return (
    <>
      <PageHeader
        title="Invoices"
        subtitle="Manage customer invoices generated from sales orders"
        action={
          canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Create Invoice
            </Button>
          )
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <CrudTable
        columns={[
          {
            key: 'invoiceNumber',
            label: 'Invoice'
          },
          {
            key: 'salesOrder',
            label: 'Sales Order',
            render: (row) =>
              row.salesOrder?.orderNumber ||
              row.salesOrder?.orderNo ||
              '-'
          },
          {
            key: 'customer',
            label: 'Customer',
            render: (row) =>
              row.customer?.name ||
              row.salesOrder?.customer?.name ||
              '-'
          },
          {
            key: 'totalPrice',
            label: 'Total',
            render: (row) =>
              `₹${Number(
                row.totalPrice || row.total || 0
              ).toLocaleString()}`
          },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (
              <StatusChip status={row.status || 'Issued'} />
            )
          },
          {
            key: 'issuedDate',
            label: 'Issued',
            render: (row) =>
              row.issuedDate
                ? new Date(row.issuedDate).toLocaleDateString()
                : '-'
          }
        ]}
        rows={data.items}
        total={data.total}
        page={page}
        limit={10}
        onPageChange={setPage}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Invoice</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Sales Order</InputLabel>

              <Select
                value={form.salesOrder}
                label="Sales Order"
                onChange={(e) =>
                  setForm({
                    ...form,
                    salesOrder: e.target.value
                  })
                }
              >
                {orders
                  .filter(
                    (order) =>
                      order.status !== 'Cancelled'
                  )
                  .map((order) => (
                    <MenuItem
                      key={order._id}
                      value={order._id}
                    >
                      {order.orderNumber || order.orderNo}
                      {' · '}
                      {order.customer?.name || 'Customer'}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Select a sales order to generate its invoice.
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={save}
            disabled={!form.salesOrder}
          >
            Create Invoice
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}