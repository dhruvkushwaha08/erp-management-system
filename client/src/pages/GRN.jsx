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
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import PageHeader from '../components/PageHeader';
import CrudTable from '../components/CrudTable';
import api from '../services/api';
import { message } from '../utils/errors';
import { useAuth } from '../context/AuthContext';

export default function GRN() {
  const { user } = useAuth();

  const can = ['Admin', 'Inventory', 'Purchase'].includes(user?.role);

  const [data, setData] = useState({
    items: [],
    total: 0,
  });

  const [pos, setPos] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    purchaseOrder: '',
    items: [],
  });

  const [error, setError] = useState('');

  const load = () => {
    api
      .get('/grn')
      .then((r) => setData(r.data))
      .catch((e) => setError(message(e)));
  };

  useEffect(() => {
    load();

    api
      .get('/purchase-orders', {
        params: {
          limit: 100,
        },
      })
      .then((r) => setPos(r.data.items || []))
      .catch((e) => setError(message(e)));
  }, []);

  const choose = (id) => {
    const po = pos.find((x) => x._id === id);

    setForm({
      purchaseOrder: id,
      items:
        po?.items?.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })) || [],
    });
  };

  const save = async () => {
    try {
      await api.post('/grn', form);

      setOpen(false);

      setForm({
        purchaseOrder: '',
        items: [],
      });

      load();
    } catch (e) {
      setError(message(e));
    }
  };

  const closeDialog = () => {
    setOpen(false);

    setForm({
      purchaseOrder: '',
      items: [],
    });
  };

  return (
    <>
      <PageHeader
        title="Goods Receipt Notes"
        subtitle="Receive goods against purchase orders"
        action={
          can && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Create GRN
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
            key: 'grnNumber',
            label: 'GRN',
          },
          {
            key: 'purchaseOrder',
            label: 'Purchase Order',
            render: (row) => row.purchaseOrder?.orderNumber || '-',
          },
          {
            key: 'receivedDate',
            label: 'Received',
            render: (row) =>
              row.receivedDate
                ? new Date(row.receivedDate).toLocaleDateString()
                : '-',
          },
          {
            key: 'receivedBy',
            label: 'Received By',
            render: (row) => row.receivedBy?.name || '-',
          },
        ]}
        rows={data.items}
        total={data.total}
        page={1}
        limit={10}
        onPageChange={() => {}}
      />

      <Dialog
        open={open}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create GRN</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Purchase Order</InputLabel>

              <Select
                value={form.purchaseOrder}
                label="Purchase Order"
                onChange={(e) => choose(e.target.value)}
              >
                {pos
                  .filter((p) => p.status !== 'Cancelled')
                  .map((p) => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.orderNumber} · {p.supplier?.name || 'Supplier'}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            {form.items.map((item, i) => (
              <TextField
                key={i}
                label={`${
                  item.product?.title || 'Product'
                } quantity received`}
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const arr = [...form.items];

                  arr[i] = {
                    ...arr[i],
                    quantity: Number(e.target.value),
                  };

                  setForm({
                    ...form,
                    items: arr,
                  });
                }}
                helperText="Cannot exceed ordered quantity"
                fullWidth
              />
            ))}

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Creating the GRN increases product stock and marks
              the purchase order as received.
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={save}
            disabled={!form.purchaseOrder}
          >
            Receive Goods
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}