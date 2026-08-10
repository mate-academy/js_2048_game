'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]);

// Write your code here
const startButton = document.querySelector('.js-start');
const alertBox = document.querySelector('.js-alert');
const row = document.querySelectorAll('.js-row');
const scoreElement = document.querySelector('.js-score');

startButton.addEventListener('click', gameStart);


function gameStart() {
  game.start();
  game.resetScore();
  scoreElement.textContent = '';
  updateGameField();

  document.removeEventListener('keydown', handleKeyPress);
  document.addEventListener('keydown', handleKeyPress);

  this.removeEventListener('click', gameStart);
  this.addEventListener('click', gameRestart);
  this.innerText = 'Restart';

  alertBox.querySelector('.message-start').classList.add('hidden');
}

function gameRestart() {
  gameStart();
  alertBox.querySelector('.message-lose').classList.add('hidden');
  alertBox.querySelector('.message-win').classList.add('hidden');
}

function updateGameField() {
    let currentState = game.getState();
    row.forEach((rowElement, rowIndex) => {
        const cells = rowElement.querySelectorAll('.field-cell');
        cells.forEach((cellElement, colIndex) => {
            cellElement.textContent = currentState[rowIndex][colIndex] !== 0 ? currentState[rowIndex][colIndex] : '';
            cellElement.className = `field-cell field-cell--${currentState[rowIndex][colIndex]}`;
        });
    });
}

function handleKeyPress(event) {
    const key = event.key;
    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    
    if (!validKeys.includes(key)) {
      return;
    }

    switch (key) {
        case 'ArrowUp':
            game.moveUp();
            break;
        case 'ArrowDown':
            game.moveDown();
            break;
        case 'ArrowLeft':
            game.moveLeft();
            break;
        case 'ArrowRight':
            game.moveRight();
            break;
    }
    game.addRandomTile();
    updateScore();
    updateGameField();
    checkGameStatus();
}

function updateScore() {
    
    scoreElement.textContent = game.getScore();
}

function checkGameStatus() {
    const status = game.getStatus();

    if (status === 'win') {
        document.removeEventListener('keydown', handleKeyPress);
        alertBox.querySelector('.message-win').classList.remove('hidden');
    } else if (status === 'lose') {
        document.removeEventListener('keydown', handleKeyPress);
        alertBox.querySelector('.message-lose').classList.remove('hidden');
    }
}
