import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import callAPI from '../callAPI';
import { MatchState, MatchInfo, GameMode } from '@/types/GameTypes';
import { Match, SkillClass } from '@/types/MatchTypes';
import { User } from '@/types/UserTypes';

type RecentMatchesDictionary = { [userID: number]: Match[] };

interface GameStore {
  data: {
    matches: Match[];
    matchesPlayed: Match[];
    recentMatches: RecentMatchesDictionary;
    matchState: MatchState;
    keyState: { [key: string]: boolean };
    matchInfo: MatchInfo | null;
    gameReady: boolean;
    selectedGameMode: GameMode;
    selectedSkillClass: SkillClass | undefined;
    outgoingInviteUser: User | undefined;
    incomingInviteUser: User | undefined;
    incomingInviteRoomID: string | undefined;
  };
  actions: {
    getGameData: (currentUserID: number) => void;
    getNewMatch: (
      userID: number,
      opponentID: number,
    ) => Promise<Match | undefined>;
    getNotableOpponents: (userID: number) => {
      punchingBag: string;
      archenemy: string;
    };
    getMatchOpponent: (match: Match, userID: number) => User;
    getMatchScore: (match: Match, userID: number) => string;
    getMatchClass: (match: Match, userID: number) => SkillClass | null;
    getClassName: (path: SkillClass | null) => string;
    getKeyState: (key: string) => boolean;
    addMatch: (newMatch: Match, currentUserID: number) => void;
    setMatchState: (matchState: MatchState) => void;
    setKeyState: (key: string, isPressed: boolean) => void;
    setMatchInfo: (matchinfo: MatchInfo) => void;
    setGameReady: (ready: boolean) => void;
    setSelectedGameMode: (mode: GameMode) => void;
    setSelectedSkillClass: (skillClass: SkillClass | undefined) => void;
    setOutgoingInviteUser: (user: User | undefined) => void;
    setIncomingInviteUser: (user: User | undefined) => void;
    setIncomingInviteRoomID: (roomID: string | undefined) => void;
    setupGameSocketEvents: (gameSocket: Socket) => void;
  };
}

type StoreSetter = (helper: (state: GameStore) => Partial<GameStore>) => void;
type StoreGetter = () => GameStore;

async function getGameData(
  set: StoreSetter,
  currentUserID: number,
): Promise<void> {
  const matchData = await callAPI('GET', 'matches?search_type=ALL').then(
    (res) => res.body,
  );
  const matchesPlayed: Match[] = [];
  const recentMatches: RecentMatchesDictionary = {
    [currentUserID]: [],
  };

  matchData.forEach((match: Match) => {
    if (
      match.player_one.id === currentUserID ||
      match.player_two.id === currentUserID
    ) {
      matchesPlayed.push(match);
    }
    if (!recentMatches[match.player_one.id]) {
      recentMatches[match.player_one.id] = [];
    }
    if (!recentMatches[match.player_two.id]) {
      recentMatches[match.player_two.id] = [];
    }
    recentMatches[match.player_one.id] = [
      ...recentMatches[match.player_one.id],
      match,
    ];
    recentMatches[match.player_two.id] = [
      ...recentMatches[match.player_two.id],
      match,
    ];
  });

  for (const userID in recentMatches) {
    recentMatches[userID] = recentMatches[userID].slice(-4).reverse();
  }

  set(({ data }) => ({
    data: {
      ...data,
      matches: matchData,
      matchesPlayed: matchesPlayed,
      recentMatches: recentMatches,
    },
  }));
}

async function getNewMatch(
  set: StoreSetter,
  userID: number,
  opponentID: number,
): Promise<Match | undefined> {
  const newMatchData = await callAPI(
    'GET',
    `matches?search_type=LATEST&search_number=${userID}&second_search_number=${opponentID}`,
  ).then((res) => res.body);

  if (newMatchData) {
    addMatch(set, newMatchData, userID);
  }
  return newMatchData;
}

function getNotableOpponents(
  get: StoreGetter,
  userID: number,
): { punchingBag: string; archenemy: string } {
  const bags: { [username: string]: number } = {};
  const enemies: { [username: string]: number } = {};

  get().data.matches.forEach((match) => {
    const opponentNum =
      match.player_one.id === userID ? 'two' : match.player_two.id ? 'one' : '';

    if (opponentNum) {
      if (match.winner_id === userID) {
        if (!bags[match[`player_${opponentNum}`].username]) {
          bags[match[`player_${opponentNum}`].username] = 0;
        }
        bags[match[`player_${opponentNum}`].username]++;
      } else {
        if (!enemies[match[`player_${opponentNum}`].username]) {
          enemies[match[`player_${opponentNum}`].username] = 0;
        }
        enemies[match[`player_${opponentNum}`].username]++;
      }
    }
  });
  return {
    punchingBag: Object.keys(bags).length
      ? Object.entries(bags).reduce((max, current) =>
        current[1] > max[1] ? current : max,
      )[0]
      : 'N/A',
    archenemy: Object.keys(enemies).length
      ? Object.entries(enemies).reduce((max, current) =>
        current[1] > max[1] ? current : max,
      )[0]
      : 'N/A',
  };
}

