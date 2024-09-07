from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Game
import random

# The list of words for the Hangman game
WORDS = ["Hangman", "Python", "Audacix", "Bottle", "Pen"]


def get_game_response(game):
    """Helper function to generate the game state response."""
    return {
        "status": game.status,
        "current_state": game.current_state,
        "incorrect_guesses": game.incorrect_guesses,
        "remaining_guesses": game.max_incorrect_guesses - game.incorrect_guesses
    }


class NewGameView(APIView):
    """
    Starts a new game by selecting a random word from the predefined list.
    Returns the new game's ID.
    """
    def post(self, request):
        word = random.choice(WORDS).lower()
        game = Game.objects.create(
            word=word,
            max_incorrect_guesses=len(word),
            current_state="_" * len(word)
        )
        return Response({"game_id": game.id}, status=status.HTTP_201_CREATED)


class GameStateView(APIView):
    """
    Returns the current state of the game including guessed letters,
    incorrect guesses, and remaining attempts.
    """
    def get(self, request, game_id):
        try:
            game = Game.objects.get(id=game_id)
            return Response(get_game_response(game), status=status.HTTP_200_OK)
        except Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)


class GuessView(APIView):
    """
    Handles the letter guessing logic. Updates the game state and returns the result.
    """
    def post(self, request, game_id):
        try:
            game = Game.objects.get(id=game_id)
        except Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)

        if game.status != "InProgress":
            return Response({"error": f"Game is already over (status: {game.status})."}, status=status.HTTP_400_BAD_REQUEST)

        letter = request.data.get('letter', '').lower()

        if not letter.isalpha() or len(letter) != 1:
            return Response({"error": "Invalid input. Please guess a single letter."}, status=status.HTTP_400_BAD_REQUEST)

        if letter in game.current_state or letter not in game.word:
            return self.handle_incorrect_guess(game, letter)

        return self.handle_correct_guess(game, letter)

    def handle_correct_guess(self, game, letter):
        """Handles a correct letter guess and updates the game state."""
        new_state = list(game.current_state)
        for index, char in enumerate(game.word):
            if char == letter:
                new_state[index] = letter

        game.current_state = ''.join(new_state)
        if "_" not in game.current_state:  # Check if player has won
            game.status = "Won"

        game.save()
        return Response({
            "message": "Correct guess!",
            "correct_guess": True,
            **get_game_response(game)
        }, status=status.HTTP_200_OK)

    def handle_incorrect_guess(self, game, letter):
        """Handles an incorrect letter guess and updates the game state."""
        if letter in game.current_state:
            return Response({"message": "You already guessed that letter!"}, status=status.HTTP_400_BAD_REQUEST)

        game.incorrect_guesses += 1
        if game.incorrect_guesses >= game.max_incorrect_guesses:
            game.status = "Lost"

        game.save()
        return Response({
            "message": "Incorrect guess!",
            "correct_guess": False,
            **get_game_response(game)
        }, status=status.HTTP_200_OK)
