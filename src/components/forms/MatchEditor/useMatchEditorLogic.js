import { useState, useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';
import { matchAPI } from 'api/services';

const useMatchEditorLogic = ({
  date = '',
  matchType,
  event,
  availableEvents = [],
  scheduleMatchId,
  onSubmit,
  limitedParticipants = [],
  participant
}) => {
  const { user } = useContext(AuthContext);
  const [selectedEvent, setSelectedEvent] = useState(event || null);
  const [selectedOpponents, setSelectedOpponents] = useState([limitedParticipants[1]] || []);
  const [selectedWinners, setSelectedWinners] = useState([limitedParticipants[0] ?? participant] || []);
  const [winnerParticipant, setWinnerParticipant] = useState(null);
  const [opponentParticipant, setOpponentParticipant] = useState(null);
  const [isDoubles, setIsDoubles] = useState(matchType === 'doubles');
  const [winner, setWinner] = useState(true);
  const [playedOn, setPlayedOn] = useState(date);
  const [selectedCourt, setSelectedCourt] = useState(null);
  // const [sets, setSets] = useState([{ set: 1, player1: '', player2: '' }, { set: 2, player1: '', player2: '' }]);
  const [sets, setSets] = useState([{ set: 1, value: '' }, { set: 2, value: '' }]);
  const [retired, setRetired] = useState(false);
  const [error, setError] = useState({ playedOn: false, opponents: false });
  const [setErrorText, setSetErrorText] = useState('');
  const [comment, setComment] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [retiredPlayer, setRetiredPlayer] = useState(null);
  
  // Handle set input changes
  const handleSetChange = (index, value) => {
  //const handleSetChange = (index, player, value) => { // for vertical sets
    const updatedSets = [...sets];
    //updatedSets[index][player] = value;
    updatedSets[index]['value'] = value;
    setSets(updatedSets);
  };

  // Add a new set (max 5)
  const addSet = () => {
    if (sets.length < 5) {
      setSets([...sets, { set: sets.length + 1, value: '' }]);
      //setSets([...sets, { set: sets.length + 1, player1: '', player2: '' }]);
    }
  };

  const removeSet = () => {
    if (sets.length > 1) {
      setSets(prevSets => prevSets.slice(0, -1)); // Remove the last set
    }
  };

  // Validate match sets
  const validateSets = () => {
    if (retired) return true;
  
    let winCount = 0;
    let loseCount = 0;
    let isValid = true;
  
    sets.forEach(set => {
      const value = set.value?.trim();
  
      if (value) {
        const match = value.match(/^(\d{1,2})-(\d{1,2})(?:\((\d{1,2})\))?$/);
  
        if (!match) {
          isValid = false;
          return;
        }
  
        const p1 = Number(match[1]);
        const p2 = Number(match[2]);
        const tb = match[3] !== undefined ? Number(match[3]) : null;
  
        const mainValid = p1 <= 99 && p2 <= 99;
        const tbValid = tb === null || tb <= 99;
  
        if (!mainValid || !tbValid || p1 === p2) {
          isValid = false;
          return;
        }
  
        if (p1 > p2) winCount++;
        else loseCount++;
      }
    });
  
    if (!isValid || winCount <= loseCount) {
      setSetErrorText('This is not a valid score. Ensure the winner has more sets won.');
      return false;
    }
  
    setSetErrorText('');
    return true;
  };
  

  // for vertical sets
  // const validateSets = () => {
  //   if (retired) return true; // Skip validation if a player retired

  //   let player1Sets = 0, player2Sets = 0;
  //   let isValid = sets.every(set => {
  //     if (!set.player1 || !set.player2) return false; // Ensure both scores exist

  //     const first = parseInt(set.player1, 10);
  //     const second = parseInt(set.player2, 10);

  //     if (isNaN(first) || isNaN(second) || first === second) return false;

  //     first > second ? player1Sets++ : player2Sets++;
  //     return true;
  //   });

  //   if (!isValid || player1Sets === player2Sets) {
  //     setSetErrorText('Invalid score: There must be a clear winner.');
  //     return false;
  //   }

  //   // Determine the match winner
  //   setWinner(player1Sets > player2Sets);

  //   setSetErrorText('');
  //   return true;
  // };


  // Submit match
  const onSubmitMatch = async () => {
    const winners = selectedWinners.map(p => {
      // if(selectedEvent !== null) {
      //   return p.object_id // participant's object id
      // }
      // else 
      return p.id
    })
    const losers = selectedOpponents.map(p => {
      // if(selectedEvent !== null) {
      //   return p.object_id // participant's object id
      // }
      // else 
      return p.id
    })
    console.log(winners, selectedWinners)
    const match = {
      winners: winner? winners : losers,
      losers: winner ? losers : winners,
      played_on: new Date(playedOn).toISOString().split('T')[0],
      court_id: selectedCourt?.id || null,
      schedule_match_id: scheduleMatchId,
      retired,
      type: matchType,
      ...(event ? { event_id: event.id } : {}),
      comments: [], 
      score: sets.map(set => `${set.value}`).filter(Boolean).join(', ')
    };

    if (comment.trim()) {
      match.comments.push({
        content: comment,
        posted_by: user.id,
        private: isPrivate,
        posted_on: new Date().toISOString()
      });
    }
    console.log(match)
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
    const currentScore = sets.map(set => `${set.value}`).filter(Boolean).join(', ');
    if (retired) {
      return `${currentScore} retired.`
    }
    
    return sets.map(set => `${set.value}`).filter(Boolean).join(', ');
  };

  return {
    playedOn, setPlayedOn,
    selectedWinners, setSelectedWinners,
    selectedOpponents, setSelectedOpponents,
    selectedCourt, setSelectedCourt,
    sets, addSet, removeSet,
    validateSets, handleSetChange, 
    retired, setRetired,
    onSubmitMatch, onSubmit,
    getCourt, getScore, getPlayers,
    comment, setComment,
    selectedEvent, setSelectedEvent,
    winnerParticipant, setWinnerParticipant,
    opponentParticipant, setOpponentParticipant,
    isDoubles, setIsDoubles,
    winner, setWinner,
    error, setError,
    setErrorText, setSetErrorText,
    isPrivate, setIsPrivate,
    availableEvents
  };
};

export default useMatchEditorLogic;
