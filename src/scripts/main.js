/* eslint-disable */
import Game from '../modules/Game.class.js';
const game = new Game();

const tableRows = document.getElementsByTagName('tr');
const scoreField = document.querySelector('.game-score');
const startBtn = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

startBtn.addEventListener(
  'click',
  () => {
    game.start();

    updateTable(game.getState(), game.score);

    startMessage.classList.add('hidden');

    startBtn.innerText = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');

    startBtn.addEventListener('click', () => {
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');

      game.restart();
      updateTable(game.getState(), game.score);
    });
  },
  { once: true },
);

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
      row[k].innerText = state[i][k] ? state[i][k] : '';
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
