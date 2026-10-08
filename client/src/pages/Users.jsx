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
  Switch,
  TextField,
  FormControlLabel
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import PageHeader from '../components/PageHeader';
import CrudTable from '../components/CrudTable';
import api from '../services/api';
import { message } from '../utils/errors';

export default function Users() {
  const [users, setUsers] = useState([]);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    role: 'Sales',
    active: true
  });

  const [error, setError] = useState('');

  const load = () => {
    api
      .get('/users')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        setError(message(err));
      });
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({
      role: 'Sales',
      active: true
    });
  };

  const closeDialog = () => {
    setOpen(false);
    resetForm();
  };

  const save = async () => {
    try {
      if (form._id) {
        await api.put(`/users/${form._id}`, form);
      } else {
        await api.post('/users', form);
      }

      closeDialog();
      load();
    } catch (err) {
      setError(message(err));
    }
  };

  const del = async (row) => {
    if (!confirm(`Delete ${row.name}?`)) {
      return;
    }

    try {
      await api.delete(`/users/${row._id}`);
      load();
    } catch (err) {
      setError(message(err));
    }
  };

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Administer ERP accounts and roles"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
          >
            Add User
          </Button>
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
            key: 'name',
            label: 'Name'
          },
          {
            key: 'email',
            label: 'Email'
          },
          {
            key: 'role',
            label: 'Role'
          },
          {
            key: 'active',
            label: 'Status',
            render: (row) =>
              row.active ? 'Active' : 'Disabled'
          }
        ]}
        rows={users}
        total={users.length}
        page={1}
        limit={users.length || 10}
        onPageChange={() => {}}
        onEdit={(row) => {
          setForm({
            ...row,
            password: ''
          });
          setOpen(true);
        }}
        onDelete={del}
      />

      <Dialog
        open={open}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {form._id ? 'Edit' : 'Add'} User
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={form.name || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
              required
              fullWidth
            />

            <TextField
              label="Email"
              value={form.email || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
              type="email"
              required
              fullWidth
            />

            <TextField
              label={
                form._id
                  ? 'New password (optional)'
                  : 'Password'
              }
              value={form.password || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
              type="password"
              required={!form._id}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>

              <Select
                value={form.role || 'Sales'}
                label="Role"
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value
                  })
                }
              >
                {[
                  'Admin',
                  'Sales',
                  'Purchase',
                  'Inventory'
                ].map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={form.active !== false}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      active: e.target.checked
                    })
                  }
                />
              }
              label="Active"
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