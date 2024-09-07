import axios from "axios";

// Use the renamed environment variable
const API_URL =
  process.env.REACT_APP_ENVIRONMENT === "local"
    ? process.env.REACT_APP_API_URL
    : process.env.REACT_APP_DEVELOPMENT_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Define TypeScript interfaces for game responses
export interface GameState {
  status: string;
  current_state: string;
  incorrect_guesses: number;
  remaining_guesses: number;
}

export interface NewGameResponse {
  game_id: number;
}

export interface GuessResponse extends GameState {
  correct_guess: boolean;
}

export const startNewGame = () => {
  return api.post<NewGameResponse>("game/new");
};

export const getGameState = (gameId: number) => {
  return api.get<GameState>(`game/${gameId}`);
};

export const makeGuess = (gameId: number, letter: string) => {
  return api.post<GuessResponse>(`game/${gameId}/guess`, { letter });
};
