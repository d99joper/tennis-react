import React, { useContext, useState } from "react";
import { Box, Button, Typography, } from "@mui/material";
import { eventAPI } from "api/services";
import { AuthContext } from "contexts/AuthContext";
import MapSearch from "components/forms/MapSearch";
import { helpers } from "helpers";

const EventsLandingPage = () => {

  const fetchData = async (filters) => {
    const results = await eventAPI.getEvents(filters);
    return results.events;
  };

  const renderInfoWindow = (events) => `
      <div style='width: 220px; padding: 8px; border-radius: 6px; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);'>
      ${events.map(event => {
    return `<div>
        <h3 style='margin: 0; font-size: 16px; color: #333;'>${event.name}</h3>
        <p style='margin: 5px 0; font-size: 14px; color: #666;'>
        ${helpers.truncateText(event.description, 50)}
        </p>
        </div>`}).join("<hr>")}
      </div>
      `;

  const renderActions = () =>
    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
      Create a new event on your club page.
    </Typography>

  return (
    <Box>
      <MapSearch
        title={'Find Events'}
        renderActions={renderActions}
        fetchData={fetchData}
        //requireLocation={true}
        applyLocation={true}
        renderInfoWindow={renderInfoWindow}
        type="events"
      />
    </Box>
  );
};

export default EventsLandingPage;
