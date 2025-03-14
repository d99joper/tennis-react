import { helpers } from "./helpers";

const matchHelper = {
  canAddMatchToEvent: function (event) {
    return event.is_participant || event.is_admin;
  },
  canReportScheduledMatch: function (event, match, currentUser) {
    if (event.is_admin) return true;
    return match.player1.id === currentUser?.id || match.player2.id === currentUser?.id;
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