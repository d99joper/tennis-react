import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { eventAPI } from "api/services";
import LeagueViewPage from "views/league/league_view";
import TournamentView from "views/Tournament/tournamentView";
import LadderView from "views/ladder/view";

const EventView = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const event = await eventAPI.getEvent(id); 
        setEvent(event);
      } catch (err) {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!event) return <Typography>No event found</Typography>;

  // Switch to render the appropriate view
  switch (event.event_type) {
    case "league":
      return <LeagueViewPage event={event} />;
    case "tournament":
      return <TournamentView event={event} />;
    case "ladder":
      return <LadderView event={event} />;
    default:
      return <Typography>Unknown event type</Typography>;
  }
};

export default EventView;
