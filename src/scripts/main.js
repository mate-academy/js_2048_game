/* eslint-disable no-console */
'use strict';
import Hammer from 'hammerjs';

const Game = require('../modules/Game.class');
const game = new Game();

const table = document.querySelector('tbody');
let boardState = game.getState();
const gameScoreText = document.querySelector('.game-score');
const gameScoreRecordText = document.querySelector('.record');
let gameScore = 0;
let highScore = parseInt(localStorage.getItem('highScore')) || 0;

gameScoreRecordText.textContent = highScore;
console.log(game.getStatus());

const displayText = () => {
  gameScore = 0;

  Array.from(table.rows).forEach((row) => {
    Array.from(row.cells).forEach((cell) => {
      const cellValue = parseFloat(cell.textContent) || 0;

      gameScore += cellValue;
    });
  });

  gameScoreText.textContent = `${gameScore}`;

  if (gameScore > highScore) {
    highScore = gameScore;
    localStorage.setItem('highScore', highScore);
    gameScoreRecordText.textContent = highScore;
  }
};

const startGameBoard = () => {
  const randomRow1 = Math.floor(Math.random() * boardState.length);
  const randomCol1 = Math.floor(Math.random() * boardState[randomRow1].length);
  const randomChance1 = Math.random();

  const randomValue1 = randomChance1 < 0.1 ? 4 : 2;

  let randomRow2, randomCol2, randomValue2;
  let positionIsSame = true;

  do {
    randomRow2 = Math.floor(Math.random() * boardState.length);
    randomCol2 = Math.floor(Math.random() * boardState[randomRow2].length);

    const randomChance2 = Math.random();

    randomValue2 = randomChance2 < 0.1 ? 4 : 2;

    positionIsSame = randomRow1 === randomRow2 && randomCol1 === randomCol2;
  } while (positionIsSame);

  boardState[randomRow1][randomCol1] = randomValue1;
  boardState[randomRow2][randomCol2] = randomValue2;
};

const renderDom = (direction) => {
  Array.from(table.rows).forEach((row) => {
    Array.from(row.cells).forEach((cell) => {
      cell.textContent = '';
      cell.classList.remove(...cell.classList);
      cell.classList.add('field-cell');
    });
  });

  const movedCells = game.getMovedCells();

  Array.from(table.rows).forEach((row, rowIndex) => {
    Array.from(row.cells).forEach((cell, cellIndex) => {
      const value = boardState[rowIndex][cellIndex];

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);

        const isMoved = movedCells.some(
          (movedCell) =>
            movedCell.row === rowIndex && movedCell.col === cellIndex,
        );

        if (isMoved && direction) {
          cell.classList.add(`field-cell-moving-${direction}`);
        }
      }

      setTimeout(() => {
        if (direction) {
          cell.classList.remove(`field-cell-moving-${direction}`);
        }
      }, 100);
    });
  });
};

const startGame = () => {
  startGameBoard();
  renderDom();
};

const buttonStart = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const restart = () => {
  game.status = 'idle';
  game.restart();
  boardState = game.getState();
  renderDom();

  buttonStart.textContent = 'Start';
  buttonStart.classList.remove('restart');
  buttonStart.classList.add('start');
};

const iWin = () => {
  let isWin = false;

  Array.from(table.rows).forEach((row, rowIndex) => {
    Array.from(row.cells).forEach((cell, cellIndex) => {
      const value = boardState[rowIndex][cellIndex];

      if (value === 2048) {
        isWin = true;
      }
    });
  });

  if (isWin) {
    game.status = 'win';
    messageWin.classList.remove('hidden');
  }
};

const handleMove = (direction) => {
  let canMove = false;

  if (direction === 'up' && game.canMoveUp()) {
    game.moveUp();
    canMove = true;
  } else if (direction === 'down' && game.canMoveDown()) {
    game.moveDown();
    canMove = true;
  } else if (direction === 'left' && game.canMoveLeft()) {
    game.moveLeft();
    canMove = true;
  } else if (direction === 'right' && game.canMoveRight()) {
    game.moveRight();
    canMove = true;
  }

  if (canMove) {
    renderDom(direction);
    displayText();

    if (
      !game.canMoveUp() &&
      !game.canMoveDown() &&
      !game.canMoveLeft() &&
      !game.canMoveRight() &&
      game.getStatus() !== 'idle'
    ) {
      game.status = 'lose';
      messageLose.classList.remove('hidden');
    }
    iWin();
  }
};

document.addEventListener('click', (e) => {
  if (e.target === buttonStart && game.getStatus() === 'idle') {
    game.status = 'playing';
    game.start();
    startGame();
    displayText();

    buttonStart.textContent = 'Restart';
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    messageStart.classList.add('hidden');

    document.addEventListener('keydown', (ev) => {
      const keyDirection = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      if (keyDirection[ev.key]) {
        handleMove(keyDirection[ev.key]);
      }
    });
  } else if (e.target === buttonStart && game.getStatus() !== 'idle') {
    restart();
    messageLose.classList.add('hidden');
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
  }
});

const hammer = new Hammer(document.body);

hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

hammer.on('swipeleft', () => handleMove('left'));
hammer.on('swiperight', () => handleMove('right'));
hammer.on('swipeup', () => handleMove('up'));
hammer.on('swipedown', () => handleMove('down'));
