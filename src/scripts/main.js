const Game = require('../modules/Game.class');
const game = new Game();

const container = document.querySelector('.container');
const gameField = document.querySelector('.game-field');
const button = container.querySelector('.button');
const gameScore = container.querySelector('.game-score');

const fieldCells = [...gameField.querySelectorAll('.field-row')].map((row) => [
  ...row.children,
]);

const messages = {
  idle: container.querySelector('.message-start'),
  lose: container.querySelector('.message-lose'),
  win: container.querySelector('.message-win'),
};

function fillGameField(state) {
  state.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellElement = fieldCells[i][j];

      cellElement.className = cell
        ? `field-cell field-cell--${cell}`
        : 'field-cell';
      cellElement.textContent = cell || '';
    });
  });
}

function showMessage() {
  const gameStatus = game.getStatus();

  Object.keys(messages).forEach((key) => {
    const messageElement = messages[key];

    if (messageElement) {
      messageElement.classList.toggle('hidden', key !== gameStatus);
    }
  });
}

function updateScore(score) {
  gameScore.textContent = score;
}

function handleGameAction() {
  const isStart = button.textContent === 'Start';

  if (isStart) {
    game.start();
    button.textContent = 'Restart';
    button.classList.replace('start', 'restart');
  } else {
    game.restart();
    updateScore(0);
    button.textContent = 'Start';
    button.classList.replace('restart', 'start');
  }

  const state = game.getState();

  fillGameField(state);
  showMessage();
}

button.addEventListener('click', handleGameAction);

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  const moveActions = {
    ArrowUp: game.moveUp,
    ArrowDown: game.moveDown,
    ArrowLeft: game.moveLeft,
    ArrowRight: game.moveRight,
  };

  const action = moveActions[e.key];

  if (action) {
    action.call(game);
    fillGameField(game.getState());
    updateScore(game.getScore());
    showMessage();
  }
});
