/* eslint-disable brace-style */
/* eslint-disable prettier/prettier */
'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
function initializeGame()
{
  const buttonStart = document.querySelector('.start');

  buttonStart.addEventListener('click', () =>
  {
    if (buttonStart.classList.contains('start'))
    {
      game.start();
      buttonStart.classList.remove('start');
      buttonStart.classList.add('restart');
      buttonStart.textContent = 'Restart';
    }
    else
    {
      game.restart();
      buttonStart.classList.remove('restart');
      buttonStart.classList.add('start');
      buttonStart.textContent = 'Start';
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
      game.getStatus();
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

  const gameStatus = game.getStatus();

  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  if (gameStatus === 'playing')
  {
    messageStart.classList.add('hidden');
  }
  else if (gameStatus === 'win')
  {
    messageWin.classList.remove('hidden');
  }
  else if (gameStatus === 'lose')
  {
    messageLose.classList.remove('hidden');
  }
  else
  {
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', initializeGame);
