import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Container, Typography } from '@mui/material';

const backgroundUrl = `${import.meta.env.BASE_URL}images/stellar-gate.avif`;

export const AuthLayout = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Box
        component="img"
        src={backgroundUrl}
        alt=""
        aria-hidden
        sx={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          background: (theme) =>
            `radial-gradient(ellipse at top, ${theme.palette.primary.dark}33, transparent 55%)`,
          backgroundColor: (theme) => `${theme.palette.background.default}66`,
        }}
      />
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          py: 1.5,
          px: 3,
          textAlign: 'left',
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="subtitle2"
          component="p"
          sx={{
            color: 'common.white',
            fontWeight: 600,
            letterSpacing: '0.04em',
            m: 0,
          }}
        >
          Infinity&apos;s Stellar Gate
        </Typography>
      </Box>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              backgroundColor: (theme) => `${theme.palette.background.paper}cc`,
              backdropFilter: 'blur(8px)',
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
