import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { authService } from '@services/authService';
import { getErrorMessage } from '@utils/helpers';
import { Button, TextField, Box, Typography, Link } from '@mui/material';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    try {
      await authService.forgotPassword(data.email);
      setIsSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to send reset email'));
    }
  };

  if (isSuccess) {
    return (
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Check Your Email
        </Typography>
        <Typography sx={{ mb: 3 }}>
          If an account exists for that email, you will receive reset instructions.
        </Typography>
        <Link component={RouterLink} to="/login" color="inherit">
          Back to Login
        </Link>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Forgot Password
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </Button>
      <Box sx={{ textAlign: 'center' }}>
        <Link component={RouterLink} to="/login" color="inherit">
          Back to Login
        </Link>
      </Box>
    </Box>
  );
};
