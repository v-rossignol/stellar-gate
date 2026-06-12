import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { Button, TextField, Box, Typography, Link } from '@mui/material';

const registerSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    email: z.preprocess(
      (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
      z.string().email('Invalid email address').optional(),
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { register: registerUser, error, clearError, isLoading } = useAuthStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.username, data.password, data.email);
      setIsSuccess(true);
    } catch {
      // Error surfaced via authStore
    }
  };

  if (isSuccess) {
    return (
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Account Created
        </Typography>
        <Typography sx={{ mb: 3 }}>
          You are now logged in. Continue to Galaxy when you are ready.
        </Typography>
        <Button fullWidth variant="contained" onClick={() => window.location.assign('/galaxy')}>
          Go to Galaxy
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create Account
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
        label="Email (optional)"
        fullWidth
        margin="normal"
        autoComplete="email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        autoComplete="new-password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        autoComplete="new-password"
        {...register('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting || isLoading ? 'Registering...' : 'Register'}
      </Button>
      <Box sx={{ textAlign: 'center' }}>
        <Link component={RouterLink} to="/login" color="inherit">
          Already have an account? Login
        </Link>
      </Box>
    </Box>
  );
};
