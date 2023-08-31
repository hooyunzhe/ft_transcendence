import { useMatchState } from "@/lib/stores/useGameStore";
import { MatchState } from "@/types/GameTypes";
import GameLoadingScreen from "./GameLoadingScreen";
import GameReady from "./GameReady";

export default function GameTransition() {
  const matchState = useMatchState();

  if (matchState === MatchState.FOUND) {
    return <GameReady />;
  } else if (matchState === MatchState.INGAME) {
    return <GameLoadingScreen />;
  } else {
    return null
  }
}