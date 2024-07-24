/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const scoreElement = document.querySelector('.game-score');
  const startButton = document.querySelector('.button.start');
  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const gameField = document.querySelector('.game-field');

  const renderBoard = () => {
    const state = game.getState();
    const cells = gameField.getElementsByTagName('td');
    let cellIndex = 0;

    for (let row = 0; row < state.length; row++) {
      for (let col = 0; col < state[row].length; col++) {
        const cell = cells[cellIndex];

        cell.textContent = state[row][col] === 0 ? '' : state[row][col];
        cell.className = `field-cell field-cell--${state[row][col]}`;
        cellIndex++;
      }
    }
    scoreElement.textContent = game.getScore();
  };

  const startGame = () => {
    game.start();
    renderBoard();
    startButton.classList.add('restart');
    startButton.classList.remove('start');
    startButton.textContent = 'Restart';
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  };

  const restartGame = () => {
    game.restart();
    renderBoard();
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  };

  const handleKeyDown = (event) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    switch (event.key) {
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
      default:
        return;
    }

    renderBoard();

    if (game.getStatus() === 'win') {
      messageWin.classList.remove('hidden');
    } else if (game.getStatus() === 'lose') {
      messageLose.classList.remove('hidden');
    }
  };

  startButton.addEventListener('click', () => {
    if (
      game.getStatus() === 'idle' ||
      game.getStatus() === 'lose' ||
      game.getStatus() === 'win'
    ) {
      startGame();
    } else {
      restartGame();
    }
  });

  document.addEventListener('keydown', handleKeyDown);

  // Function to handle cell merging
  const cells = gameField.getElementsByTagName('td');

  for (const cell of cells) {
    cell.addEventListener('animationend', () => {
      cell.classList.remove('animate-merge');
    });
  }
});
