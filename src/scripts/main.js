import { Game } from '../modules/Game.class.js';

const game = new Game();

const boardElement = document.getElementById('board');
const scoreElement = document.getElementById('score');
const statusMessageElement = document.getElementById('status-message');
const startBtn = document.getElementById('start-btn');

function render() {
  const board = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  if (scoreElement) {
    scoreElement.textContent = score;
  }

  if (boardElement) {
    boardElement.innerHTML = '';

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cellValue = board[r][c];
        const cellDiv = document.createElement('div');

        cellDiv.className = `cell cell-${cellValue}`;
        cellDiv.textContent = cellValue > 0 ? cellValue : '';
        boardElement.appendChild(cellDiv);
      }
    }
  }

  if (statusMessageElement) {
    if (gameStatus === 'win') {
      statusMessageElement.textContent = 'Вітаємо! Ви зібрали 2048!';
      statusMessageElement.className = 'status-message win';
    } else if (gameStatus === 'lose') {
      statusMessageElement.textContent = 'Гра закінчена! Немає можливих ходів.';
      statusMessageElement.className = 'status-message lose';
    } else if (gameStatus === 'playing') {
      statusMessageElement.textContent = 'Гра триває...';
      statusMessageElement.className = 'status-message playing';
    } else {
      statusMessageElement.textContent = 'Натисніть "Start", щоб почати гру!';
      statusMessageElement.className = 'status-message idle';
    }
  }
}

document.addEventListener('keydown', (e) => {
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
    render();
  }
});

if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      game.start();
      startBtn.textContent = 'Restart';
    } else {
      game.restart();
    }
    render();
  });
}

render();
