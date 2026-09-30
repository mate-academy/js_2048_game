'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const domMas = [...document.querySelectorAll('tr')].map((tr) => [
  ...tr.children,
]);

let wasPressed = true;

const messageStart = document.querySelector('.message.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

function eventListenerForArrows(buttonStart, buttonRestart) {
  let stateBeforeMove = [];
  let stateAfterMove = [];

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        clearField();

        if (game.getStatus() === 'playing') {
          stateBeforeMove = game.getState().map((row) => [...row]);
          game.moveUp();
          stateAfterMove = [...game.getState()];

          const isChanged = !stateBeforeMove.every((row, i) => {
            return row.every((cell, j) => stateAfterMove[i][j] === cell);
          });

          if (wasPressed && isChanged) {
            buttonStart.replaceWith(buttonRestart);
            wasPressed = false;
          }
        }
        connectJsCellsWithDOM();
        changeScore();
        checkStatus();
        break;
      case 'ArrowDown':
      case 's':
        clearField();

        if (game.getStatus() === 'playing') {
          stateBeforeMove = game.getState().map((row) => [...row]);
          game.moveDown();
          stateAfterMove = [...game.getState()];

          const isChanged = !stateBeforeMove.every((row, i) => {
            return row.every((cell, j) => stateAfterMove[i][j] === cell);
          });

          if (wasPressed && isChanged) {
            buttonStart.replaceWith(buttonRestart);
            wasPressed = false;
          }
        }
        connectJsCellsWithDOM();
        changeScore();
        checkStatus();
        break;
      case 'ArrowLeft':
      case 'a':
        clearField();

        if (game.getStatus() === 'playing') {
          stateBeforeMove = game.getState().map((row) => [...row]);
          game.moveLeft();
          stateAfterMove = [...game.getState()];

          const isChanged = !stateBeforeMove.every((row, i) => {
            return row.every((cell, j) => stateAfterMove[i][j] === cell);
          });

          if (wasPressed && isChanged) {
            buttonStart.replaceWith(buttonRestart);
            wasPressed = false;
          }
        }
        connectJsCellsWithDOM();
        changeScore();
        checkStatus();
        break;
      case 'ArrowRight':
      case 'd':
        clearField();

        if (game.getStatus() === 'playing') {
          stateBeforeMove = game.getState().map((row) => [...row]);
          game.moveRight();
          stateAfterMove = [...game.getState()];

          const isChanged = !stateBeforeMove.every((row, i) => {
            return row.every((cell, j) => stateAfterMove[i][j] === cell);
          });

          if (wasPressed && isChanged) {
            buttonStart.replaceWith(buttonRestart);
            wasPressed = false;
          }
        }
        connectJsCellsWithDOM();
        changeScore();
        checkStatus();
        break;
    }
  });
}

function startTheGame() {
  const buttonStart = document.querySelector('.button.start');
  const buttonRestart = document.createElement('button');

  buttonRestart.classList.add('button');
  buttonRestart.classList.add('restart');
  buttonRestart.textContent = 'Restart';

  eventListenerForArrows(buttonStart, buttonRestart);

  buttonStart.addEventListener('click', (e) => {
    messageStart.classList.add('hidden');

    clearField();
    game.start();
    connectJsCellsWithDOM();
  });

  buttonRestart.addEventListener('click', (e) => {
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    clearField();
    game.restart();
    changeScore();
    wasPressed = true;

    buttonRestart.replaceWith(buttonStart);
  });
}

function connectJsCellsWithDOM() {
  const gameMas = game.getState();

  gameMas.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell !== 0) {
        domMas[i][j].textContent = cell;
        addClassesForColourCells(domMas[i][j]);
      }
    });
  });
}

function clearField() {
  domMas.forEach((row) => {
    row.forEach((cell) => {
      cell.textContent = ' ';
      cell.className = 'field-cell';
    });
  });
}

function changeScore() {
  const scoreDOM = document.querySelector('.game-score');
  const scoreJS = game.getScore();

  scoreDOM.textContent = scoreJS;
}

function checkStatus() {
  const statusTheGame = game.getStatus();

  if (statusTheGame === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statusTheGame === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function addClassesForColourCells(cell) {
  switch (cell.textContent) {
    case '2':
      cell.classList.add('field-cell--2');
      break;
    case '4':
      cell.classList.add('field-cell--4');
      break;
    case '8':
      cell.classList.add('field-cell--8');
      break;
    case '16':
      cell.classList.add('field-cell--16');
      break;
    case '32':
      cell.classList.add('field-cell--32');
      break;
    case '64':
      cell.classList.add('field-cell--64');
      break;
    case '128':
      cell.classList.add('field-cell--128');
      break;
    case '256':
      cell.classList.add('field-cell--256');
      break;
    case '512':
      cell.classList.add('field-cell--512');
      break;
    case '1024':
      cell.classList.add('field-cell--1024');
      break;
    case '2048':
      cell.classList.add('field-cell--2048');
      break;
  }
}

startTheGame();
