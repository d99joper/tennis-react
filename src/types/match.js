/**
 * Shared Match types for the tennis-react app.
 *
 * Import the helper in components:
 *   import { getMatchContext } from 'types/match';
 *
 * For IDE intellisense on match objects, add a JSDoc annotation:
 *   /** @type {import('types/match').Match} *​/
 *   const match = ...;
 */

/**
 * @typedef {Object} MiniPlayer
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {{ thumbnail?: string, full?: string }} [image_urls]
 */

/**
 * @typedef {Object} MiniParticipant
 * @property {string} id
 * @property {string} name
 * @property {"player" | "playerpair" | "team"} content_type
 * @property {string} object_id
 */

/**
 * @typedef {Object} Match
 * @property {string} id
 * @property {string} played_on
 * @property {MiniPlayer[]} winners
 * @property {MiniPlayer[]} losers
 * @property {string} score
 * @property {{ id: string, name: string } | null} court
 * @property {{ id: string, slug: string, name: string, winner_id: string | null } | null} event
 * @property {{ id: string, name: string, type: string } | null} division
 * @property {MiniParticipant | null} winner_participant
 * @property {MiniParticipant | null} loser_participant
 * @property {"singles" | "doubles"} match_type
 * @property {number} comment_count
 * @property {boolean} retired
 */

/**
 * Derive display context flags from a match object.
 *
 * @param {Match} match
 * @returns {{ isEventMatch: boolean, hasParticipant: boolean, isTeamOrPair: boolean }}
 */
export function getMatchContext(match) {
  const isEventMatch = match.event != null;
  const hasParticipant = match.winner_participant != null;
  const isTeamOrPair =
    hasParticipant && match.winner_participant.content_type !== 'player';

  return { isEventMatch, hasParticipant, isTeamOrPair };
}
