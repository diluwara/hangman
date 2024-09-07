from django.db import models


class Game(models.Model):
    word = models.CharField(max_length=100)
    incorrect_guesses = models.IntegerField(default=0)
    max_incorrect_guesses = models.IntegerField()
    current_state = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=[('InProgress', 'InProgress'), ('Won', 'Won'), ('Lost', 'Lost')],
                              default='InProgress')
