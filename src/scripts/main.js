'use strict';

// #region__Variables

const gameCell = document.querySelectorAll('.field-cell');
const button = document.querySelector('button');
const scoreInfo = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const message = document.querySelector('.message-container');

const number = document.querySelector('.game-score-number');
let score = 0;

const Game = require('../modules/Game');
const game = new Game();

// #endregionVariablesLinks

// Animation after page has loaded
function loadPageNotification() {
  messageStart.style.bottom = '40%';

  const startNotif = new Promise((resolve) => {
    window.addEventListener('load', () => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  });

  startNotif.then(() => {
    messageStart.style.opacity = '1';
    messageStart.style.transform = 'scale(1.3)';

    setTimeout(() => {
      const setPositionStartNotif = new Promise((resolve) => {
        resolve();
      });

      setPositionStartNotif
        .then(() => {
          messageStart.style.bottom = '0%';
          messageStart.style.transform = 'scale(1)';

          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          });
        })
        .then(() => {
          button.removeAttribute('disabled');
          button.style.animation = 'button-bloom 1s ease';
        });
    }, 1000);
  });
}
loadPageNotification();

// Function for identify each cell (Creation id such us '0-1' for each cell)
function createId() {
  let x = 0;
  let y = 0;

  gameCell.forEach((item) => {
    item.id = `${x}-${y}`;

    if (y < 3) {
      y++;
    } else {
      x++;
      y = 0;
    }
  });
}
createId();

// Event for button which can represent "Start" or "Restart"
button.addEventListener('click', (e) => {
  message.style.opacity = '0'; // Hide all messages under gameboard
  messageStart.style.opacity = '0';

  // Return location of all messages to initial state
  messageLose.style.bottom = '0%';
  messageWin.style.bottom = '0%';
  messageStart.style.bottom = '0%';

  // Hide all messages under gameboard
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  // Screenplay for activation game and behavior for "Start" botton
  if (button.classList.contains('start')) {
    button.textContent = 'Restart';
    button.style.width = 'auto';
    button.classList.remove('start');
    button.classList.add('restart');

    game.addNumber();
    game.addNumber();
    game.updateBoard();
    // Screenplay for behavior "Start" botton
  } else if (button.classList.contains('restart')) {
    game.getValues().forEach((cellItem) => {
      cellItem.valueNum = undefined;
    });

    game.updateBoard();

    button.textContent = 'Start';
    button.style.width = '75px';
    button.classList.remove('restart');
    button.classList.add('start');
    score = 0;
    scoreInfo.textContent = '0';
  }
});

// Events for keyups for game implementation
document.addEventListener('keyup', (e) => {
  let modifRows; // Array wich represent Game class as rows
  let modifColumns; // Array wich represent Game class as columns

  if (e.code === 'ArrowLeft') {
    checkEmptyCell(); // Checking is there empty cells. If no - game over.

    modifRows = moveLeft(); // Implementation left move behavior
    setScore(); // Update Score in gameboard

    updateBoardArray(modifRows); // Update Game class
    game.updateBoard(); // Update HTML

    game.addNumber(); // add new cell
    game.updateBoard(); // Update HTML
  }

  if (e.code === 'ArrowRight') {
    checkEmptyCell(); // Checking is there empty cells. If no - game over.

    modifRows = moveRight(); // Implementation right move behavior
    setScore(); // Update Score in gameboard

    updateBoardArray(modifRows); // Update Game class
    game.updateBoard(); // Update HTML

    game.addNumber(); // add new cell
    game.updateBoard(); // Update HTML
  }

  if (e.code === 'ArrowDown') {
    checkEmptyCell(); // Checking is there empty cells. If no - game over.

    modifColumns = moveDown(); // Implementation down move behavior
    setScore(); // Update Score in gameboard

    updateBoardArray(modifColumns); // Update Game class
    game.updateBoard(); // Update HTML

    game.addNumber(); // add new cell
    game.updateBoard(); // Update HTML
  }

  if (e.code === 'ArrowUp') {
    checkEmptyCell(); // Checking is there empty cells. If no - game over.

    modifColumns = moveUp(); // Implementation up move behavior
    setScore(); // Update Score in gameboard

    updateBoardArray(modifColumns); // Update Game class
    game.updateBoard(); // Update HTML

    game.addNumber(); // add new cell
    game.updateBoard(); // Update HTML
  }
});

// Updation Game class according to chenges
function updateBoardArray(modifRows, modifColumns) {
  let flatten;

  // Depending on move. There is left/right.
  if (modifRows) {
    flatten = rows.flat(1);
  }

  // There is up/down.
  if (modifColumns) {
    const flatColumns = columns.flat(1);

    flatten = [];

    for (let i = 0; i < flatColumns.length; i += 4) {
      const cell = () => {
        return flatColumns[i];
      };

      flatten.push(cell);
    }
  }

  game.board.forEach((_, i, gameArr) => {
    gameArr[i].valueNum = flatten[i].valueNum;
  });
}

// Creation rows from Game class
function createRows() {
  return game.board.reduce((boardRows, cell) => {
    if (!boardRows[cell.x]) {
      boardRows[cell.x] = [];
    }
    boardRows[cell.x].push(cell);

    return boardRows;
  }, []);
}
// variable for iteration for implementation moves

