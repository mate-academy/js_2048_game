'use strict';

// Import the Game class
import Game from '../modules/Game.class';

// Create a new instance of the game
const game = new Game();

// Get references to DOM elements
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const restartButton = document.querySelector('.start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

// Змінюємо текст кнопки "Start" на "Restart"
restartButton.textContent = 'Restart';

// Ховаємо стартове повідомлення
messageStart.classList.add('hidden');

// Автоматично ініціалізуємо гру без натискання кнопки
game.start();

// Function to render the game state
const renderGame = () => {
  // Update score
  gameScore.textContent = game.getScore();

  // Clear the table
  const cells = gameField.querySelectorAll('.field-cell');

  cells.forEach((cell) => (cell.textContent = ''));

  // Update the table with the current board state
  const board = game.getState();

  board.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = gameField.rows[rowIndex].cells[colIndex];

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });

  // Check the game status
  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
  } else {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
};

// Function to restart the game
const restartGame = () => {
  game.restart();
  renderGame();
  updateBoard();
};

// Function to handle the movement
const handleMovement = (direction) => {
  switch (direction) {
    case 'left':
      game.moveLeft();
      break;
    case 'right':
      game.moveRight();
      break;
    case 'up':
      game.moveUp();
      break;
    case 'down':
      game.moveDown();
      break;
  }
  game.updateStatus();
  renderGame();
};

// Event listener for the restart button
restartButton.addEventListener('click', restartGame);

// Event listener for the arrow keys to move tiles
document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    if (e.key === 'ArrowLeft') {
      handleMovement('left');
    } else if (e.key === 'ArrowRight') {
      handleMovement('right');
    } else if (e.key === 'ArrowUp') {
      handleMovement('up');
    } else if (e.key === 'ArrowDown') {
      handleMovement('down');
    }
  }

  updateBoard();
});

function updateBoard() {
  const gameState = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  let idx = 0;

  gameState.forEach((row) => {
    row.forEach((cellValue) => {
      const cell = cells[idx];
      const tileClass = game.getTileClass(cellValue);

      cell.className = 'field-cell ' + tileClass;
      cell.textContent = cellValue === 0 ? '' : cellValue;
      idx++;
    });
  });
}

// Initialize the game immediately
renderGame();
updateBoard();
