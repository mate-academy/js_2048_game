'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  startGame();

  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.restart').classList.remove('hidden');
  startButton.classList.add('hidden');
});

const restartButton = document.querySelector('.restart');

restartButton.addEventListener('click', () => {
  startGame();
});

document.addEventListener('keydown', (e) => {
  const isPlaying = game.getStatus() === 'playing';

  if (e.key.toLowerCase() === 'r') {
    youAreRickrolled();

    return;
  }

  if (!isPlaying) {
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
  }

  if (moved) {
    renderBoard(game.getState());
    setScore(game.getScore());
  }
  checkStatus(game.getStatus());
});

function startGame() {
  game.start();
  renderBoard(game.getState());

  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  for (const message of [winMessage, loseMessage]) {
    if (!message.classList.contains('hidden')) {
      message.classList.add('hidden');
    }
  }
}

function youAreRickrolled() {
  const container = document.querySelector('.rickroll-container');

  if (!container.hasChildNodes()) {
    const iframe = document.createElement('iframe');

    iframe.width = '450';
    iframe.height = '300';

    iframe.src =
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1';
    iframe.title = 'Rick Astley - Never Gonna Give You Up';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;

    container.appendChild(iframe);
    container.style.display = 'block';
  } else {
    container.innerHTML = '';
    container.style.display = 'none';
  }
}

function checkStatus(currentStatus) {
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');

  if (currentStatus === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (currentStatus === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

function setScore(score) {
  const scoreBoard = document.querySelector('.game-score');

  scoreBoard.textContent = score;
}

function renderBoard(board) {
  const cells = document.querySelectorAll('.field-cell');
  const flatBoard = board.flat();

  flatBoard.forEach((value, index) => {
    const cell = cells[index];

    cell.className = 'field-cell';

    cell.textContent = '';

    if (value > 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  });
}