function getMatchOpponent(match: Match, userID: number): User {
  return match.player_one.id === userID ? match.player_two : match.player_one;
}

function getMatchScore(match: Match, userID: number): string {
  if (match.player_one.id === userID) {
    return `${match.p1_score} / ${match.p2_score}`;
  } else {
    return `${match.p2_score} / ${match.p1_score}`;
  }
}

function getMatchClass(match: Match, userID: number): SkillClass | null {
  const classID =
    match.player_one.id === userID ? match.p1_class_id : match.p2_class_id;

  if (classID === 1) {
    return SkillClass.STRENGTH;
  } else if (classID === 2) {
    return SkillClass.SPEED;
  } else if (classID === 3) {
    return SkillClass.TECH;
  } else {
    return null;
  }
}

function getClassName(skillClass: SkillClass | null): string {
  switch (skillClass) {
    case SkillClass.STRENGTH:
      return 'Cratos';
    case SkillClass.SPEED:
      return 'Chronos';
    case SkillClass.TECH:
      return 'Cosmos';
    case null:
      return 'N/A';
  }
}

function setKeyState(set: StoreSetter, key: string, isPressed: boolean): void {
  set((state) => ({
    data: {
      ...state.data,
      keyState: {
        ...state.data.keyState,
        [key]: isPressed,
      },
    },
  }));
}

function getKeyState(get: StoreGetter, key: string) {
  const keyState = get().data.keyState;

  return !!keyState[key];
}

function addMatch(
  set: StoreSetter,
  newMatch: Match,
  currentUserID: number,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      matches: [...data.matches, newMatch],
      matchesPlayed: [...data.matchesPlayed, newMatch],
      recentMatches: {
        ...data.recentMatches,
        [currentUserID]: data.recentMatches[currentUserID]
          ? [newMatch, ...data.recentMatches[currentUserID].slice(0, 3)]
          : [newMatch],
      },
    },
  }));
}

function setMatchState(set: StoreSetter, matchState: MatchState): void {
  set((state) => ({
    data: {
      ...state.data,
      matchState: matchState,
    },
  }));
}

function setGameReady(set: StoreSetter, ready: boolean): void {
  set((state) => ({
    data: {
      ...state.data,
      gameReady: ready,
    },
  }));
}

function setMatchInfo(set: StoreSetter, matchInfo: MatchInfo): void {
  set((state) => ({
    data: {
      ...state.data,
      matchInfo: matchInfo,
    },
  }));
}

function setSelectedGameMode(set: StoreSetter, mode: GameMode): void {
  set((state) => ({
    data: {
      ...state.data,
      selectedGameMode: mode,
    },
  }));
}

function setSelectedSkillClass(
  set: StoreSetter,
  skillClass: SkillClass | undefined,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      selectedSkillClass: skillClass,
    },
  }));
}

function setOutgoingInviteUser(set: StoreSetter, user: User | undefined): void {
  set(({ data }) => ({
    data: {
      ...data,
      outgoingInviteUser: user,
    },
  }));
}

function setIncomingInviteUser(set: StoreSetter, user: User | undefined): void {
  set(({ data }) => ({
    data: {
      ...data,
      incomingInviteUser: user,
    },
  }));
}

function setIncomingInviteRoomID(
  set: StoreSetter,
  roomID: string | undefined,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      incomingInviteRoomID: roomID,
    },
  }));
}

async function getPlayerData(
  player1: string,
  player2: string,
): Promise<MatchInfo> {
  const [player1response, player2response] = await Promise.all([
    callAPI('GET', 'users?search_type=ONE&search_number=' + player1),
    callAPI('GET', 'users?search_type=ONE&search_number=' + player2),
  ]);

  const player1data = player1response.body;
  const player2data = player2response.body;

  const matchInfo: MatchInfo = {
    player1: {
      id: player1data.id,
      nickname: player1data.username,
      avatar: player1data.avatar_url,
    },
    player2: {
      id: player2data.id,
      nickname: player2data.username,
      avatar: player2data.avatar_url,
    },
  };
  return matchInfo;
}

