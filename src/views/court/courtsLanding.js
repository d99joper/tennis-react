import React, { useContext, useState } from "react";
import { Box, Button, Typography, } from "@mui/material";
import { courtAPI } from "api/services";
import { AuthContext } from "contexts/AuthContext";
import MapSearch from "components/forms/MapSearch";
import { helpers } from "helpers";
import MyModal from "components/layout/MyModal";
import CreateCourt from "components/forms/Courts/create";
import { useSnackbar } from "contexts/snackbarContext";

const CourtsLanding = () => {
  const [isCreateCourtOpen, setIsCreateCourtOpen] = useState(false);
  const [mapsApi, setMapsApi] = useState(null)
  const { showSnackbar } = useSnackbar();

  const fetchData = async (filters) => {
    const results = await courtAPI.getCourts(filters);
    return results.courts;
  };

  const renderInfoWindow = (courts) => `
      <div style='width: 220px; padding: 8px; border-radius: 6px; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);'>
      ${courts.map(court => {
    return `<div>
        <h3 style='margin: 0; font-size: 16px; color: #333;'>${court.name}</h3>
        <p style='margin: 5px 0; font-size: 14px; color: #666;'>
          ${court?.number_of_courts ? court.number_of_courts + ' courts' : ""} | 
          ${court?.is_public ? ' open to the public' : ' private'}
        </p>
        <p style='margin: 5px 0; font-size: 14px; color: #666;'>
        ${helpers.truncateText(court.description, 100)}
        </p>
        </div>`}).join("<hr>")}
      </div>
      `;

  const renderActions = () =>
    <>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        Can't find your court? Add it!
      </Typography>
      <Button
        variant="contained"
        fullWidth
        onClick={() => setIsCreateCourtOpen(true)}
        sx={{ mt: 2 }}
      >
        Create a court
      </Button>
    </>

  return (
    <Box>
      <MapSearch
        title={'Find courts'}
        renderActions={renderActions}
        fetchData={fetchData}
        requireLocation={true}
        renderInfoWindow={renderInfoWindow}
        onMapsApiLoaded={setMapsApi}
        type="courts"
      />
      <MyModal
        //onRendered={() => setMapReady(true)}
        showHide={isCreateCourtOpen}
        onClose={() => setIsCreateCourtOpen(false)}
        title="Create a court"
      >
        {mapsApi && 
          <CreateCourt 
            mapsApi={mapsApi} 
            callback={(newCourt) => {
              setIsCreateCourtOpen(false);
              showSnackbar(`New court: "${newCourt.name}" was successfully created`, "success")
            }} 
          />}
      </MyModal>
    </Box>
  );
};

export default CourtsLanding;