const rows = createRows();

// Creation columns from Game class
function createColumns() {
  return game.board.reduce((boardColumns, cell) => {
    if (!boardColumns[cell.y]) {
      boardColumns[cell.y] = [];
    }
    boardColumns[cell.y].push(cell);

    return boardColumns;
  }, []);
}
// variable for iteration for implementation moves

const columns = createColumns();

// Implementatiom moveup
function moveUp() {
  columns.forEach((column) => {
    let newColumn = column.map((cellItem) => ({ ...cellItem })); // clone cells

    // remove all empty cells
    newColumn = newColumn.filter((cellItem) => cellItem.valueNum !== undefined);

    // iteration and check, are there duble numbers
    for (let i = 0; i < newColumn.length - 1; i++) {
      if (newColumn[i].valueNum === newColumn[i + 1].valueNum) {
        newColumn[i + 1].valueNum *= 2; // if yes, duble number
        score += newColumn[i + 1].valueNum; // increase score variable
        number.textContent = `+${newColumn[i + 1].valueNum}`; // embed increasing number to 'number' variable, which represent animation over score
        newColumn[i].valueNum = undefined;
      }
    }

    // clear array off underfined
    newColumn = newColumn.filter((cellItem) => cellItem.valueNum !== undefined);

    // add objects for achiving initial column length
    while (newColumn.length < column.length) {
      newColumn.push({ valueNum: undefined });
    }

    // replace initials column values to new values
    for (let i = 0; i < column.length; i++) {
      column[i].valueNum = newColumn[i].valueNum;
    }
  });

  return columns;
}

function moveDown() {
  columns.forEach((column) => {
    let newColumn = column.map((cellItem) => ({ ...cellItem }));

    newColumn = newColumn.filter((cellItem) => cellItem.valueNum !== undefined);

    for (let i = 0; i < newColumn.length - 1; i++) {
      if (newColumn[i].valueNum === newColumn[i + 1].valueNum) {
        newColumn[i + 1].valueNum *= 2;
        score += newColumn[i + 1].valueNum;
        number.textContent = `+${newColumn[i + 1].valueNum}`;
        newColumn[i].valueNum = undefined;
      }
    }

    newColumn = newColumn.filter((cellItem) => cellItem.valueNum !== undefined);

    while (newColumn.length < column.length) {
      newColumn.unshift({ valueNum: undefined });
    }

    for (let i = 0; i < column.length; i++) {
      column[i].valueNum = newColumn[i].valueNum;
    }
  });

  return columns;
}

function moveRight() {
  rows.forEach((row) => {
    let newRow = row.map((cellItem) => ({ ...cellItem }));

    newRow = newRow.filter((cellItem) => cellItem.valueNum !== undefined);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i].valueNum === newRow[i + 1].valueNum) {
        newRow[i + 1].valueNum *= 2;
        score += newRow[i + 1].valueNum;
        number.textContent = `+${newRow[i + 1].valueNum}`;
        newRow[i].valueNum = undefined;
      }
    }

    newRow = newRow.filter((cellItem) => cellItem.valueNum !== undefined);

    while (newRow.length < row.length) {
      newRow.unshift({ valueNum: undefined });
    }

    for (let i = 0; i < row.length; i++) {
      row[i].valueNum = newRow[i].valueNum;
    }
  });

  return rows;
}

function moveLeft() {
  rows.forEach((row) => {
    let newRow = row.filter((cellItem) => cellItem.valueNum !== undefined);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i].valueNum === newRow[i + 1].valueNum) {
        newRow[i].valueNum *= 2;
        score += newRow[i + 1].valueNum;
        number.textContent = `+${newRow[i + 1].valueNum}`;
        newRow[i + 1].valueNum = undefined;
      }
    }

    newRow = newRow.filter((cellItem) => cellItem.valueNum !== undefined);

    while (newRow.length < row.length) {
      newRow.push({ valueNum: undefined });
    }

    for (let i = 0; i < row.length; i++) {
      row[i].valueNum = newRow[i].valueNum;
    }
  });

  return rows;
}

// Updation score and implementation victorious screenplay
function setScore() {
  scoreInfo.textContent = score; // Update HTML
  // set animation class for score
  number.classList.add('animation-number-slide');

  setTimeout(() => {
    number.classList.remove('animation-number-slide');
  }, 800);

  // implementation victorious screenplay
  if (score >= 2048) {
    message.style.opacity = '1';
    messageWin.classList.remove('hidden');

    setTimeout(() => {
      messageWin.style.bottom = '40%';
      messageWin.style.transform = 'scale(1.3)';
    }, 1000);

    document.removeEventListener('keyup');
  }
}

// implementation losing screenplay
function checkEmptyCell() {
  if (game.getRandomCell() === undefined) {
    message.style.opacity = '1';
    messageLose.classList.remove('hidden');
    messageLose.textContent = `You lose with ${score} score`;

    setTimeout(() => {
      messageLose.style.bottom = '40%';
      messageLose.style.transform = 'scale(1.3)';
    }, 1000);

    document.removeEventListener('keyup');
  }
}
