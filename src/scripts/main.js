'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.start');
  const gameField = document.querySelector('.game-field');
  const scoreElement = document.querySelector('.game-score');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const messageStart = document.querySelector('.message-start');

  function render() {
    const state = game.getState();
    const score = game.getScore();
    const gameStatus = game.getStatus();

    gameField.innerHTML = '';

    for (let row = 0; row < state.length; row++) {
      let rowHTML = '<tr class="field-row">';

      for (let col = 0; col < state[row].length; col++) {
        const tileValue = state[row][col] || '';

        rowHTML += `<td class="field-cell field-cell--${tileValue}">${tileValue}</td>`;
      }
      rowHTML += '</tr>';
      gameField.innerHTML += rowHTML;
    }

    scoreElement.innerText = score;

    if (gameStatus === 'win') {
      messageWin.classList.remove('hidden');
      messageLose.classList.add('hidden');
    } else if (gameStatus === 'lose') {
      messageLose.classList.remove('hidden');
      messageWin.classList.add('hidden');
    } else {
      messageStart.classList.add('hidden');
    }
  }

  startButton.addEventListener('click', () => {
    if (startButton.classList.contains('start')) {
      game.start();
    } else {
      game.restart();
    }
    render();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  });

  document.addEventListener('keydown', (e) => {
    if (game.getStatus() === 'playing') {
      switch (e.key) {
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
      render();
    }
  });

  render();
});
