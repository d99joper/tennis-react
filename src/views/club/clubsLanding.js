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
    const results = await clubAPI.getClubs(filters);
    let clubs = results.data?.clubs ?? [];

    // The search endpoint may return a minimal projection (id, name, slug) without
    // coordinates. Enrich any club missing lat/lng by fetching its full record.
    const missing = clubs.filter(
      c => !(c.lat ?? c?.city?.lat) || !(c.lng ?? c?.city?.lng)
    );
    if (missing.length) {
      const enriched = await Promise.all(
        missing.map(c => clubAPI.getClub(c.id).then(r => r.success ? r.data?.club ?? r.data : c))
      );
      const enrichedById = Object.fromEntries(enriched.map(c => [c.id, c]));
      clubs = clubs.map(c => enrichedById[c.id] ?? c);
    }

    return { data: clubs, count: results.data?.total_count || clubs.length };
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
        //requireLocation={true}
        applyLocation={true}
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
