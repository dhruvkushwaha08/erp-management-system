import React, { useEffect, useState } from 'react';

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import PageHeader from '../components/PageHeader';
import CrudTable from '../components/CrudTable';
import api from '../services/api';
import { message } from '../utils/errors';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const { user } = useAuth();

  const canEdit = ['Admin', 'Inventory', 'Purchase'].includes(user?.role);
  const canDelete = ['Admin', 'Inventory'].includes(user?.role);

  const [data, setData] = useState({
    items: [],
    total: 0,
  });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');

      const response = await api.get('/products', {
        params: {
          page,
          search,
        },
      });

      setData(response.data);
    } catch (err) {
      setError(message(err));
    }
  };

  useEffect(() => {
    load();
  }, [page, search]);

  const openAddDialog = () => {
    setForm({
      title: '',
      sku: '',
      price: 0,
      stock: 0,
      reorderLevel: 0,
      description: '',
    });

    setOpen(true);
  };

  const openEditDialog = (product) => {
    setForm({
      ...product,
    });

    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setForm({});
  };

  const handleChange = (field, value) => {
    const numericFields = ['price', 'stock', 'reorderLevel'];

    setForm((previous) => ({
      ...previous,
      [field]: numericFields.includes(field)
        ? Number(value)
        : value,
    }));
  };

  const save = async () => {
    try {
      setError('');

      if (!form.title || !form.sku) {
        setError('Product title and SKU are required.');
        return;
      }

      if (form._id) {
        await api.put(`/products/${form._id}`, form);
      } else {
        await api.post('/products', form);
      }

      closeDialog();
      await load();
    } catch (err) {
      setError(message(err));
    }
  };

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Delete ${product.title}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      await api.delete(`/products/${product._id}`);

      await load();
    } catch (err) {
      setError(message(err));
    }
  };

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Manage catalogue, stock and reorder levels"
        action={
          canEdit && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
            >
              Add Product
            </Button>
          )
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search title or SKU"
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          InputProps={{
            startAdornment: (
              <SearchIcon
                sx={{
                  mr: 1,
                  color: 'text.secondary',
                }}
              />
            ),
          }}
        />
      </Stack>

      <CrudTable
        columns={[
          {
            key: 'title',
            label: 'Product',
          },
          {
            key: 'sku',
            label: 'SKU',
          },
          {
            key: 'price',
            label: 'Price',
            render: (row) =>
              `₹${Number(row.price || 0).toLocaleString()}`,
          },
          {
            key: 'stock',
            label: 'Stock',
          },
          {
            key: 'reorderLevel',
            label: 'Reorder Level',
          },
        ]}
        rows={data.items}
        total={data.total}
        page={page}
        limit={10}
        onPageChange={setPage}
        onEdit={canEdit ? openEditDialog : null}
        onDelete={canDelete ? deleteProduct : null}
      />

      <Dialog
        open={open}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {form._id ? 'Edit Product' : 'Add Product'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={form.title ?? ''}
              onChange={(event) =>
                handleChange('title', event.target.value)
              }
              required
              fullWidth
            />

            <TextField
              label="SKU"
              value={form.sku ?? ''}
              onChange={(event) =>
                handleChange('sku', event.target.value)
              }
              required
              fullWidth
            />

            <TextField
              label="Price"
              type="number"
              value={form.price ?? 0}
              onChange={(event) =>
                handleChange('price', event.target.value)
              }
              required
              fullWidth
              inputProps={{
                min: 0,
              }}
            />

            <TextField
              label="Opening Stock"
              type="number"
              value={form.stock ?? 0}
              onChange={(event) =>
                handleChange('stock', event.target.value)
              }
              required
              fullWidth
              inputProps={{
                min: 0,
              }}
            />

            <TextField
              label="Reorder Level"
              type="number"
              value={form.reorderLevel ?? 0}
              onChange={(event) =>
                handleChange('reorderLevel', event.target.value)
              }
              required
              fullWidth
              inputProps={{
                min: 0,
              }}
            />

            <TextField
              label="Description"
              multiline
              rows={3}
              value={form.description ?? ''}
              onChange={(event) =>
                handleChange('description', event.target.value)
              }
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={save}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}