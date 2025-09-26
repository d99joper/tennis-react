//import { helpers } from "./helpers";

import helpers from "./helpers";

const toYMD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const todayYMD = toYMD(new Date())

const matchHelper = {
  canAddMatchToEvent: function (event) {
    return event.is_participant || event.is_admin;
  },
  canReportScheduledMatch: function (event, match, currentUser) {
    if (event.end_date < todayYMD) return false;
    if (event.is_admin) return true;
    return match.player1.id === currentUser?.id || match.player2.id === currentUser?.id;
  },
  hasEventEnded: function(event) {
    console.log(event.end_date, todayYMD)
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