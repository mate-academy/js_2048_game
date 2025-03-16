const Game = require('../modules/Game.class');
const game = new Game();
const buttonStart = document.querySelector('.start');

document.querySelector('.start').addEventListener('click', () => {
  game.start();
  document.querySelector('.message-start').style.display = 'none';
  document.querySelector('.message-lose').classList.add('hidden');
  updateGameDisplay();

  buttonStart.classList.remove('start');
  buttonStart.classList.add('restart');
  buttonStart.textContent = 'Restart';
});

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

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

  updateGameDisplay();
});

function updateGameDisplay() {
  const { board, score, statusGame } = game.getState();

  const fieldCells = document.querySelectorAll('.field-cell');

  fieldCells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    const oldClass = [...cell.classList].find(
      (className) => className.startsWith('field-cell--'),
      // eslint-disable-next-line
  );

    if (oldClass) {
      cell.classList.remove(oldClass);
    }

    // eslint-disable-next-line
    cell.textContent = value ? value : '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  document.querySelector('.game-score').textContent = score;

  if (statusGame === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (statusGame === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  } else {
    document.querySelector('.message-start').classList.remove('hidden');
  }
}
