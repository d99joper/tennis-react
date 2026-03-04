import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FaUsers, FaTrophy, FaMale, FaFemale, FaStar, FaCalendar } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import JoinRequest from '../Notifications/joinRequests';

const CARD_DESCRIPTION_MAX_LENGTH = 100;

const DivisionCard = ({
  division,
  event,
  isSelected = false,
  isEnrolled = false,
  onClick,
  onSignUpSuccess,
  userMeetsRequirements = true
}) => {
  const theme = useTheme();

  // Calculate spots info
  const maxParticipants = division.content_object?.max_participants || 0;
  const currentParticipants = division.participant_count || 0;
  const spotsLeft = maxParticipants - currentParticipants;
  const isFull = maxParticipants > 0 && currentParticipants >= maxParticipants;
  const fillPercentage = maxParticipants > 0 ? (currentParticipants / maxParticipants) * 100 : 0;

  // Division override settings
  const overrideSettings = division.override_settings || {};

  // Check if registration is closed (event has started)
  const startDate = division.start_date || division.content_object?.start_date || event.start_date;
  const hasStarted = startDate && new Date(startDate) < new Date();

  // Determine card state - use division override for open registration if available
  const isOpenRegistration = overrideSettings.is_open_registration !== undefined
    ? overrideSettings.is_open_registration
    : event.is_open_registration;
  const canSignUp = userMeetsRequirements && !isFull && !hasStarted && isOpenRegistration;

  // Get restriction display - division override_settings.restrictions take priority
  const restrictions = overrideSettings.restrictions && Object.keys(overrideSettings.restrictions).length > 0
    ? overrideSettings.restrictions
    : (division.restrictions || event.restrictions || {});

  return (
    <Card
      sx={{
        width: '100%', // Fill Grid container width
        height: '100%', // Fill parent Grid height
        display: 'flex',
        flexDirection: 'column',
        border: 2,
        borderColor: isSelected
          ? 'primary.main'
          : isEnrolled
            ? 'success.main'
            : 'divider',
        bgcolor: isSelected
          ? theme.palette.primary.light
          : isEnrolled
            ? `${theme.palette.success.main}20` // 20% opacity green
            : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: isEnrolled ? 'success.main' : 'primary.main',
          transform: 'translateY(-2px)',
          boxShadow: 4
        },
        position: 'relative',
        overflow: 'visible'
      }}
      onClick={onClick}
    >
      {/* Status badges (top right) */}
      <Box
        sx={{
          position: 'absolute',
          top: -8,
          right: 12,
          display: 'flex',
          gap: 0.5,
          zIndex: 1
        }}
      >
        {isEnrolled && (
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              bgcolor: 'success.main',
              color: 'success.contrastText',
              fontWeight: 600,
              fontSize: '0.75rem',
              boxShadow: 2
            }}
          >
            ✓ ENROLLED
          </Box>
        )}
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor: isFull ? 'error.main' : hasStarted ? 'grey.600' : (spotsLeft <= 3 && spotsLeft > 0) ? 'warning.main' : 'success.main',
            color: isFull ? 'error.contrastText' : hasStarted ? 'white' : (spotsLeft <= 3 && spotsLeft > 0) ? 'warning.contrastText' : 'success.contrastText',
            fontWeight: 600,
            fontSize: '0.75rem',
            boxShadow: 2
          }}
        >
          {isFull ? 'FULL' : hasStarted ? 'CLOSED' : spotsLeft <= 3 && spotsLeft > 0 ? `${spotsLeft} LEFT` : 'OPEN'}
        </Box>
      </Box>

      <CardContent sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        pt: 3,
        minHeight: 0 // Allow content to shrink
      }}>
        {/* Division name */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          {division.name}
        </Typography>

        {/* Division description */}
        {division.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {division.description.length > CARD_DESCRIPTION_MAX_LENGTH
              ? division.description.substring(0, CARD_DESCRIPTION_MAX_LENGTH) + '...'
              : division.description}
          </Typography>
        )}

        {/* Type badge */}
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <Chip
            label={division.type}
            size="small"
            sx={{
              textTransform: 'capitalize',
              bgcolor: 'action.hover',
              fontWeight: 500
            }}
          />
          {(division.content_object?.match_type || event.match_type) && (
            <Chip
              label={division.content_object?.match_type || event.match_type}
              size="small"
              sx={{
                textTransform: 'capitalize',
                bgcolor: 'primary.light',
                color: 'primary.main',
                fontWeight: 500
              }}
            />
          )}
        </Box>

        {/* Capacity info */}
        {maxParticipants > 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <FaTrophy size={14} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="text.secondary">
                {currentParticipants} / {maxParticipants} spots filled
              </Typography>
            </Box>
            {/* Progress bar */}
            <Box
              sx={{
                width: '100%',
                height: 6,
                bgcolor: 'action.hover',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: `${fillPercentage}%`,
                  height: '100%',
                  bgcolor: isFull ? 'error.main' : fillPercentage > 80 ? 'warning.main' : 'success.main',
                  transition: 'width 0.3s'
                }}
              />
            </Box>
          </Box>
        )}

        {/* Restrictions - fixed height container to prevent layout shift */}
        <Box sx={{ minHeight: 32 }}>
          {Object.keys(restrictions).length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {restrictions.rating && (
                <Tooltip title={`NTRP ${restrictions.rating.value}+`}>
                  <Chip
                    icon={<FaStar size={12} />}
                    label={`${restrictions.rating.value}+`}
                    size="small"
                    variant="outlined"
                  />
                </Tooltip>
              )}
              {restrictions.gender && (
                <Tooltip title={restrictions.gender.value === 'male' ? 'Men only' : restrictions.gender.value === 'female' ? 'Women only' : 'Mixed'}>
                  <Chip
                    icon={restrictions.gender.value === 'male' ? <FaMale size={12} /> : restrictions.gender.value === 'female' ? <FaFemale size={12} /> : <FaUsers size={12} />}
                    label={restrictions.gender.value === 'male' ? 'Men' : restrictions.gender.value === 'female' ? 'Women' : 'Mixed'}
                    size="small"
                    variant="outlined"
                  />
                </Tooltip>
              )}
              {/* {restrictions.club && (
                <Tooltip title={'Club restriction: ' + restrictions.club?.name}>
                  <Chip 
                    icon={<FaHome size={12} />}
                    label={restrictions.club?.name || 'Club Restricted'}
                    size="small"
                    variant="outlined"
                  />
                </Tooltip>
              )} */}
              {restrictions.age && (
                <Tooltip title={
                  restrictions.age.type === 'over' ? `${restrictions.age.min}+ years` :
                    restrictions.age.type === 'under' ? `Under ${restrictions.age.max} years` :
                      `${restrictions.age.min}-${restrictions.age.max} years`
                }>
                  <Chip
                    icon={<FaCalendar size={12} />}
                    label={
                      restrictions.age.type === 'over' ? `${restrictions.age.min}+` :
                        restrictions.age.type === 'under' ? `<${restrictions.age.max}` :
                          `${restrictions.age.min}-${restrictions.age.max}`
                    }
                    size="small"
                    variant="outlined"
                  />
                </Tooltip>
              )}
            </Box>
          )}
        </Box>

        {/* Dates - pushes to bottom */}
        <Box sx={{ mt: 'auto' }}>
          {startDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MdAccessTime size={14} color={theme.palette.text.secondary} />
              <Typography variant="caption" color="text.secondary">
                Starts {new Date(startDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Action buttons - always at bottom */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Button
              variant={isSelected ? 'contained' : 'outlined'}
              fullWidth
              //size="small"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              {isSelected ? 'Viewing' : 'View Details'}
            </Button>
          </Box>
          {canSignUp && (
            <Box
              sx={{ flex: 1, '& > *': { width: '100%' } }}
              onClick={(e) => e.stopPropagation()}
            >
              <JoinRequest
                objectType="event"
                id={event.id}
                matchType={division.content_object?.match_type || event.match_type}
                isMember={isEnrolled}
                memberText="Enrolled"
                isOpenRegistration={isOpenRegistration}
                callback={onSignUpSuccess}
                restrictions={restrictions}
                divisionId={division.id}
                divisionName={division.name}
                startDate={startDate}
                registrationDate={overrideSettings.registration_open_date || division.content_object?.registration_date || event.registration_date}
              />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DivisionCard;