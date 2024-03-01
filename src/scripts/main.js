/* eslint-disable prettier/prettier */
/* eslint-disable brace-style */
/* eslint-disable max-len */
'use strict';

// Importowanie klasy Game z odpowiedniego katalogu lub pliku, jeśli nie jest dostępna globalnie
const Game = require('../modules/Game.class');
const game = new Game([
  [8, 8, 0, 0],
  [16, 16, 16, 16],
  [32, 32, 64, 128],
  [2, 2, 4, 8],
]);

function initializeGame()
{
  const startButton = document.querySelector('.start');

  startButton.addEventListener('click', () =>
  {
    if (startButton.classList.contains('start'))
    {
      game.start();
      startButton.textContent = 'Restart';
      startButton.classList.remove('start');
      startButton.classList.add('restart');
    } else
    {
      game.restart();
      startButton.textContent = 'Start';
      startButton.classList.remove('restart');
      startButton.classList.add('start');
    }
    updateUI();
  });

  document.addEventListener('keydown', (eventKey) =>
  {
    if (
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(eventKey.key)
    )
    {
      eventKey.preventDefault();
    }

    if (game.getStatus() === 'playing')
    {
      switch (eventKey.key)
      {
        case 'ArrowLeft':
          game.moveLeft();
          break;
        case 'ArrowRight':
          game.moveRight();
          break;
        case 'ArrowUp':
          game.moveUp();
          break;
        case 'ArrowDown':
          game.moveDown();
          break;
      }
      updateUI();
    }
  });
}

function updateUI()
{
  const scoreElement = document.querySelector('.game-score');

  scoreElement.textContent = game.getScore();

  const state = game.getState();

  const cells = document.querySelectorAll('.field-cell');
  let index = 0;

  // Aktualizacja zawartości komórek planszy oraz ich klas CSS
  for (let i = 0; i < state.length; i++)
  {
    for (let j = 0; j < state[i].length; j++)
    {
      cells[index].textContent = state[i][j] !== 0 ? state[i][j] : '';
      cells[index].className = 'field-cell';

      if (state[i][j] !== 0)
      {
        cells[index].classList.add(`field-cell--${state[i][j]}`);
      }
      index++;
    }
  }

  // Sprawdzenie statusu gry i wyświetlenie odpowiedniej wiadomości (opcjonalne)
  const gameStatus = game.getStatus();

  if (gameStatus === 'win')
  {
  } else if (gameStatus === 'lose')
  {
  } else
  {
  }
}

// Wywołanie funkcji inicjalizującej grę po załadowaniu dokumentu HTML
document.addEventListener('DOMContentLoaded', initializeGame);
