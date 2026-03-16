import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Typography, Card, CardContent, CardActions,
  Button, Chip, ToggleButtonGroup, ToggleButton, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MdCheck, MdClose } from 'react-icons/md';
import { AuthContext } from 'contexts/AuthContext';
import { subscriptionAPI, stripeAPI } from 'api/services';
import { Link } from 'react-router-dom';
import enums from 'helpers/const';
import SubscribePaymentDialog from './SubscribePaymentDialog';

const { SUBSCRIPTION_LIMITS: SL } = enums;

// Static feature lists per tier (features don't come from backend)
const tierFeatures = {
  free: [
    { text: 'Profile page & player communication', included: true },
    { text: 'View trophies and badges', included: true },
    { text: `Join up to ${SL.FREE_MAX_EVENTS} events (lifetime)`, included: true },
    { text: `See last ${SL.FREE_MAX_RECENT_MATCHES} matches played`, included: true },
    { text: 'Unlimited events', included: false },
    { text: 'Full match history & filters', included: false },
    { text: 'Player stats & rivals', included: false },
    { text: 'Head-to-head comparisons', included: false },
    { text: 'Create clubs & events', included: false },
  ],
  basic: [
    { text: 'Everything in Free', included: true },
    { text: 'Unlimited event entries', included: true },
    { text: 'Full match history & filters', included: true },
    { text: 'Head-to-head stats', included: true },
    { text: 'Player stats section', included: true },
    { text: 'Rivals section', included: true },
    { text: 'Create clubs & events', included: false },
    { text: 'Club ladder for members', included: false },
    { text: 'Charge participation fees', included: false },
  ],
  pro: [
    { text: 'Everything in Basic', included: true },
    { text: 'Create up to 2 clubs', included: true },
    { text: 'Unlimited leagues & tournaments', included: true },
    { text: 'Automatic club ladder', included: true },
    { text: 'Charge participation fees', included: true },
    { text: 'Membership fees (coming soon)', included: true },
  ],
};

const tierMeta = {
  free: { description: 'Get started with the basics' },
  basic: { description: 'For the active player', popular: true },
  pro: { description: 'For club organizers' },
};

