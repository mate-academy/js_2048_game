'use strict';

// > Comments

// TODO: Change to row and col indices together with game.lastIndex.
// TODO: Error handling for errors thrown by Game instances.
// Maybe there's a better way to assign values to cells
// Maybe I should move nodes in the DOM for better animations,
//    not just reassign values.
// I can create a custom gameboardchange event listener.
//    I could make this a method of a game, which takes an HTMLCollection
//    and fills it.
// TODO?: Add and remove respective listeners to not have to
// TODO?:     perform those checks in every situation.

// > Imports

const Game = require('../modules/Game.class');
const { ACTIONS, STATUSES } = require('../shared/constants');

// > Initiating

const game = new Game();

// * ??
let currentState = game.getState();
let currentStatus = game.getStatus();
let currentScore = game.getScore();

// > Config

const CONTROLS = {
  ArrowLeft: ACTIONS.MOVE_LEFT,
  ArrowRight: ACTIONS.MOVE_RIGHT,
  ArrowUp: ACTIONS.MOVE_UP,
  ArrowDown: ACTIONS.MOVE_DOWN,
};

const LASTINDEX = game.lastIndex;

// > Methods

function fillBoard(state) {
  for (let rowIndex = 0; rowIndex <= LASTINDEX; rowIndex++) {
    const HTMLRow = rows[rowIndex];
    const stateRow = state[rowIndex];

    for (let colIndex = 0; colIndex <= LASTINDEX; colIndex++) {
      const cell = HTMLRow.children[colIndex];
      const value = stateRow[colIndex];

      // const prevValue = cell.innerText;
      cell.innerText = value;
      cell.className = `field-cell field-cell--${value}`;
    }
  }
}

function startTheGame(gameInstance) {
  gameInstance.start();

  button.classList.add('restart');
  button.classList.remove('start');
  button.innerText = 'Restart';

  messageStart.classList.add('hidden');

  parseState();
}

function restartTheGame(gameInstance) {
  gameInstance.restart();

  if (!messageWin.classList.contains('hidden')) {
    messageWin.classList.add('hidden');
  }

  if (!messageLose.classList.contains('hidden')) {
    messageLose.classList.add('hidden');
  }

  parseState();
}

function parseState() {
  currentState = game.getState();

  fillBoard(currentState);

  currentScore = game.getScore();
  scoreDisplay.innerText = currentScore;

  currentStatus = game.getStatus();

  switch (currentStatus) {
    case STATUSES.WIN:
      messageWin.classList.remove('hidden');
      break;
    case STATUSES.LOSE:
      messageLose.classList.remove('hidden');
      break;
    default:
  }
}

// > HTML references

const rows = document.querySelector('.game-field').tBodies[0].children;
const scoreDisplay = document.querySelector('.game-score');
const button = document.querySelector('button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

// > Listeners

document.addEventListener('keydown', (e) => {
  if (currentStatus === STATUSES.LOSE) {
    return;
  }

  if (currentStatus === STATUSES.IDLE) {
    startTheGame(game);

    return;
  }

  const key = CONTROLS[e.code];

  if (key === undefined) {
    return;
  }

  game.action(key);

  parseState();
});

button.addEventListener('click', (e) => {
  if (currentStatus === STATUSES.IDLE) {
    startTheGame(game);

    return;
  }

  restartTheGame(game);
});
