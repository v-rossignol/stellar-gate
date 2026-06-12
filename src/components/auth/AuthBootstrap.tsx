import { useEffect, type ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '@stores/authStore';

interface AuthBootstrapProps {
  children: ReactNode;
}

export const AuthBootstrap = ({ children }: AuthBootstrapProps) => {
  const { restoreSession, isInitializing } = useAuthStore();

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  if (isInitializing) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};
