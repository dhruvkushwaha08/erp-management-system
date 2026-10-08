import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Stack
} from '@mui/material';

import { useAuth } from '../context/AuthContext';
import { message } from '../utils/errors';

export default function Login() {
  const [email, setEmail] = useState('admin@erp.local');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();

    setBusy(true);
    setError('');

    try {
      await login(email, password);

      navigate(
        location.state?.from?.pathname || '/dashboard',
        { replace: true }
      );
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: 2,
        background: 'linear-gradient(135deg, #eef2ff, #f8fafc)'
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 430
        }}
        elevation={6}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            gutterBottom
          >
            ERP Management
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Sign in to your business workspace
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={submit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                fullWidth
                required
              />

              <TextField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={busy}
              >
                {busy ? 'Signing in…' : 'Sign in'}
              </Button>
            </Stack>
          </form>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              mt: 3
            }}
          >
            Demo admin: admin@erp.local / Admin@123
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}