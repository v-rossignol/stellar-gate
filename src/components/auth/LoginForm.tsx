import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { Button, TextField, Box, Typography, Link } from '@mui/material';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, logout, isAuthenticated, user, error, clearError, isLoading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
      window.location.assign('/galaxy');
    } catch {
      // Error surfaced via authStore
    }
  };

  if (isAuthenticated && user) {
    return (
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          StellarGate
        </Typography>
        <Typography sx={{ mb: 3 }}>Welcome back, {user.username}</Typography>
        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => window.location.assign('/galaxy')}
        >
          Go to Galaxy
        </Button>
        <Button fullWidth variant="outlined" onClick={() => void logout()} disabled={isLoading}>
          Logout
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        StellarGate
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        autoComplete="username"
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        autoComplete="current-password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting || isLoading ? 'Logging in...' : 'Login'}
      </Button>
      <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Link component={RouterLink} to="/register" color="inherit">
          Don&apos;t have an account? Register
        </Link>
        <Link component={RouterLink} to="/forgot-password" color="inherit" variant="body2">
          Forgot password?
        </Link>
      </Box>
    </Box>
  );
};
