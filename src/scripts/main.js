import Game from '../modules/Game.class.js';

const game = new Game();

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const score = document.querySelector('.game-score');

const button = document.querySelector('button');

button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
    game.start();
    renderBoard();
  } else {
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
    game.restart();
    renderBoard();
  }
});

const tbodyRows = Array.from(document.querySelectorAll('tr'));

function renderBoard() {
  const currentState = game.getState();
  const currentStatus = game.getStatus();

  for (let i = 0; i < tbodyRows.length; i++) {
    const cells = Array.from(tbodyRows[i].querySelectorAll('td'));

    for (let j = 0; j < cells.length; j++) {
      cells[j].textContent = currentState[i][j] || '';
      cells[j].className = `field-cell field-cell--${currentState[i][j]}`;
    }
  }
  score.textContent = game.getScore();

  switch (currentStatus) {
    case 'idle':
      messageStart.classList.remove('hidden');
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
      break;
    case 'playing':
      messageStart.classList.add('hidden');
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
      break;
    case 'lose':
      messageStart.classList.add('hidden');
      messageWin.classList.add('hidden');
      messageLose.classList.remove('hidden');
      break;
    case 'win':
      messageStart.classList.add('hidden');
      messageWin.classList.remove('hidden');
      messageLose.classList.add('hidden');
      break;
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    game.moveUp();
    renderBoard();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    renderBoard();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    renderBoard();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    renderBoard();
  }
});
