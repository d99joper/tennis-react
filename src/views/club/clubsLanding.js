import React, { useContext, useState } from "react";
import { Box, Button, Typography, } from "@mui/material";
import { clubAPI } from "api/services";
import { AuthContext } from "contexts/AuthContext";
import MapSearch from "components/forms/MapSearch";
import { helpers } from "helpers";
import { CreateClub } from "components/forms";
import MyModal from "components/layout/MyModal";
import { useSnackbar } from "contexts/snackbarContext";

const ClubsLandingPage = () => {
  const [isCreateClubOpen, setIsCreateClubOpen] = useState(false);
  const { user } = useContext(AuthContext)
  const { showSnackbar } = useSnackbar();
  
  const fetchData = async (filters) => {
    showSnackbar(`fetching data`, "success");
    console.log('fetching data')
    const results = await clubAPI.getClubs(filters);
    return results.data.clubs;
  };

  const renderInfoWindow = (clubs) => `
      <div style='width: 220px; padding: 8px; border-radius: 6px; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);'>
      ${clubs.map(club => {
    return `<div>
        <h3 style='margin: 0; font-size: 16px; color: #333;'>${club.name}</h3>
        <p style='margin: 5px 0; font-size: 14px; color: #666;'>
        ${helpers.truncateText(club.description, 50)}
        </p>
        </div>`}).join("<hr>")}
      </div>
      `;

  const renderActions = () =>
    <>
      <Button
        variant="contained"
        fullWidth
        onClick={() => setIsCreateClubOpen(true)}
        sx={{ mt: 2 }}
        disabled={!user?.isProSubscriber}
      >
        Create a Club
      </Button>
      {!user?.isProSubscriber && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Only Pro subscribers can create clubs. Upgrade now to become a Pro subscriber.
        </Typography>
      )}
    </>

  return (
    <Box>
      <MapSearch
        title={'Find Clubs'}
        renderActions={renderActions}
        fetchData={fetchData}
        requireLocation={true}
        renderInfoWindow={renderInfoWindow}
        type='clubs'
      />
      <MyModal showHide={isCreateClubOpen} onClose={() => setIsCreateClubOpen(false)} title="Create a Club">
        <CreateClub
          onClubCreated={(club) => {
            setIsCreateClubOpen(false);
            showSnackbar(`"${club.name}" successfully created`, "success")
          }}
        />
      </MyModal>
    </Box>
  );
};

export default ClubsLandingPage;
