const Game = require('../modules/Game.class');
const size = 4;
const borderSpacing = 10;
const cellSize = 75;
let isMoving = false;
const game = new Game({ size });
const gameField = document.querySelector('.game-field');
const startButton = document.querySelector('.button');
const scoreDisplay = document.querySelector('.game-score');
const messageDisplay = document.querySelector('.message');
let gameState = game.getState();
let gameStatus = game.getStatus();
const KEY_UP = 'ArrowUp';
const KEY_DOWN = 'ArrowDown';
const KEY_LEFT = 'ArrowLeft';
const KEY_RIGHT = 'ArrowRight';
const KEY_ENTER = 'Enter';
const arrowKeys = [KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT];
const updateGameMessage = messageUpdater();
const gameBoard = createGameBoard(gameState, `${cellSize}px`);
const messages = {
  lose: 'You lose! Restart the game?',
  win: 'Winner! Congrats! You did it!',
  playing: 'You can do it!!!',
};

gameField.style.borderSpacing = `${borderSpacing}px`;
gameField.append(gameBoard);

document.addEventListener('keyup', handleEnterKey);
startButton.addEventListener('click', handleStartButtonClick);

function handleEnterKey(e) {
  e.preventDefault();

  if (e.key === KEY_ENTER) {
    startButton.click();
  }
}

function handleStartButtonClick(e) {
  if (e.target.classList.contains('start')) {
    e.target.classList.replace('start', 'restart');
    e.target.innerText = 'Restart';
    gameState = game.start();
    document.addEventListener('keyup', handleArrowKeys);
  } else if (e.target.classList.contains('restart')) {
    gameState = game.restart();
    scoreDisplay.innerText = game.getScore();
  }

  updateBoard(gameState, gameBoard);
  gameStatus = game.getStatus();
  updateGameMessage(gameStatus, messageDisplay, messages);
  e.target.blur();
}

function handleArrowKeys(e) {
  gameStatus = game.getStatus();

  if (arrowKeys.includes(e.key) && !isMoving && gameStatus !== 'lose') {
    isMoving = true;

    switch (e.key) {
      case KEY_UP:
        gameState = game.moveUp();
        break;
      case KEY_DOWN:
        gameState = game.moveDown();
        break;
      case KEY_LEFT:
        gameState = game.moveLeft();
        break;
      case KEY_RIGHT:
        gameState = game.moveRight();
        break;
    }

    animateMoves(game.getChanges(), gameField, cellSize, borderSpacing)
      .then(() => updateBoard(gameState, gameBoard))
      .then(() => {
        game.clearChangesList();
        isMoving = false;
        scoreDisplay.innerText = game.getScore();
      });

    gameStatus = game.getStatus();
    updateGameMessage(gameStatus, messageDisplay, messages);
  }
}

function updateBoard(state, board) {
  return new Promise((resolve) => {
    for (const row of board.rows) {
      for (const cell of row.children) {
        const cellContent = cell.firstChild;
        const cellValue = state[row.rowIndex][cell.cellIndex];

        cellContent.innerText = cellValue > 0 ? cellValue : '';
        cellContent.className = 'field-cell-inner';

        if (cellValue > 0) {
          cellContent.classList.add(
            cellValue >= 2048
              ? 'field-cell-inner--2048'
              : `field-cell-inner--${cellValue}`,
          );
        }

        cellContent.style.transition = 'transform 0s';
        cellContent.style.transform = '';
      }
    }
    resolve();
  });
}

function createGameBoard(gameStr, sizeOfCell) {
  const tbody = document.createElement('tbody');

  gameStr.forEach((row) => {
    const rowElement = document.createElement('tr');

    row.forEach((cell) => {
      const cellElement = document.createElement('td');
      const cellInner = document.createElement('div');

      cellElement.className = 'field-cell';
      cellInner.className = 'field-cell-inner';
      cellInner.style.width = sizeOfCell;
      cellInner.style.height = sizeOfCell;

      cellElement.append(cellInner);
      rowElement.append(cellElement);
    });

    tbody.append(rowElement);
  });

  return tbody;
}

function animateMoves(
  { direction, side, moves },
  table,
  sizeOfCell,
  borderSize,
) {
  return new Promise((resolve) => {
    if (moves.length > 0) {
      let completedMoves = 0;

      moves.forEach((move) => {
        const cell =
          table.tBodies[0].children[move.from[0]].children[move.from[1]]
            .firstChild;
        const distance =
          direction === 'Y'
            ? Math.abs(move.from[0] - move.to[0]) * (sizeOfCell + borderSize)
            : Math.abs(move.from[1] - move.to[1]) * (sizeOfCell + borderSize);

        cell.style.transition = 'transform 0.1s';
        cell.style.transform = `translate${direction}(${side}${distance}px)`;

        cell.addEventListener(
          'transitionend',
          () => {
            completedMoves += 1;

            if (completedMoves === moves.length) {
              resolve();
            }
          },
          { once: true },
        );
      });
    } else {
      resolve();
    }
  });
}

function messageUpdater() {
  let oldStatus = 'idle';

  return (currentStatus, element, messagesOption) => {
    if (currentStatus !== oldStatus) {
      if (currentStatus === 'playing') {
        element.classList.add(`hidden`);
      } else {
        element.className = 'message';
        element.classList.add(`message-${currentStatus}`);
        element.innerText = messagesOption[currentStatus];
      }
      oldStatus = currentStatus;
    }
  };
}
