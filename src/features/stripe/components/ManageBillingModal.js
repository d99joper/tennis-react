import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Chip, Divider, Alert,
  CircularProgress, Button, Skeleton, Link, Table,
  TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaCreditCard } from 'react-icons/fa';
import { MdOpenInNew, MdPictureAsPdf } from 'react-icons/md';
import MyModal from 'shared/components/layout/MyModal';
import { stripeAPI } from 'api/services';

const CARD_ICONS = {
  visa: FaCcVisa,
  mastercard: FaCcMastercard,
  amex: FaCcAmex,
  discover: FaCcDiscover,
};

const CardIcon = ({ brand, size = 28 }) => {
  const Icon = CARD_ICONS[brand?.toLowerCase()] || FaCreditCard;
  return <Icon size={size} />;
};

const InfoRow = ({ label, value, children }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    {children ?? <Typography variant="body2" fontWeight={500}>{value}</Typography>}
  </Box>
);

/**
 * Modal showing current subscription details and payment method.
 * Props:
 *   open          – boolean
 *   onClose       – () => void
 *   subscription  – subscription object from subscriptionAPI.getPlayerSubscription()
 *   onCancel      – () => void  called when user confirms cancellation
 *   onReactivate  – () => void  called when user reactivates
 *   actionLoading – boolean
 */
const ManageBillingModal = ({
  open,
  onClose,
  subscription,
  onCancel,
  onReactivate,
  actionLoading,
}) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [pmLoading, setPmLoading] = useState(false);
  const [pmError, setPmError] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (!open || !subscription) return;
    let cancelled = false;

    async function fetchPM() {
      setPmLoading(true);
      setPmError(null);
      const result = await stripeAPI.getPaymentMethod();
      if (cancelled) return;
      if (result.success) {
        setPaymentMethod(result.data.payment_method ?? null);
        setInvoices(result.data.invoices ?? []);
      } else {
        setPmError('Could not load billing details.');
      }
      setPmLoading(false);
    }

    fetchPM();
    return () => { cancelled = true; };
  }, [open, subscription]);

  // Reset confirm state when modal closes
  useEffect(() => {
    if (!open) setConfirmCancel(false);
  }, [open]);

  if (!subscription) return null;

  const planName = subscription.plan?.name || '—';
  const billingPeriod = subscription.billing_period === 'yearly' ? 'Yearly' : 'Monthly';
  const isCancelling = subscription.cancel_at_period_end;

  const fmt = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  return (
    <MyModal
      showHide={open}
      onClose={onClose}
      title="Manage Billing"
      minWidth="560px"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>

        {/* Plan */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>Current Plan</Typography>
          <Chip
            label={planName}
            color={isCancelling ? 'warning' : 'primary'}
            size="small"
          />
        </Box>

        {isCancelling && (
          <Alert severity="warning" sx={{ mb: 1 }}>
            Cancels on {fmt(subscription.current_period_end)}. You keep access until then.
          </Alert>
        )}

        <Divider />

        {/* Billing details */}
        <InfoRow label="Billing cycle" value={billingPeriod} />
        <InfoRow label="Current period started" value={fmt(subscription.current_period_start)} />
        <InfoRow
          label={isCancelling ? 'Access until' : 'Next billing date'}
          value={fmt(subscription.current_period_end)}
        />
        {subscription.days_remaining != null && (
          <InfoRow
            label={isCancelling ? 'Days of access remaining' : 'Days until renewal'}
            value={String(subscription.days_remaining)}
          />
        )}

        <Divider sx={{ mt: 1 }} />

        {/* Payment method */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1.5, mb: 0.5 }}>
          Payment Method
        </Typography>

        {pmLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
            <Skeleton variant="rectangular" width={36} height={24} />
            <Skeleton width={140} />
          </Box>
        ) : pmError ? (
          <Typography variant="body2" color="text.secondary">{pmError}</Typography>
        ) : paymentMethod ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
            <CardIcon brand={paymentMethod.brand} />
            <Typography variant="body2">
              <Box component="span" sx={{ textTransform: 'capitalize' }}>
                {paymentMethod.brand}
              </Box>
              {' '}ending in <strong>{paymentMethod.last4}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
              Expires {paymentMethod.exp_month}/{paymentMethod.exp_year}
            </Typography>
          </Box>
        ) : null}

        <Divider sx={{ mt: 1 }} />

        {/* Invoice history */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1.5, mb: 0.5 }}>
          Invoice History
        </Typography>

        {pmLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {[1, 2, 3].map(i => <Skeleton key={i} height={32} />)}
          </Box>
        ) : invoices.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No invoices found.</Typography>
        ) : (
          <Table size="small" sx={{ mt: 0.5 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, pl: 0 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, pr: 0 }} align="right">Links</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map(inv => (
                <TableRow key={inv.id} sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell sx={{ pl: 0 }}>
                    {new Date(inv.created * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    {inv.amount_paid > 0
                      ? `$${(inv.amount_paid / 100).toFixed(2)}`
                      : <Typography variant="body2" color="text.secondary">—</Typography>}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={inv.status}
                      size="small"
                      color={inv.status === 'paid' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 0, whiteSpace: 'nowrap' }}>
                    {inv.hosted_invoice_url && (
                      <Link href={inv.hosted_invoice_url} target="_blank" rel="noreferrer" sx={{ mr: 1, display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
                        <MdOpenInNew size={14} /> View
                      </Link>
                    )}
                    {inv.invoice_pdf && (
                      <Link href={inv.invoice_pdf} target="_blank" rel="noreferrer" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
                        <MdPictureAsPdf size={14} /> PDF
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Divider sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          {isCancelling ? (
            <Button
              variant="contained"
              color="primary"
              onClick={onReactivate}
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={16} /> : null}
            >
              Reactivate Subscription
            </Button>
          ) : confirmCancel ? (
            <>
              <Typography variant="body2" color="error" sx={{ width: '100%' }}>
                Are you sure? You will keep access until {fmt(subscription.current_period_end)}.
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => { setConfirmCancel(false); onCancel(); }}
                disabled={actionLoading}
                startIcon={actionLoading ? <CircularProgress size={16} /> : null}
              >
                Yes, cancel
              </Button>
              <Button variant="outlined" onClick={() => setConfirmCancel(false)} disabled={actionLoading}>
                Keep subscription
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setConfirmCancel(true)}
              disabled={actionLoading}
            >
              Cancel Subscription
            </Button>
          )}
        </Box>

      </Box>
    </MyModal>
  );
};

export default ManageBillingModal;
