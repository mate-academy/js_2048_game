'use strict';

const CLASSNAME = Object.freeze({
  Start: 'start',
  Restart: 'restart',
  Hidden: 'hidden',
  ActionButton: 'button',
});
const LABEL = Object.freeze({
  Start: 'Start',
  Restart: 'Restart',
});

const Game = require('../modules/Game.class');

// initialize the game with parameters:
/**
 * const game = new Game({
      startTilesAmount: 5,
      initialState: [
        [0, 0, 0, 0],
        [0, 4, 0, 0],
        [0, 0, 9, 0],
        [0, 0, 0, 2],
      ],
      forcePowerOfTwo: true,
});
 */
const game = new Game();

const gameContainer = document.querySelector('.container');
const actionButton = gameContainer.querySelector('.controls button');
const scoreInfo = gameContainer.querySelector('.controls .info');
const scoreNumberField = gameContainer.querySelector('.controls .game-score');
const gameGrid = gameContainer.querySelector('.game-field tbody');
const messageStart = gameContainer.querySelector('.message-start');
const messageWin = gameContainer.querySelector('.message-win');
const messageLose = gameContainer.querySelector('.message-lose');

function renderGame() {
  updateScoreDisplay();
  updateGameBoard();
  updateGameStatusMessage();
}

function updateScoreDisplay() {
  scoreNumberField.textContent = game.getScore();
}

function updateGameStatusMessage() {
  const gameStatus = game.getStatus();
  const isGameIdle = gameStatus === Game.STATUS.Idle;

  messageStart.classList.add(CLASSNAME.Hidden);
  messageWin.classList.add(CLASSNAME.Hidden);
  messageLose.classList.add(CLASSNAME.Hidden);

  actionButton.classList.remove(CLASSNAME.Restart, CLASSNAME.Start);

  actionButton.classList.add(isGameIdle ? CLASSNAME.Start : CLASSNAME.Restart);
  actionButton.textContent = isGameIdle ? LABEL.Start : LABEL.Restart;

  switch (gameStatus) {
    case Game.STATUS.Idle:
      messageStart.classList.remove(CLASSNAME.Hidden);
      break;
    case Game.STATUS.Won:
      messageWin.classList.remove(CLASSNAME.Hidden);
      break;
    case Game.STATUS.Lost:
      messageLose.classList.remove(CLASSNAME.Hidden);
      break;
  }
}

function updateGameBoard() {
  const grid = game.getState();
  const numRows = gameGrid.rows.length;
  const numCols = gameGrid.rows[0].cells.length;

  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      const cell = gameGrid.rows[rowIndex].cells[colIndex];
      const value = grid[rowIndex][colIndex];

      cell.textContent = value || '';
      cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
    }
  }
}

document.addEventListener('keydown', (ev) => {
  const gameStatus = game.getStatus();
  const validKeyPressed = Game.MOVE_KEYS.includes(ev.key);

  if (!validKeyPressed) {
    return;
  }

  ev.preventDefault();

  if (gameStatus === Game.STATUS.Playing) {
    game.move(ev.key);
    renderGame();
  }
});

actionButton.addEventListener('click', () => {
  if (game.getStatus() === Game.STATUS.Idle) {
    game.start();
  } else {
    game.restart();
  }
  renderGame();
});

scoreInfo.addEventListener('click', () => {
  // eslint-disable-next-line no-console
  console.log(game.getState());
});

renderGame();
