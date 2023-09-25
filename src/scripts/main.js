import { Game } from './Game.js';

const game = new Game();
const cells = document.getElementsByClassName('field-cell');
const score = document.getElementById('scoreboard');

const calculateScore = () => {
  score.textContent = Math.max(game.getScore(), +score.textContent).toString();
};

const isGameOver = (field) => {
  const messages = document.getElementsByClassName('message');

  if (Math.max(...field) === 2048) {
    messages[1].classList.remove('hidden');
  }

  if (game.isLose()) {
    messages[0].classList.remove('hidden');
    document.removeEventListener('keydown', mooveField);
  }
};

const renderScreen = () => {
  const field = Game.getFlatMaxtix(game.getField());

  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove(cells[i].classList[1]);
    cells[i].classList.add(`field-cell--${field[i]}`);
  }

  calculateScore(field);

  if (Math.max(...field) === 2048 || Math.min(...field) !== 0) {
    isGameOver(field);
  }
};

const start = () => {
  const messages = document.getElementsByClassName('message');
  const startButton = document.getElementById('start');

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';

  document.addEventListener('keydown', mooveField, false);

  for (const message of messages) {
    message.classList.add('hidden');
  }

  game.resetField();
  renderScreen();
};

const mooveField = (direction) => {
  game.moove(direction);
  renderScreen();
};

document.getElementById('start').addEventListener('click', start, false);
