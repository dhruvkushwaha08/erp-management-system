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
  TextField,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import PageHeader from '../components/PageHeader';
import CrudTable, { StatusChip } from '../components/CrudTable';
import api from '../services/api';
import { message } from '../utils/errors';
import { useAuth } from '../context/AuthContext';

export default function Orders({ type, title }) {
  const isSales = type === 'sales';

  const { user } = useAuth();

  const canCreate = isSales
    ? ['Admin', 'Sales'].includes(user.role)
    : ['Admin', 'Purchase'].includes(user.role);

  const [data, setData] = useState({
    items: [],
    total: 0
  });

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [parties, setParties] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    items: []
  });

  const [error, setError] = useState('');

  const base = isSales ? 'sales-orders' : 'purchase-orders';

  const load = () => {
    api
      .get(`/${base}`, {
        params: { page }
      })
      .then((r) => setData(r.data))
      .catch((e) => setError(message(e)));
  };

  useEffect(() => {
    load();

    api
      .get(isSales ? '/customers' : '/suppliers', {
        params: { limit: 100 }
      })
      .then((r) => setParties(r.data.items || []))
      .catch((e) => setError(message(e)));

    api
      .get('/products', {
        params: { limit: 100 }
      })
      .then((r) => setProducts(r.data.items || []))
      .catch((e) => setError(message(e)));
  }, [page, type]);

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...(form.items || []),
        {
          product: '',
          quantity: 1,
          unitPrice: 0
        }
      ]
    });
  };

  const save = async () => {
    try {
      await api.post(`/${base}`, form);

      setOpen(false);

      setForm({
        items: []
      });

      load();
    } catch (e) {
      setError(message(e));
    }
  };

  const complete = async (row) => {
    try {
      await api.post(`/sales-orders/${row._id}/complete`);
      load();
    } catch (e) {
      setError(message(e));
    }
  };

  return (
    <>
      <PageHeader
        title={title}
        subtitle={
          isSales
            ? 'Customer sales and fulfillment'
            : 'Supplier purchasing and receiving'
        }
        action={
          canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Create Order
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
            key: 'orderNumber',
            label: 'Order'
          },
          {
            key: isSales ? 'customer' : 'supplier',
            label: isSales ? 'Customer' : 'Supplier',
            render: (r) =>
              r[isSales ? 'customer' : 'supplier']?.name || '-'
          },
          {
            key: 'totalPrice',
            label: 'Total',
            render: (r) =>
              `₹${Number(r.totalPrice || 0).toLocaleString()}`
          },
          {
            key: 'status',
            label: 'Status',
            render: (r) => <StatusChip status={r.status} />
          }
        ]}
        rows={data.items}
        total={data.total}
        page={page}
        limit={10}
        onPageChange={setPage}
      />

      {isSales && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 2 }}
        >
          To create an invoice, complete a sales order first.
        </Typography>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Create {isSales ? 'Sales' : 'Purchase'} Order
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>
                {isSales ? 'Customer' : 'Supplier'}
              </InputLabel>

              <Select
                value={form[isSales ? 'customer' : 'supplier'] || ''}
                label={isSales ? 'Customer' : 'Supplier'}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [isSales ? 'customer' : 'supplier']: e.target.value
                  })
                }
              >
                {parties.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {form.items.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 140px 40px',
                  gap: 1,
                  alignItems: 'center'
                }}
              >
                <FormControl>
                  <InputLabel>Product</InputLabel>

                  <Select
                    value={item.product}
                    label="Product"
                    onChange={(e) => {
                      const arr = [...form.items];

                      const product = products.find(
                        (x) => x._id === e.target.value
                      );

                      arr[i] = {
                        ...arr[i],
                        product: e.target.value,
                        unitPrice: product?.price || 0
                      };

                      setForm({
                        ...form,
                        items: arr
                      });
                    }}
                  >
                    {products.map((p) => (
                      <MenuItem key={p._id} value={p._id}>
                        {p.title} · ₹{p.price}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Qty"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const arr = [...form.items];

                    arr[i] = {
                      ...arr[i],
                      quantity: Number(e.target.value)
                    };

                    setForm({
                      ...form,
                      items: arr
                    });
                  }}
                />

                <TextField
                  label="Unit Price"
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => {
                    const arr = [...form.items];

                    arr[i] = {
                      ...arr[i],
                      unitPrice: Number(e.target.value)
                    };

                    setForm({
                      ...form,
                      items: arr
                    });
                  }}
                />

                <IconButton
                  color="error"
                  onClick={() =>
                    setForm({
                      ...form,
                      items: form.items.filter(
                        (_, x) => x !== i
                      )
                    })
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Button onClick={addItem}>
              + Add item
            </Button>

            <TextField
              label="Notes"
              multiline
              rows={2}
              value={form.notes || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value
                })
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={save}
          >
            Create Order
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}