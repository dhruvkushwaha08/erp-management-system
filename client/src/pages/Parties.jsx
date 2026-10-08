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
  InputAdornment,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import PageHeader from '../components/PageHeader';
import CrudTable from '../components/CrudTable';
import api from '../services/api';
import { message } from '../utils/errors';
import { useAuth } from '../context/AuthContext';

export default function Parties({ type, title }) {
  const { user } = useAuth();

  const isCustomer = type === 'customers';

  const canEdit = isCustomer
    ? ['Admin', 'Sales'].includes(user?.role)
    : ['Admin', 'Purchase'].includes(user?.role);

  const canDelete = user?.role === 'Admin';

  const [data, setData] = useState({
    items: [],
    total: 0,
  });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setError('');

      const response = await api.get(`/${type}`, {
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
  }, [page, search, type]);

  const openAddDialog = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      address: '',
    });

    setError('');
    setOpen(true);
  };

  const openEditDialog = (row) => {
    setForm({
      ...row,
      name: row.name || '',
      email: row.email || '',
      phone: row.phone || '',
      address: row.address || '',
    });

    setError('');
    setOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;

    setOpen(false);

    setForm({
      name: '',
      email: '',
      phone: '',
      address: '',
    });
  };

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const save = async () => {
    if (!form.name.trim()) {
      setError(
        `${isCustomer ? 'Customer' : 'Supplier'} name is required.`
      );
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (form._id) {
        await api.put(`/${type}/${form._id}`, form);
      } else {
        await api.post(`/${type}`, form);
      }

      setOpen(false);

      setForm({
        name: '',
        email: '',
        phone: '',
        address: '',
      });

      await load();
    } catch (err) {
      setError(message(err));
    } finally {
      setSaving(false);
    }
  };

  const del = async (row) => {
    const entityName = isCustomer ? 'customer' : 'supplier';

    if (!window.confirm(`Delete ${entityName} "${row.name}"?`)) {
      return;
    }

    try {
      setError('');

      await api.delete(`/${type}/${row._id}`);

      await load();
    } catch (err) {
      setError(message(err));
    }
  };

  const entityName = isCustomer ? 'Customer' : 'Supplier';

  return (
    <>
      <PageHeader
        title={title}
        subtitle={`Manage your ${title.toLowerCase()} directory`}
        action={
          canEdit && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
            >
              Add {entityName}
            </Button>
          )
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack
        direction="row"
        sx={{
          mb: 2,
          width: '100%',
        }}
      >
        <TextField
          size="small"
          placeholder="Search name, email or phone"
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 360,
            maxWidth: '100%',
          }}
        />
      </Stack>

      <CrudTable
        columns={[
          {
            key: 'name',
            label: 'Name',
          },
          {
            key: 'email',
            label: 'Email',
          },
          {
            key: 'phone',
            label: 'Phone',
          },
          {
            key: 'address',
            label: 'Address',
          },
        ]}
        rows={data.items}
        total={data.total}
        page={page}
        limit={10}
        onPageChange={setPage}
        onEdit={canEdit ? openEditDialog : null}
        onDelete={canDelete ? del : null}
      />

      <Dialog
        open={open}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {form._id ? 'Edit' : 'Add'} {entityName}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              required
              autoFocus
            />

            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              fullWidth
            />

            <TextField
              label="Phone"
              value={form.phone}
              onChange={handleChange('phone')}
              fullWidth
            />

            <TextField
              label="Address"
              value={form.address}
              onChange={handleChange('address')}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={closeDialog}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={save}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}