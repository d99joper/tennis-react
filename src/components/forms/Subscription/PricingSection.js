import React, { useState, useContext } from 'react';
import {
  Box, Typography, Card, CardContent, CardActions,
  Button, Chip, ToggleButtonGroup, ToggleButton, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MdCheck, MdClose } from 'react-icons/md';
import { AuthContext } from 'contexts/AuthContext';
import { stripeAPI } from 'api/services';
import { loadStripe } from '@stripe/stripe-js';
import { Link } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const tiers = [
  {
    name: 'Free',
    key: 'free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Get started with the basics',
    features: [
      { text: 'Profile page & player communication', included: true },
      { text: 'View trophies and badges', included: true },
      { text: 'Join up to 5 events (lifetime)', included: true },
      { text: 'See last 3 matches played', included: true },
      { text: 'Unlimited events', included: false },
      { text: 'Full match history & filters', included: false },
      { text: 'Player stats & rivals', included: false },
      { text: 'Head-to-head comparisons', included: false },
      { text: 'Create clubs & events', included: false },
    ],
  },
  {
    name: 'Basic',
    key: 'basic',
    monthlyPrice: 2.99,
    yearlyPrice: 29.99,
    planIds: { month: 'basic_monthly', year: 'basic_yearly' },
    description: 'For the active player',
    popular: true,
    features: [
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
  },
  {
    name: 'Pro',
    key: 'pro',
    monthlyPrice: 5.99,
    yearlyPrice: 59.99,
    planIds: { month: 'pro_monthly', year: 'pro_yearly' },
    description: 'For club organizers',
    features: [
      { text: 'Everything in Basic', included: true },
      { text: 'Create up to 2 clubs', included: true },
      { text: 'Unlimited leagues & tournaments', included: true },
      { text: 'Automatic club ladder', included: true },
      { text: 'Charge participation fees', included: true },
      { text: 'Membership fees (coming soon)', included: true },
    ],
  },
];

const PricingSection = ({ currentTier = 'free' }) => {
  const theme = useTheme();
  const { isLoggedIn } = useContext(AuthContext);
  const [billingInterval, setBillingInterval] = useState('year');
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (tier) => {
    if (!isLoggedIn) return;
    const planId = tier.planIds?.[billingInterval];
    if (!planId) return;

    setLoading(tier.key);
    try {
      const response = await stripeAPI.createSubscription(planId);
      if (response.success && response.data.session_id) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: response.data.session_id });
      }
    } catch (err) {
      console.error('Error starting subscription:', err);
    } finally {
      setLoading(null);
    }
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
      children: loading === tier.key ? 'Loading...' : `Get ${tier.name}`,
      variant: 'contained',
    };
  };

  return (
    <Box>
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
    </Box>
  );
};

export default PricingSection;
