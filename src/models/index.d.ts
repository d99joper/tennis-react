import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

type PlayerMetaData = {
  readOnlyFields: 'createdOn' | 'updatedOn';
}

type MatchMetaData = {
  readOnlyFields: 'createdOn' | 'updatedOn';
}

type LadderMetaData = {
  readOnlyFields: 'createdOn' | 'updatedOn';
}

type CommentMetaData = {
  readOnlyFields: 'createdOn' | 'updatedOn';
}

type StandingsMetaData = {
  readOnlyFields: 'createdOn' | 'updatedOn';
}

type LadderPlayerMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerPlayer = {
  readonly id: string;
  readonly userGUID: string;
  readonly name: string;
  readonly email: string;
  readonly phone?: string | null;
  readonly about?: string | null;
  readonly image?: string | null;
  readonly NTRP?: string | null;
  readonly UTR?: string | null;
  readonly matches?: Match[] | null;
  readonly ladders?: LadderPlayer[] | null;
  readonly createdOn?: string | null;
  readonly updatedOn?: string | null;
}

type LazyPlayer = {
  readonly id: string;
  readonly userGUID: string;
  readonly name: string;
  readonly email: string;
  readonly phone?: string | null;
  readonly about?: string | null;
  readonly image?: string | null;
  readonly NTRP?: string | null;
  readonly UTR?: string | null;
  readonly matches: AsyncCollection<Match>;
  readonly ladders: AsyncCollection<LadderPlayer>;
  readonly createdOn?: string | null;
  readonly updatedOn?: string | null;
}

export declare type Player = LazyLoading extends LazyLoadingDisabled ? EagerPlayer : LazyPlayer

export declare const Player: (new (init: ModelInit<Player, PlayerMetaData>) => Player) & {
  copyOf(source: Player, mutator: (draft: MutableModel<Player, PlayerMetaData>) => MutableModel<Player, PlayerMetaData> | void): Player;
}

type EagerMatch = {
  readonly id: string;
  readonly type?: string | null;
  readonly playedOn: string;
  readonly year: number;
  readonly winner: Player;
  readonly loser: Player;
  readonly score: string;
  readonly setsWon: number;
  readonly setsLost: number;
  readonly gamesWon: number;
  readonly gamesLost: number;
  readonly tiebreaksWon: number;
  readonly tiebreaksLost: number;
  readonly retired?: boolean | null;
  readonly ladder?: Ladder | null;
  readonly comments?: Comment[] | null;
  readonly createdOn?: string | null;
  readonly updatedOn?: string | null;
  readonly playerMatchesId?: string | null;
  readonly ladderMatchesId?: string | null;
}

type LazyMatch = {
  readonly id: string;
  readonly type?: string | null;
  readonly playedOn: string;
  readonly year: number;
  readonly winner: AsyncItem<Player>;
  readonly loser: AsyncItem<Player>;
  readonly score: string;
  readonly setsWon: number;
  readonly setsLost: number;
  readonly gamesWon: number;
  readonly gamesLost: number;
  readonly tiebreaksWon: number;
  readonly tiebreaksLost: number;
  readonly retired?: boolean | null;
  readonly ladder: AsyncItem<Ladder | undefined>;
  readonly comments: AsyncCollection<Comment>;
  readonly createdOn?: string | null;
  readonly updatedOn?: string | null;
  readonly playerMatchesId?: string | null;
  readonly ladderMatchesId?: string | null;
}

export declare type Match = LazyLoading extends LazyLoadingDisabled ? EagerMatch : LazyMatch

export declare const Match: (new (init: ModelInit<Match, MatchMetaData>) => Match) & {
  copyOf(source: Match, mutator: (draft: MutableModel<Match, MatchMetaData>) => MutableModel<Match, MatchMetaData> | void): Match;
}

type EagerLadder = {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly city?: string | null;
  readonly zip?: string | null;
  readonly matches?: Match[] | null;
  readonly players?: LadderPlayer[] | null;
  readonly createdOn?: string | null;
  readonly updatedOn?: string | null;
}

type LazyLadder = {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly city?: string | null;
  readonly zip?: string | null;
  readonly matches: AsyncCollection<Match>;
  readonly players: AsyncCollection<LadderPlayer>;
  readonly createdOn?: string | null;
  readonly updatedOn?: string | null;
}

export declare type Ladder = LazyLoading extends LazyLoadingDisabled ? EagerLadder : LazyLadder

export declare const Ladder: (new (init: ModelInit<Ladder, LadderMetaData>) => Ladder) & {
  copyOf(source: Ladder, mutator: (draft: MutableModel<Ladder, LadderMetaData>) => MutableModel<Ladder, LadderMetaData> | void): Ladder;
}

type EagerComment = {
  readonly id: string;
  readonly match?: Match | null;
  readonly content: string;
  readonly createdOn?: string | null;
  readonly updatedOn?: string | null;
}

type LazyComment = {
  readonly id: string;
  readonly match: AsyncItem<Match | undefined>;
  readonly content: string;
  readonly createdOn?: string | null;
  readonly updatedOn?: string | null;
}

export declare type Comment = LazyLoading extends LazyLoadingDisabled ? EagerComment : LazyComment

export declare const Comment: (new (init: ModelInit<Comment, CommentMetaData>) => Comment) & {
  copyOf(source: Comment, mutator: (draft: MutableModel<Comment, CommentMetaData>) => MutableModel<Comment, CommentMetaData> | void): Comment;
}

type EagerStandings = {
  readonly id: string;
  readonly player: Player;
  readonly ladder: Ladder;
  readonly points: number;
  readonly position: number;
  readonly createdOn?: string | null;
  readonly updatedOn?: string | null;
  readonly standingsPlayerId: string;
  readonly standingsLadderId: string;
}

type LazyStandings = {
  readonly id: string;
  readonly player: AsyncItem<Player>;
  readonly ladder: AsyncItem<Ladder>;
  readonly points: number;
  readonly position: number;
  readonly createdOn?: string | null;
  readonly updatedOn?: string | null;
  readonly standingsPlayerId: string;
  readonly standingsLadderId: string;
}

export declare type Standings = LazyLoading extends LazyLoadingDisabled ? EagerStandings : LazyStandings

export declare const Standings: (new (init: ModelInit<Standings, StandingsMetaData>) => Standings) & {
  copyOf(source: Standings, mutator: (draft: MutableModel<Standings, StandingsMetaData>) => MutableModel<Standings, StandingsMetaData> | void): Standings;
}

type EagerLadderPlayer = {
  readonly id: string;
  readonly player: Player;
  readonly ladder: Ladder;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLadderPlayer = {
  readonly id: string;
  readonly player: AsyncItem<Player>;
  readonly ladder: AsyncItem<Ladder>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LadderPlayer = LazyLoading extends LazyLoadingDisabled ? EagerLadderPlayer : LazyLadderPlayer

export declare const LadderPlayer: (new (init: ModelInit<LadderPlayer, LadderPlayerMetaData>) => LadderPlayer) & {
  copyOf(source: LadderPlayer, mutator: (draft: MutableModel<LadderPlayer, LadderPlayerMetaData>) => MutableModel<LadderPlayer, LadderPlayerMetaData> | void): LadderPlayer;
}