function setupGameSocketEvents(set: StoreSetter, gameSocket: Socket): void {
  gameSocket.on(
    'matchFound',
    async ({ player1, player2 }: { player1: string; player2: string }) => {
      if (player1 !== undefined && player2 !== undefined) {
        setMatchInfo(set, await getPlayerData(player1, player2));
      } else {
        gameSocket.emit('getMatchPlayerIDs');
      }
      setMatchState(set, MatchState.FOUND);
      setOutgoingInviteUser(set, undefined);
      setIncomingInviteUser(set, undefined);
      setIncomingInviteRoomID(set, undefined);
    },
  );
  gameSocket.on('getMatchPlayerIDs', async ({ player1, player2 }: { player1: string; player2: string }) => {
    setMatchInfo(set, await getPlayerData(player1, player2));
  })
  gameSocket.on('startGame', () => setMatchState(set, MatchState.INGAME));
  gameSocket.on('playerDisconnected', () => {
    gameSocket.emit('leaveRoom');
    setGameReady(set, false);
    setSelectedSkillClass(set, undefined);
    setTimeout(() => setMatchState(set, MatchState.END), 1500);
    setSelectedGameMode(set, GameMode.CYBERPONG);
  });
  gameSocket.on('rejectInvite', () => setOutgoingInviteUser(set, undefined));
  gameSocket.on(
    'newInvite',
    ({ user, room_id }: { user: User; room_id: string }) => {
      setIncomingInviteUser(set, user);
      setIncomingInviteRoomID(set, room_id);
    },
  );
  gameSocket.on('cancelInvite', () => {
    setIncomingInviteUser(set, undefined);
    setIncomingInviteRoomID(set, undefined);
  });
}

const useGameStore = create<GameStore>()((set, get) => ({
  data: {
    matches: [],
    matchesPlayed: [],
    recentMatches: {},
    matchState: MatchState.IDLE,
    keyState: {},
    gameReady: false,
    matchInfo: null,
    selectedGameMode: GameMode.CYBERPONG,
    selectedSkillClass: undefined,
    outgoingInviteUser: undefined,
    incomingInviteUser: undefined,
    incomingInviteRoomID: undefined,
  },
  actions: {
    getGameData: (currentUserID) => getGameData(set, currentUserID),
    getNewMatch: (userID, opponentID) => getNewMatch(set, userID, opponentID),
    getNotableOpponents: (userID) => getNotableOpponents(get, userID),
    getMatchOpponent: (match, userID) => getMatchOpponent(match, userID),
    getMatchScore: (match, userID) => getMatchScore(match, userID),
    getMatchClass: (match, userID) => getMatchClass(match, userID),
    getClassName: (path) => getClassName(path),
    getKeyState: (key) => getKeyState(get, key),
    addMatch: (newMatch, currentUserID) =>
      addMatch(set, newMatch, currentUserID),
    setMatchState: (MatchState) => setMatchState(set, MatchState),
    setKeyState: (key, isPressed) => setKeyState(set, key, isPressed),
    setMatchInfo: (matchInfo) => setMatchInfo(set, matchInfo),
    setGameReady: (ready) => setGameReady(set, ready),
    setSelectedGameMode: (gameMode) => setSelectedGameMode(set, gameMode),
    setSelectedSkillClass: (path) => setSelectedSkillClass(set, path),
    setOutgoingInviteUser: (user) => setOutgoingInviteUser(set, user),
    setIncomingInviteUser: (user) => setIncomingInviteUser(set, user),
    setIncomingInviteRoomID: (roomID) => setIncomingInviteRoomID(set, roomID),
    setupGameSocketEvents: (gameSocket) =>
      setupGameSocketEvents(set, gameSocket),
  },
}));

export const useMatches = () => useGameStore((state) => state.data.matches);
export const useMatchesPlayed = () =>
  useGameStore((state) => state.data.matchesPlayed);
export const useRecentMatches = () =>
  useGameStore((state) => state.data.recentMatches);
export const useMatchState = () =>
  useGameStore((state) => state.data.matchState);
export const useMatchInfo = () => useGameStore((state) => state.data.matchInfo);
export const useGameReady = () => useGameStore((state) => state.data.gameReady);
export const useSelectedGameMode = () =>
  useGameStore((state) => state.data.selectedGameMode);
export const useSelectedSkillClass = () =>
  useGameStore((state) => state.data.selectedSkillClass);
export const useOutgoingInviteUser = () =>
  useGameStore((state) => state.data.outgoingInviteUser);
export const useIncomingInviteUser = () =>
  useGameStore((state) => state.data.incomingInviteUser);
export const useIncomingInviteRoomID = () =>
  useGameStore((state) => state.data.incomingInviteRoomID);
export const useGameActions = () => useGameStore((state) => state.actions);
