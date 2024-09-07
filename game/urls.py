from django.urls import path
from .views import NewGameView, GameStateView, GuessView

urlpatterns = [
    path('new', NewGameView.as_view(), name='new_game'),
    path('<int:game_id>', GameStateView.as_view(), name='game_state'),
    path('<int:game_id>/guess', GuessView.as_view(), name='guess'),
]