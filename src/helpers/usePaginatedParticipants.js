import { useState, useEffect } from 'react';
import { eventAPI } from 'api/services';

const usePaginatedParticipants = (eventId) => {
  const [participants, setParticipants] = useState([]);
  const [nextPage, setNextPage] = useState(1); // Start with page 1
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchParticipants = async (page = 1) => {
    try {
      setLoading(true);
      const response = await eventAPI.getParticipants(eventId, page);
      setParticipants((prev) => [...prev, ...response.results]);
      setNextPage(page < response.total_pages ? page + 1 : null); // Determine if more pages exist
    } catch (err) {
      setError(err.message || 'Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchParticipants(1); // Fetch the first page when the event ID changes
    }
  }, [eventId]);

  const loadMore = () => {
    if (nextPage) {
      fetchParticipants(nextPage);
    }
  };

  return { participants, loadMore, loading, error, hasMore: !!nextPage };
};

export default usePaginatedParticipants;
