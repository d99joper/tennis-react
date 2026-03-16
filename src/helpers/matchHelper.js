//import { helpers } from "./helpers";

import helpers from "./helpers";

const toYMD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const todayYMD = toYMD(new Date())

const matchHelper = {
  canAddMatchToEvent: function (event) {
    return event.is_participant || event.is_admin;
  },

  /**
   * Extract real human-player IDs from a schedule entry (player1 or player2).
   * Singles: entry = { id, name, slug }          → [entry.id]
   * Doubles: entry = { id, name, type:"doubles", player1:{id,…}, player2:{id,…} } → [entry.player1.id, entry.player2.id]
   * @param {Object|null} entry
   * @returns {string[]}
   */
  getPlayerIdsFromEntry: function (entry) {
    if (!entry) return [];
    if (entry.type === 'doubles' && entry.player1 && entry.player2) {
      return [entry.player1.id, entry.player2.id].filter(Boolean);
    }
    return entry.id ? [entry.id] : [];
  },

  /**
   * Check whether a given userId appears anywhere inside a schedule match
   * (either side, including nested doubles players).
   * @param {Object} match  A schedule match with player1 / player2
   * @param {string} userId
   * @returns {boolean}
   */
  isUserInScheduleMatch: function (match, userId) {
    if (!userId) return false;
    const ids = [
      ...matchHelper.getPlayerIdsFromEntry(match.player1),
      ...matchHelper.getPlayerIdsFromEntry(match.player2),
    ];
    return ids.includes(userId);
  },

  /**
   * For a reported schedule match, decide whether the player1-side won.
   * Compares every winner id against all real player ids on the player1 side.
   * @param {Object} scheduleMatch
   * @returns {boolean}
   */
  isPlayer1SideWinner: function (scheduleMatch) {
    if (!scheduleMatch.winners || scheduleMatch.winners.length === 0) return true;
    const p1Ids = matchHelper.getPlayerIdsFromEntry(scheduleMatch.player1);
    return scheduleMatch.winners.some((w) => p1Ids.includes(w.id));
  },

  canReportScheduledMatch: function (event, match, currentUser) {
    if (event.end_date < todayYMD) return false;
    if (event.is_admin) return true;
    return matchHelper.isUserInScheduleMatch(match, currentUser?.id);
  },

  hasEventEnded: function (event) {
    return event.end_date < todayYMD;
  },

  createMatchesFromArray: function (matches) {
    const isDateValid = (...val) => !isNaN(new Date(...val).valueOf());
    console.log(matches)
    for (let index = 0; index < matches.length; index++) {
      const match = matches[index];
      if (isDateValid(match.Date)) {
        if (helpers.hasValue(match['Win/Loss']) && helpers.hasValue(match.Result)) {
          console.log(match.Date, match['Win/Loss'], match.Result)
        }
      }
      else break;
    }
  },
}

export default matchHelper;