import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MdLock } from 'react-icons/md';
import { Link } from 'react-router-dom';

/**
 * LockedFeature - Displays a lock overlay with subscription upgrade messaging
 * @param {string} featureName - Name of the locked feature
 * @param {string} requiredTier - 'basic' or 'pro'
 * @param {string} description - Description of what the feature offers
 * @param {React.ReactNode} children - Optional children to render behind the lock
 */
const LockedFeature = ({ featureName, requiredTier = 'basic', description, children }) => {
  const theme = useTheme();

  const tierLabel = requiredTier === 'pro' ? 'Pro' : 'Basic';
  const tierColor = requiredTier === 'pro' ? theme.palette.secondary.main : theme.palette.primary.main;

  return (
    <Box sx={{ position: 'relative', minHeight: 200 }}>
      {children && (
        <Box sx={{ filter: 'blur(3px)', opacity: 0.3, pointerEvents: 'none' }}>
          {children}
        </Box>
      )}
      <Paper
        elevation={0}
        sx={{
          position: children ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 4,
          backgroundColor: children ? 'rgba(255,255,255,0.85)' : 'transparent',
          borderRadius: 2,
        }}
      >
        <MdLock size={48} color={tierColor} />
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
          {featureName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 400 }}>
          {description || `This feature is available with a ${tierLabel} subscription or higher.`}
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/subscription"
          sx={{
            mt: 2,
            backgroundColor: tierColor,
            '&:hover': { backgroundColor: tierColor, opacity: 0.9 },
          }}
        >
          Upgrade to {tierLabel}
        </Button>
      </Paper>
    </Box>
  );
};

export default LockedFeature;
