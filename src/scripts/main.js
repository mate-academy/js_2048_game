import Game from '../modules/Game.class';

const game = new Game();

// DOM Elements
const gameBoard = document.querySelector('.game-field tbody');
const scoreDisplay = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

/**
 * Renders the game board, score, and messages based on the game state.
 */
function render() {
  const boardState = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  // Update score
  scoreDisplay.textContent = score;

  // Update board
  const cells = gameBoard.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = boardState[row][col];

    // Reset cell
    cell.textContent = '';
    cell.className = 'field-cell'; // Resets all other classes

    if (value > 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  });

  // Update messages and button
  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');

  // Update button text and class
  if (gameStatus === 'idle') {
    startButton.textContent = 'Start';
    startButton.classList.add('start');
    startButton.classList.remove('restart');
  } else {
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    startButton.classList.remove('start');
  }
}

// Initial render
render();

// Event Listeners
startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let boardChanged = false;

  switch (e.key) {
    case 'ArrowLeft':
      boardChanged = game.moveLeft();
      break;
    case 'ArrowRight':
      boardChanged = game.moveRight();
      break;
    case 'ArrowUp':
      boardChanged = game.moveUp();
      break;
    case 'ArrowDown':
      boardChanged = game.moveDown();
      break;
  }

  if (boardChanged) {
    render();
  }
});
