import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Container } from '@mui/material';

export const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          `radial-gradient(ellipse at top, ${theme.palette.primary.dark}22, ${theme.palette.background.default})`,
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              backgroundColor: 'background.paper',
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Outlet />
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};
