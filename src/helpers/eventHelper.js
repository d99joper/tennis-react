import { eventAPI } from "api/services";
import { helpers } from "./helpers";

const toYMD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const todayYMD = toYMD(new Date())

const eventHelper = {
  canAddMatchToEvent: function (event) {
    return event.is_participant || event.is_admin;
  },
  canReportScheduledMatch: function (event, match, currentUser) {
    if (event.is_admin) return true;
    if (event.end_date < todayYMD) return false;
    return match.player1.id === currentUser?.id || match.player2.id === currentUser?.id;
  },
  hasEventEnded: function (event) {
    //console.log(event.end_date, todayYMD)
    return event.end_date < todayYMD;
  },
  refreshEvent: async function (id) {
    try {
      const event = await eventAPI.getEvent(id);
      return event;
    } catch (err) {
      console.error('Error loading event', err);
      alert('Error loading event: ' + err.message);
    }
  },
}

export default eventHelper;