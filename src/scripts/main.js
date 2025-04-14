/* eslint-disable */
import Game from '../modules/Game.class.js';
const game = new Game();

const tableRows = document.getElementsByTagName('tr');
const scoreField = document.querySelector('.game-score');
const startBtn = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function startGame() {
  if (!game.isStarted) {
    game.start();
    updateTable(game.getState(), game.score);
    startMessage.classList.add('hidden');
    startBtn.innerText = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  } else {
    restartGame();
  }

  startBtn.removeEventListener('click', startGame);
  startBtn.addEventListener('click', restartGame);
}

function restartGame() {
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  game.restart();

  updateTable(game.getState(), game.score);

  startBtn.innerText = 'Start';
  startBtn.classList.remove('restart');
  startBtn.classList.add('start');

  startBtn.removeEventListener('click', restartGame);
  startBtn.addEventListener('click', startGame);
}

startBtn.addEventListener('click', startGame);

startBtn.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    game.move(e.key);
    updateTable(game.getState(), game.score);
    checkStatusAndShowMessage();
  }
});

function updateTable(state, score) {
  const rows = [...tableRows];

  for (let i = 0; i < state.length; i++) {
    const row = [...rows[i].querySelectorAll('td')];

    for (let k = 0; k < state[i].length; k++) {
      const value = state[i][k];

      row[k].innerText = '';
      row[k].className = 'field-cell';

      if (value) {
        row[k].innerText = value;
        row[k].classList.add(`field-cell--${value}`);
      }
    }
  }

  scoreField.innerText = score;
}

function checkStatusAndShowMessage() {
  const statuses = game.statusValues;

  switch (game.getStatus()) {
    case statuses.win:
      winMessage.classList.remove('hidden');
      break;
    case statuses.lose:
      loseMessage.classList.remove('hidden');
      break;
  }
}
