// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Player, Match, Ladder, Comment, Standings, LadderPlayer } = initSchema(schema);

export {
  Player,
  Match,
  Ladder,
  Comment,
  Standings,
  LadderPlayer
};