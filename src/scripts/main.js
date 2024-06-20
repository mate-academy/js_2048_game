'use strict';

const startButton = document.body.querySelector('button');
const table = document.body.querySelector('table');
const rowsLength = table.querySelectorAll('tr').length;
const score = document.body.querySelector('.game-score');

startButton.addEventListener('click', () => {
  start();
});

function start() {
  const tds = table.querySelectorAll('td');

  startButton.classList.remove('start');
  startButton.classList.add('restart');

  tds.forEach((td) => {
    td.innerText = '';
    td.classList = 'field-cell';
  });

  const messages = document.body.querySelectorAll('.message');

  startButton.innerText = 'Restart';

  messages.forEach((message) => {
    if (!message.classList.contains('hidden')) {
      message.classList.add('hidden');
    }
  });

  score.innerText = 0;
  addRandomCell();
  addRandomCell();
  setClass();
}

document.addEventListener('keydown', (e) => {
  e.preventDefault();
});

document.addEventListener('keyup', (e) => {
  e.preventDefault();

  const hasStartButton = startButton.innerText === 'Start';

  if (getWin()) {
    return;
  }

  if (e.code === 'ArrowLeft') {
    if (hasStartButton) {
      start();

      return;
    }

    slideLeft();
  }

  if (e.code === 'ArrowRight') {
    if (hasStartButton) {
      start();

      return;
    }

    slideRight();
  }

  if (e.code === 'ArrowUp') {
    if (hasStartButton) {
      start();

      return;
    }

    slideUp();
  }

  if (e.code === 'ArrowDown') {
    if (hasStartButton) {
      start();

      return;
    }

    slideDown();
  }
});

function addRandomCell(oldFlatBoardCopy = []) {
  const flatBoard = convertToNumberBoard().flat();
  const isStartBoard = flatBoard.filter((el) => el).length < 2;
  const hasBoardChange = !oldFlatBoardCopy.every(
    (el, index) => el === flatBoard[index],
  );

  const allcells = Array.from(table.querySelectorAll('td'));
  const emptyCells = allcells.filter((cell) => !cell.innerText);
  const randomNumber = Math.floor(Math.random() * (emptyCells.length - 1));
  const randomCell = emptyCells[randomNumber];

  if (!emptyCells.length && !cheackPossibleMovement()) {
    const loseMessage = document.querySelector('.message-lose');

    loseMessage.classList.remove('hidden');

    return;
  }

  if (!hasBoardChange && !isStartBoard) {
    return;
  }

  if (randomCell) {
    randomCell.innerText = Math.random() < 0.9 ? 2 : 4;
  }
}

function cheackPossibleMovement() {
  const board = convertToNumberBoard();

  for (let r = 0; r < rowsLength; r++) {
    for (let i = 0; i < rowsLength; i++) {
      const currentCell = board[r][i];
      const rightCell = board[r] && board[r][i + 1];
      const downCell = board[r + 1] && board[r + 1][i];

      if (currentCell === rightCell || currentCell === downCell) {
        return true;
      }
    }
  }

  return false;
}

function slideLeft() {
  const board = convertToNumberBoard();
  const flatBoardCopy = [...board].flat();

  for (let i = 0; i < rowsLength; i++) {
    let row = board[i];

    row = slide(row);
    board[i] = row;
  }

  const flatBoard = board.flat();

  convertToTableBoard(flatBoard);
  addRandomCell(flatBoardCopy);
  setClass();
}

function slideRight() {
  const board = convertToNumberBoard();
  const flatBoardCopy = [...board].flat();

  for (let i = 0; i < rowsLength; i++) {
    let row = board[i];

    row.reverse();
    row = slide(row);
    row.reverse();

    board[i] = row;
  }

  const flatBoard = board.flat();

  convertToTableBoard(flatBoard);
  addRandomCell(flatBoardCopy);
  setClass();
}

function slideUp() {
  const board = convertToNumberBoard();
  const flatBoardCopy = [...board].flat();

  for (let c = 0; c < rowsLength; c++) {
    let row = [];

    for (let r = 0; r < rowsLength; r++) {
      row.push(board[r][c]);
    }

    row = slide(row);

    for (let r = 0; r < rowsLength; r++) {
      board[r][c] = row[r];
    }
  }

  const flatBoard = board.flat();

  convertToTableBoard(flatBoard);
  addRandomCell(flatBoardCopy);
  setClass();
}

function slideDown() {
  const board = convertToNumberBoard();
  const flatBoardCopy = [...board].flat();

  for (let c = 0; c < rowsLength; c++) {
    let row = [];

    for (let r = 0; r < rowsLength; r++) {
      row.push(board[r][c]);
    }

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rowsLength; r++) {
      board[r][c] = row[r];
    }
  }

  const flatBoard = board.flat();

  convertToTableBoard(flatBoard);
  addRandomCell(flatBoardCopy);
  setClass();
}

function setClass() {
  const tds = table.querySelectorAll('td');

  tds.forEach((td) => {
    td.classList = 'field-cell';

    if (td.innerText) {
      td.classList.add(`field-cell--${td.innerText}`);
    }
  });
}

function slide(row) {
  let filteredRow = filterZero(row);

  for (let i = 0; i < filteredRow.length; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      filteredRow[i + 1] = 0;
      score.innerText = Number(score.innerText) + filteredRow[i];
    }
  }

  filteredRow = filterZero(filteredRow);

  while (filteredRow.length < rowsLength) {
    filteredRow.push(0);
  }

  return filteredRow;
}

function filterZero(row) {
  return row.filter((cell) => cell);
}

function convertToNumberBoard() {
  const trs = Array.from(table.querySelector('tbody').children);
  const mainBoard = [];

  trs.map((tr) => {
    const row = [];

    mainBoard.push(row);

    [...tr.children].forEach((td) => {
      row.push(+td.innerText);
    });
  });

  return mainBoard;
}

function convertToTableBoard(board) {
  const allCells = Array.from(table.querySelectorAll('td'));

  for (let i = 0; i < allCells.length; i++) {
    allCells[i].innerText = board[i] === 0 ? '' : board[i];
  }
}

function getWin() {
  const tds = table.querySelectorAll('td');
  const winMessage = document.body.querySelector('.message-win');

  tds.forEach((td) => {
    if (td.innerText === '2048') {
      winMessage.classList.remove('hidden');
    }
  });

  if (!winMessage.classList.contains('hidden')) {
    return true;
  }
}
