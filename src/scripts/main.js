import Game from '../modules/Game.class.js';

const game = new Game();

window.game = game;

const startButton = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function updateUI() {
  const board = game.getState();
  const score = game.getScore();
  const gameSt = game.getStatus();

  let index = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = board[r][c];

      cells[index].textContent = val === 0 ? '' : val;
      cells[index].className = 'field-cell';

      if (val > 0) {
        cells[index].classList.add(`tile-${val}`);
      }
      index++;
    }
  }

  if (scoreElement) {
    scoreElement.textContent = score;
  }

  if (startButton) {
    if (gameSt === 'playing' || gameSt === 'win' || gameSt === 'lose') {
      startButton.classList.add('restart');
    } else {
      startButton.classList.remove('restart');
    }
  }

  startMessage?.classList.add('hidden');
  winMessage?.classList.add('hidden');
  loseMessage?.classList.add('hidden');

  if (gameSt === 'win') {
    winMessage?.classList.remove('hidden');
  } else if (gameSt === 'lose') {
    loseMessage?.classList.remove('hidden');
  } else if (gameSt === 'idle') {
    startMessage?.classList.remove('hidden');
  }
}

if (startButton) {
  startButton.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      game.start();
    } else {
      game.restart();
    }
    updateUI();
  });
}

window.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  if (e.key === 'ArrowLeft') {
    moved = game.moveLeft();
  }

  if (e) {
    moved = game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    moved = game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    moved = game.moveDown();
  }

  if (moved) {
    updateUI();
  }
});

updateUI();
