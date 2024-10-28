import React, { useState } from "react";
import { startNewGame, getGameState, makeGuess, GameState } from "./api";
import { Button, Box, Typography, Grid2, Paper } from "@mui/material";
import "./App.css";

// Array of alphabet letters for the virtual keyboard
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const App: React.FC = () => {
  const [gameId, setGameId] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  // Start a new game
  const startGame = async () => {
    try {
      const response = await startNewGame();
      setGameId(response.data.game_id);
      fetchGameState(response.data.game_id);
      setMessage("New game started!");
      setGuessedLetters([]); // Reset guessed letters when a new game starts
      setIncorrectGuesses([]); // Reset incorrect guesses when a new game starts
    } catch (error) {
      console.error("Error starting a new game:", error);
      setMessage("Failed to start a new game.");
    }
  };

  // Fetch the game state
  const fetchGameState = async (id: number) => {
    try {
      const response = await getGameState(id);
      setGameState(response.data);
    } catch (error) {
      console.error("Error fetching game state:", error);
      setMessage("Failed to fetch game state.");
    }
  };

  // Handle letter guess submission via button click
  const handleGuess = async (letter: string) => {
    if (gameId === null) return;
    try {
      const response = await makeGuess(gameId, letter);
      setGameState(response.data);
      setMessage(
        response.data.correct_guess ? "Correct guess!" : `Incorrect guess.${incorrectGuesses}`
      );
      setGuessedLetters([...guessedLetters, letter]);

      // If the guess is incorrect, add it to the incorrectGuesses array
      if (!response.data.correct_guess) {
        setIncorrectGuesses((prev) => [...prev, letter]);
      }
    } catch (error) {
      console.error("Error making a guess:", error);
      setMessage("Failed to make a guess.");
    }
  };

  // Handle resetting the game
  const resetGame = () => {
    setGameId(null);
    setGameState(null);
    setGuessedLetters([]);
    setIncorrectGuesses([]);
    setMessage("Game reset.");
  };

  // Render the virtual keyboard
  const renderKeyboard = () => {
    return alphabet.map((letter) => (
      <Button
        key={letter}
        onClick={() => handleGuess(letter)}
        disabled={guessedLetters.includes(letter)} // Disable the button if already guessed
        variant="contained"
        color={guessedLetters.includes(letter) ? "secondary" : "primary"}
        sx={{
          margin: 1,
          minWidth: "40px",
          maxWidth: "40px",
          maxHeight: "40px",
          minHeight: "40px",
        }}
      >
        {letter.toUpperCase()}
      </Button>
    ));
  };

  return (
    <Box className="App" sx={{ padding: "20px", textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Hangman Game
      </Typography>
      {!gameId ? (
        <Button variant="contained" color="primary" onClick={startGame}>
          Start New Game
        </Button>
      ) : (
        <>
          <Paper
            elevation={3}
            sx={{ padding: "20px", margin: "20px auto", maxWidth: "400px" }}
          >
            <Typography variant="h5">
              Game Status: {gameState?.status}
            </Typography>
            <Typography variant="h6">
              Current Word: {gameState?.current_state}
            </Typography>
            <Typography variant="body1">
              Incorrect Guesses: {incorrectGuesses.join(", ")}
            </Typography>
            <Typography variant="body1">
              Remaining Guesses: {gameState?.remaining_guesses}
            </Typography>
          </Paper>

          {gameState?.status === "InProgress" && (
            <Grid2
              container
              justifyContent="center"
              display="inline-block"
              width={{ xs: "100%", sm: 350, md: 500, lg: 600 }}
            >
              {renderKeyboard()}
            </Grid2>
          )}

          <Box sx={{ marginTop: "20px" }}>
            <Button variant="outlined" color="secondary" onClick={resetGame}>
              Reset Game
            </Button>
          </Box>
        </>
      )}
      <Typography variant="body1" sx={{ marginTop: "20px", color: "blue" }}>
        {message}
      </Typography>
    </Box>
  );
};

export default App;
