// src/components/MemberList.js
import React from 'react';
import { Box, List, ListItem, ListItemText, Chip, Button, IconButton, Stack, Typography } from '@mui/material';
import { ProfileImage } from 'components/forms';
import { MdDelete } from 'react-icons/md';
import { GiExitDoor } from 'react-icons/gi';

const MemberList = ({
  members,
  currentUserId,
  admins = [],
  showAdminBadge = true,
  showLeaveButton = true,
  showRemoveButton = false,
  onLeave,
  onRemove,
  customActions,
  customSecondary,
  customBadges,
  emptyMessage = "No members found",
  getKey = (member) => member.id,
  hoverEffect = true,
  showBorders = true,
  spacing = 1.5,
  avatarSize = 40,
}) => {
  if (!members || members.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {members.map((member) => {
        const isAdmin = admins.includes(member.id);
        const isCurrentUser = currentUserId === member.id;
        
        return (
          <ListItem
            key={getKey(member)}
            sx={{
              ...(showBorders && {
                borderBottom: '1px solid',
                borderColor: 'divider',
              }),
              ...(hoverEffect && {
                '&:hover': { bgcolor: 'action.hover' },
              }),
              py: spacing
            }}
            secondaryAction={
              <Stack direction="row" spacing={1} alignItems="center">
                {/* Custom actions passed as render prop */}
                {customActions && customActions(member, isCurrentUser, isAdmin)}
                
                {/* Default leave button */}
                {showLeaveButton && isCurrentUser && onLeave && (
                  <Button
                    size="small"
                    color="secondary"
                    startIcon={<GiExitDoor size={18} />}
                    onClick={() => onLeave(member)}
                  >
                    Leave
                  </Button>
                )}
                
                {/* Default remove button (only for non-admins) */}
                {showRemoveButton && !isAdmin && onRemove && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onRemove(member)}
                    sx={{ color: 'error.main' }}
                  >
                    <MdDelete size={20} />
                  </IconButton>
                )}
              </Stack>
            }
          >
            <ListItemText
              primary={
                <ProfileImage player={member} size={avatarSize} asLink={true} showName={true} />
              }
              secondary={
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Custom secondary content */}
                  {customSecondary && customSecondary(member, isCurrentUser, isAdmin)}
                  
                  {/* Custom badges */}
                  {customBadges && customBadges(member, isCurrentUser, isAdmin)}
                  
                  {/* Default admin badge */}
                  {showAdminBadge && isAdmin && (
                    <Chip
                      label="Admin"
                      size="small"
                      color="primary"
                      sx={{ height: 20, fontSize: 11 }}
                    />
                  )}
                </Box>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default MemberList;