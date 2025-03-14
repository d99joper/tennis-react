import { useState, useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';
import { matchAPI } from 'api/services';

const useMatchEditorLogic = ({ initialDate, matchType, event, scheduleMatchId, onSubmit, limitedParticipants, participant }) => {
  const { user } = useContext(AuthContext);
  const [selectedEvent, setSelectedEvent] = useState(event || null);
  const [selectedOpponents, setSelectedOpponents] = useState([limitedParticipants[1]] || []);
  const [selectedWinners, setSelectedWinners] = useState([limitedParticipants[0] ?? participant] || []);
  const [winnerParticipant, setWinnerParticipant] = useState(null);
  const [opponentParticipant, setOpponentParticipant] = useState(null);
  const [isDoubles, setIsDoubles] = useState(matchType === 'doubles');
  const [winner, setWinner] = useState(true);
  const [playedOn, setPlayedOn] = useState(initialDate);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [sets, setSets] = useState([{ set: 1, value: '' }, { set: 2, value: '' }]);
  const [retired, setRetired] = useState(false);
  const [error, setError] = useState({ playedOn: false, opponents: false });
  const [setErrorText, setSetErrorText] = useState('');
  const [comment, setComment] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
console.log(selectedEvent)
  // Handle set input changes
  const handleSetChange = (index, value) => {
    const updatedSets = [...sets];
    updatedSets[index].value = value;
    setSets(updatedSets);
  };

  // Add a new set (max 5)
  const addSet = () => {
    if (sets.length < 5) {
      setSets([...sets, { set: sets.length + 1, value: '' }]);
    }
  };

  // Validate match sets
  const validateSets = () => {
    if (retired) return true;
    
    let winCount = 0, loseCount = 0;
    let isValid = sets.every(set => {
      if (!set.value) return true;

      const [first, second] = set.value.match(/^\d+-\d+\(\d+\)$/)
        ? set.value.split(/[\-\(\)]/).slice(0, 2).map(Number)
        : set.value.split('-').map(Number);

      if (isNaN(first) || isNaN(second) || first === second) return false;

      first > second ? winCount++ : loseCount++;
      return true;
    });

    return isValid && winCount > loseCount;
  };

  // Submit match
  const onSubmitMatch = async () => {
    const match = {
      winners: selectedWinners.map(p => p.id),
      losers: selectedOpponents.map(p => p.id),
      played_on: new Date(playedOn).toISOString().split('T')[0],
      court_id: selectedCourt?.id || null,
      schedule_match_id: scheduleMatchId,
      retired,
      type: matchType,
      ...(event ? { event_id: event.id } : {})
    };

    if (comment.trim()) {
      match.comments.push({
        content: comment,
        posted_by: user.id,
        private: isPrivate,
        posted_on: new Date().toISOString()
      });
    }

    try {
      const newMatch = await matchAPI.createMatch(match);
      onSubmit?.(newMatch);
    } catch (error) {
      console.error("Error submitting match:", error);
    }
  };

  const getPlayers = (playerList) => {
		const names = playerList.map((p) => p?.name)
			.filter(Boolean) // Remove any null values if an ID doesn't match
			.join(", ");
		return names;
	}

  const getCourt = () => selectedCourt ? selectedCourt.name : 'No court selected';

  const getScore = () => {
    let score = retired ? 'Default' : sets.filter(set => set.value).map(set => set.value).join(', ')
    return score
  }

  return {
    playedOn, setPlayedOn,
    selectedWinners, setSelectedWinners,
    selectedOpponents, setSelectedOpponents,
    selectedCourt, setSelectedCourt,
    sets, handleSetChange, addSet,
    retired, setRetired,
    validateSets,
    onSubmitMatch, getPlayers,
    getCourt, getScore,
    comment, setComment,
    selectedEvent, setSelectedEvent,
    winnerParticipant, setWinnerParticipant,
    opponentParticipant, setOpponentParticipant,
    isDoubles, setIsDoubles,
    winner, setWinner,
    error, setError,
    setErrorText, setSetErrorText,
    isPrivate, setIsPrivate
  };
};

export default useMatchEditorLogic;
