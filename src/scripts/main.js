import Game from '../modules/Game.class';

const game = new Game();

const gameField = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

function hideAllMessages() {
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
}

function updateBoard() {
  const boardState = game.getState();
  const cells = gameField.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;

    if (!boardState[row] || boardState[row][col] === undefined) {
      return;
    }

    const value = boardState[row][col];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

function updateStatus() {
  const st = game.getStatus();

  if (game.isStarted) {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    startButton.textContent = 'Start';
    startButton.classList.add('start');
    startButton.classList.remove('restart');
  }

  hideAllMessages();

  if (st === 'win') {
    messageWin.classList.remove('hidden');
  } else if (st === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (st === 'idle') {
    messageStart.classList.remove('hidden');
  }
}

function updateUI() {
  updateBoard();
  updateScore();
  updateStatus();
}

function handleStartClick() {
  if (game.getStatus() === 'playing' || game.isStarted) {
    game.restart();
  } else {
    game.start();
  }
  updateUI();
}

function handleKeyDown(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    default:
      return;
  }

  if (moved) {
    e.preventDefault();
    updateUI();
  }
}

function init() {
  if (!startButton || !gameField || !scoreElement) {
    return;
  }

  startButton.addEventListener('click', handleStartClick);
  document.addEventListener('keydown', handleKeyDown);

  updateUI();
}

init();
