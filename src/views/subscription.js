import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Typography, Card, CardContent, Button,
  CircularProgress, Alert, Chip, Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from 'contexts/AuthContext';
import { subscriptionAPI, stripeAPI } from 'api/services';
import PricingSection from 'components/forms/Subscription/PricingSection';
import ManageBillingModal from 'components/forms/Subscription/ManageBillingModal';
import { Link } from 'react-router-dom';
import { flexColumn } from 'styles/componentStyles';

const SubscriptionPage = () => {
  const theme = useTheme();
  const { user, isLoggedIn } = useContext(AuthContext);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [billingModalOpen, setBillingModalOpen] = useState(false);

  const currentTier = user?.isProSubscriber ? 'pro' : user?.isBasicSubscriber ? 'basic' : 'free';

  useEffect(() => {
    async function fetchSubscription() {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }
      try {
        const data = await subscriptionAPI.getPlayerSubscription();
        if (data?.is_active) {
          setSubscription(data);
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscription();
  }, [isLoggedIn]);

  const handleManageSubscription = () => setBillingModalOpen(true);

  const handleCancelSubscription = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await stripeAPI.cancelSubscription();
      if (result.success) {
        setSubscription(prev => ({ ...prev, cancel_at_period_end: true }));
        setBillingModalOpen(false);
      } else {
        setError('Failed to cancel subscription. Please try again.');
      }
    } catch (err) {
      setError('Error canceling subscription.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await stripeAPI.reactivateSubscription();
      if (result.success) {
        setSubscription(prev => ({ ...prev, cancel_at_period_end: false }));
        setBillingModalOpen(false);
      } else {
        setError('Failed to reactivate subscription. Please try again.');
      }
    } catch (err) {
      setError('Error reactivating subscription.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ ...flexColumn, gap: 4, maxWidth: 1200, mx: 'auto' }}>
      <Helmet>
        <title>Subscription | MyTennis Space</title>
      </Helmet>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Choose Your Plan
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Unlock the full potential of My Tennis Space. Whether you play for fun or
          organize events, we have a plan for you.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mx: 'auto', maxWidth: 600 }}>{error}</Alert>}

      {/* Manage billing modal */}
      <ManageBillingModal
        open={billingModalOpen}
        onClose={() => setBillingModalOpen(false)}
        subscription={subscription}
        onCancel={handleCancelSubscription}
        onReactivate={handleReactivateSubscription}
        actionLoading={actionLoading}
      />

      {/* Current subscription summary card */}
      {isLoggedIn && subscription && (
        <Card variant="outlined" sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="h6">Your Subscription</Typography>
              <Chip
                label={subscription.plan?.name || currentTier}
                color={subscription.cancel_at_period_end ? 'warning' : 'primary'}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {subscription.status_message || (subscription.is_active ? 'Active' : 'Inactive')}
            </Typography>
            {subscription.current_period_end && (
              <Typography variant="body2" color="text.secondary">
                {subscription.cancel_at_period_end
                  ? `Cancels on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                  : `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`}
              </Typography>
            )}
            <Divider sx={{ my: 2 }} />
            <Button variant="outlined" onClick={handleManageSubscription}>
              Manage Billing
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoggedIn && (
        <Alert severity="info" sx={{ mx: 'auto', maxWidth: 600 }}>
          <Typography variant="body2">
            <Link to="/login">Log in</Link> or <Link to="/registration">create an account</Link> to
            subscribe and unlock all features.
          </Typography>
        </Alert>
      )}

      <PricingSection currentTier={currentTier} />

      {/* Feature comparison summary */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Why Subscribe?
        </Typography>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3, justifyContent: 'center', mt: 2,
        }}>
          <FeatureHighlight
            title="Track Everything"
            description="Full match history, detailed stats, and head-to-head comparisons to improve your game."
            theme={theme}
          />
          <FeatureHighlight
            title="Compete More"
            description="Join unlimited events — leagues, tournaments, and socials at clubs near you."
            theme={theme}
          />
          <FeatureHighlight
            title="Build Community"
            description="Create clubs, organize events, and build your local tennis community."
            theme={theme}
          />
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Questions? Check our <Link to="/faq">FAQ page</Link> for more information.
        </Typography>
      </Box>
    </Box>
  );
};

const FeatureHighlight = ({ title, description, theme }) => (
  <Card variant="outlined" sx={{ maxWidth: 300, width: '100%', textAlign: 'center' }}>
    <CardContent>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

export default SubscriptionPage;
