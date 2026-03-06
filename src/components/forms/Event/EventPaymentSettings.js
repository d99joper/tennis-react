import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
  Chip, Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MdMonetizationOn, MdDeleteOutline, MdSave, MdWarning, MdCheckCircle } from 'react-icons/md';
import { billableItemAPI, stripeAPI } from 'api/services';
import { flexColumn, flexRow } from 'styles/componentStyles';
import { useSnackbar } from 'contexts/snackbarContext';
import { displayRefundPolicy } from 'helpers';
import RefundPolicySelect from 'components/forms/Stripe/RefundPolicySelect';

const EventPaymentSettings = ({ event, division = null }) => {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();

  const [stripeStatus, setStripeStatus] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(true);
  const [billableItem, setBillableItem] = useState(null);
  const [itemLoading, setItemLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [refundPolicy, setRefundPolicy] = useState('no_refunds');

  const clubId = event?.club?.id;
  const isDivisionScope = !!division;

  useEffect(() => {
    if (!clubId) { setStripeLoading(false); return; }
    stripeAPI.getClubConnectStatus(clubId).then((res) => {
      if (res.success) setStripeStatus(res.data);
      setStripeLoading(false);
    });
  }, [clubId]);

  useEffect(() => {
    if (!event?.id) { setItemLoading(false); return; }
    // Reset form when scope changes
    setBillableItem(null);
    setName(''); setAmount(''); setDescription(''); setRefundPolicy('no_refunds');
    setItemLoading(true);
    billableItemAPI.getEventBillableItems(event.id).then((res) => {
      if (res.success) {
        const raw = res.data;
        const items = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.results)
            ? raw.results
            : Array.isArray(raw?.data)
              ? raw.data
              : [];
        // Filter to the right scope: division-level or event-level
        const item = isDivisionScope
          ? items.find((i) => i.target_type === 'division' && i.target_id === division.id) || null
          : items.find((i) => i.target_type === 'event' || !i.target_type) || null;
        setBillableItem(item);
        if (item) {
          setName(item.name || '');
          setAmount(item.amount ?? '');
          setDescription(item.description || '');
          setRefundPolicy(item.refund_policy || 'no_refunds');
        }
      }
      setItemLoading(false);
    });
  }, [event?.id, division?.id, isDivisionScope]);

  const stripeConnected = stripeStatus?.is_active && stripeStatus?.details_submitted;

  const handleSave = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      showSnackbar('Please enter a valid price', 'error');
      return;
    }
    setSaving(true);
    try {
      const data = {
        name: name || (isDivisionScope ? `${division.name} Entry Fee` : 'Entry Fee'),
        amount: parseFloat(amount),
        description,
        refund_policy: refundPolicy,
        event_id: event.id,
        ...(isDivisionScope && { division_id: division.id }),
      };
      const res = billableItem?.id
        ? await billableItemAPI.updateBillableItem(billableItem.id, data)
        : await billableItemAPI.createBillableItem(data);
      if (res.success) {
        // update response may be nested under res.data.data
        const saved = res.data?.id ? res.data : res.data?.data ?? res.data;
        setBillableItem(saved);
        setName(saved.name || '');
        setAmount(saved.amount ?? '');
        setDescription(saved.description || '');
        setRefundPolicy(saved.refund_policy || 'no_refunds');
        showSnackbar('Entry fee saved', 'success');
      } else {
        showSnackbar(res.data?.error || 'Failed to save entry fee', 'error');
      }
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!billableItem?.id) return;
    setRemoving(true);
    try {
      const res = await billableItemAPI.deleteBillableItem(billableItem.id);
      if (res.success) {
        setBillableItem(null);
        setName(''); setAmount(''); setDescription(''); setRefundPolicy('no_refunds');
        showSnackbar('Entry fee removed', 'success');
      } else {
        showSnackbar('Failed to remove entry fee', 'error');
      }
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setRemoving(false);
    }
  };

  if (stripeLoading || itemLoading) return <CircularProgress size={24} />;

  return (
    <Box sx={{ ...flexColumn, gap: theme.spacing(3) }}>
      <Typography variant="h6">
        {isDivisionScope ? `Payment Settings — ${division.name}` : 'Payment Settings'}
      </Typography>
      {isDivisionScope && (
        <Alert severity="info" sx={{ py: 0.5 }}>
          A division fee overrides the event-level fee for players joining this division.
          If no division fee is set, the event-level fee applies.
        </Alert>
      )}

      {/* Stripe account status row */}
      <Box sx={{ ...flexRow, alignItems: 'center', gap: theme.spacing(1), flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">Payment Account:</Typography>
        {!clubId ? (
          <Chip label="No club associated" size="small" />
        ) : stripeConnected ? (
          <Chip
            label={stripeStatus.account_name || stripeStatus.account_email || 'Connected'}
            size="small" color="success"
            icon={<MdCheckCircle />}
          />
        ) : (
          <Chip label="Not connected" size="small" color="warning" icon={<MdWarning />} />
        )}
      </Box>

      {!stripeConnected && (
        <Alert severity="warning">
          This club does not have a payment account connected. Set up a Stripe account in{' '}
          <strong>Club Settings → Payments</strong> before enabling paid events.
        </Alert>
      )}

      <Divider />

      {/* Current fee summary */}
      {billableItem ? (
        <Box sx={{ ...flexRow, alignItems: 'center', gap: theme.spacing(1), flexWrap: 'wrap' }}>
          <MdMonetizationOn size={18} color={theme.palette.success.main} />
          <Typography variant="body2" fontWeight={600}>
            Current entry fee: ${parseFloat(billableItem.amount).toFixed(2)}
          </Typography>
          {billableItem.name && billableItem.name !== 'Entry Fee' && (
            <Chip label={billableItem.name} size="small" />
          )}
          {billableItem.description && (
            <Typography variant="caption" color="text.secondary">
              — {billableItem.description}
            </Typography>
          )}
          {billableItem.refund_policy && (
            <Box sx={{ ...flexRow, alignItems: 'center', gap: theme.spacing(0.5), mt: theme.spacing(0.5) }}>
              <Typography variant="caption" color="text.secondary" fontStyle="italic">
                Refund policy: {displayRefundPolicy(billableItem.refund_policy)}
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {isDivisionScope
            ? 'No division fee set — the event-level fee applies (or free if none).'
            : 'No entry fee set — this event is free to join.'}
        </Typography>
      )}

      <Divider />

      {/* Inline editor */}
      <Box sx={{ ...flexColumn, gap: theme.spacing(2) }}>
        <Typography variant="subtitle2" color={stripeConnected ? 'text.primary' : 'text.disabled'}>
          {billableItem ? 'Update Entry Fee' : 'Set Entry Fee'}
        </Typography>
        <TextField
          label="Name" placeholder="Entry Fee"
          value={name} onChange={(e) => setName(e.target.value)}
          disabled={!stripeConnected || saving} size="small" fullWidth
        />
        <TextField
          label="Price ($)" type="number"
          slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          value={amount} onChange={(e) => setAmount(e.target.value)}
          onWheel={(e) => e.target.blur()}
          disabled={!stripeConnected || saving} size="small" fullWidth
        />
        <TextField
          label="Description" placeholder="What does this fee cover?"
          value={description} onChange={(e) => setDescription(e.target.value)}
          disabled={!stripeConnected || saving}
          size="small" multiline rows={2} fullWidth
        />
        <RefundPolicySelect
          value={refundPolicy}
          onChange={setRefundPolicy}
          disabled={!stripeConnected || saving}
        />
        <Box sx={{ ...flexRow, gap: theme.spacing(1), flexWrap: 'wrap' }}>
          <Button
            variant="contained" color="primary"
            onClick={handleSave}
            disabled={!stripeConnected || saving || !amount}
            startIcon={saving ? <CircularProgress size={14} /> : <MdSave size={16} />}
          >
            {saving ? 'Saving...' : billableItem ? 'Update' : 'Save Entry Fee'}
          </Button>
          {billableItem && (
            <Button
              variant="outlined" color="error"
              onClick={handleRemove} disabled={removing}
              startIcon={removing ? <CircularProgress size={14} /> : <MdDeleteOutline size={16} />}
            >
              {removing ? 'Removing...' : 'Remove Entry Fee'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EventPaymentSettings;