const PricingSection = ({ currentTier = 'free' }) => {
  const theme = useTheme();
  const { isLoggedIn } = useContext(AuthContext);
  const [billingInterval, setBillingInterval] = useState('year');
  const [loading, setLoading] = useState(null);
  const [plans, setPlans] = useState(null);
  const [plansLoading, setPlansLoading] = useState(true);
  const [subscribeError, setSubscribeError] = useState(null);
  const [paymentClientSecret, setPaymentClientSecret] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedTierName, setSelectedTierName] = useState('');

  // Fetch plans from backend on mount
  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await subscriptionAPI.getPlans();
        if (Array.isArray(data)) {
          setPlans(data);
        } else if (data?.plans) {
          setPlans(data.plans);
        } else if (data?.results) {
          setPlans(data.results);
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setPlansLoading(false);
      }
    }
    fetchPlans();
  }, []);

  // Build tier cards from backend plans
  const tiers = React.useMemo(() => {
    const freeTier = {
      name: 'Free',
      key: 'free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: tierMeta.free.description,
      features: tierFeatures.free,
    };

    if (!plans || plans.length === 0) {
      return [freeTier];
    }

    // Group plans by name (basic, pro) and extract prices
    const grouped = {};
    for (const plan of plans) {
      const tier = (plan.name || plan.tier || '').toLowerCase();
      if (!grouped[tier]) {
        grouped[tier] = { monthlyPrice: 0, yearlyPrice: 0, planId: plan.id };
      }
      if (plan.price_monthly !== undefined) {
        grouped[tier].monthlyPrice = parseFloat(plan.price_monthly);
      }
      if (plan.price_yearly !== undefined) {
        grouped[tier].yearlyPrice = parseFloat(plan.price_yearly);
      }
    }

    const result = [freeTier];

    if (grouped.basic) {
      result.push({
        name: 'Basic',
        key: 'basic',
        planId: grouped.basic.planId,
        monthlyPrice: grouped.basic.monthlyPrice,
        yearlyPrice: grouped.basic.yearlyPrice,
        description: tierMeta.basic.description,
        popular: tierMeta.basic.popular,
        features: tierFeatures.basic,
      });
    }

    if (grouped.pro) {
      result.push({
        name: 'Pro',
        key: 'pro',
        planId: grouped.pro.planId,
        monthlyPrice: grouped.pro.monthlyPrice,
        yearlyPrice: grouped.pro.yearlyPrice,
        description: tierMeta.pro.description,
        features: tierFeatures.pro,
      });
    }

    return result;
  }, [plans]);

  const handleSubscribe = async (tier) => {
    if (!isLoggedIn) return;
    if (!tier.planId) return;

    const billingPeriod = billingInterval === 'year' ? 'yearly' : 'monthly';
    const isUpgrade = currentTier !== 'free';

    setLoading(tier.key);
    setSubscribeError(null);
    try {
      if (isUpgrade) {
        // User already has a subscription — update it (Stripe handles proration)
        const response = await stripeAPI.updateSubscription(tier.planId, billingPeriod);
        if (response.success) {
          // Reload so AuthContext re-fetches the updated subscription tier
          window.location.reload();
        } else {
          setSubscribeError(response.data?.error || 'Unable to update subscription. Please try again.');
        }
      } else {
        // New subscription from free tier — needs payment method collection
        const response = await stripeAPI.createSubscription(tier.planId, billingPeriod);
        if (response.success && response.data?.client_secret) {
          // Open the payment dialog to collect card details
          setPaymentClientSecret(response.data.client_secret);
          setSelectedTierName(tier.name);
          setPaymentDialogOpen(true);
        } else if (response.success && response.data?.session_id) {
          // Fallback: redirect to Stripe Checkout session
          const { loadStripe } = await import('@stripe/stripe-js');
          const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
          await stripe.redirectToCheckout({ sessionId: response.data.session_id });
        } else {
          setSubscribeError(response.data?.error || 'Unable to start subscription. Please try again.');
        }
      }
    } catch (err) {
      console.error('Error subscribing:', err);
      setSubscribeError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handlePaymentDialogClose = () => {
    setPaymentDialogOpen(false);
    setPaymentClientSecret(null);
    setSelectedTierName('');
  };

  const getButtonProps = (tier) => {
    if (tier.key === currentTier) {
      return { disabled: true, children: 'Current Plan', variant: 'outlined' };
    }
    if (tier.key === 'free') {
      return { disabled: true, children: 'Free', variant: 'outlined' };
    }
    if (!isLoggedIn) {
      return {
        component: Link, to: '/registration',
        children: `Get ${tier.name}`, variant: 'contained'
      };
    }
    return {
      onClick: () => handleSubscribe(tier),
      disabled: loading === tier.key,
      children: loading === tier.key
        ? 'Loading...'
        : currentTier !== 'free' ? `Upgrade to ${tier.name}` : `Get ${tier.name}`,
      variant: 'contained',
    };
  };

  return (
    <Box>
      <SubscribePaymentDialog
        open={paymentDialogOpen}
        onClose={handlePaymentDialogClose}
        clientSecret={paymentClientSecret}
        planName={selectedTierName}
      />
      {subscribeError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubscribeError(null)}>
          {subscribeError}
        </Alert>
      )}
      {plansLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <ToggleButtonGroup
          value={billingInterval}
          exclusive
          onChange={(e, val) => val && setBillingInterval(val)}
          size="small"
        >
          <ToggleButton value="month">Monthly</ToggleButton>
          <ToggleButton value="year">
            Yearly
            <Chip label="Save ~17%" size="small" color="success" sx={{ ml: 1 }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        justifyContent: 'center',
        alignItems: { xs: 'center', md: 'stretch' },
      }}>
        {tiers.map((tier) => {
          const price = billingInterval === 'year' ? tier.yearlyPrice : tier.monthlyPrice;
          const isPopular = tier.popular;
          const isCurrent = tier.key === currentTier;

          return (
            <Card
              key={tier.key}
              variant="outlined"
              sx={{
                width: { xs: '100%', md: 320 },
                maxWidth: 360,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: isPopular
                  ? `2px solid ${theme.palette.primary.main}`
                  : isCurrent
                    ? `2px solid ${theme.palette.success.main || '#4caf50'}`
                    : `1px solid ${theme.palette.divider}`,
              }}
            >
              {isPopular && (
                <Chip
                  label="Most Popular"
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute', top: -12, left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1, pt: isPopular ? 4 : 2 }}>
                <Typography variant="h5" fontWeight={600}>
                  {tier.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {tier.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {price === 0 ? (
                    <Typography variant="h4" fontWeight={700}>Free</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                      <Typography variant="h4" fontWeight={700}>
                        ${price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        /{billingInterval === 'year' ? 'year' : 'month'}
                      </Typography>
                    </Box>
                  )}
                  {billingInterval === 'year' && tier.monthlyPrice > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      That&apos;s ${(tier.yearlyPrice / 12).toFixed(2)}/month
                    </Typography>
                  )}
                </Box>
                <List dense>
                  {tier.features.map((feature, i) => (
                    <ListItem key={i} disablePadding sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {feature.included
                          ? <MdCheck color={theme.palette.primary.main} size={18} />
                          : <MdClose color={theme.palette.text.disabled} size={18} />
                        }
                      </ListItemIcon>
                      <ListItemText
                        primary={feature.text}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: feature.included ? 'text.primary' : 'text.disabled',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  size="large"
                  color="primary"
                  {...getButtonProps(tier)}
                />
              </CardActions>
            </Card>
          );
        })}
      </Box>
        </>
      )}
    </Box>
  );
};

export default PricingSection;
