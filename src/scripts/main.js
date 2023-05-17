'use strict';

const button = document.querySelector('button');
const gameScore = document.querySelector('.game-score');
const cells = document.body.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const makeState = (cellsBoard) =>
  Array.from(cellsBoard)
    .map((cell, index) =>
      ({
        x: index % 4,
        y: Math.floor(index / 4),
        value: Number(cell.innerText),
      }));

let state = makeState(cells);

const clickHandler = (e) => {
  document.body.addEventListener('keyup', keyUpHandler);

  if (button.innerText === 'Start') {
    button.innerText = 'Restart';
    button.className = 'button restart';
    messageStart.classList.toggle('hidden');
  } else {
    gameScore.innerText = 0;
  }
  messageWin.className = 'message message-win hidden';
  messageLose.className = 'message message-lose hidden';
  resetCells(cells);

  state = makeState(cells);
  setTwoOrFour(state);
  setTwoOrFour(state);
};
const keyUpHandler = (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      arrowLeft(state);

      if (isWin(state)) {
        break;
      }
      setTwoOrFour(state);
      isLose(state);
      break;
    case 'ArrowRight':
      arrowRight(state);

      if (isWin(state)) {
        break;
      }
      setTwoOrFour(state);
      isLose(state);
      break;
    case 'ArrowDown':
      arrowDown(state);

      if (isWin(state)) {
        break;
      }
      setTwoOrFour(state);
      isLose(state);
      break;
    case 'ArrowUp':
      arrowUp(state);

      if (isWin(state)) {
        break;
      }
      setTwoOrFour(state);
      isLose(state);
      break;
    default:
  }
};

button.addEventListener('click', clickHandler);

const size = Math.log2(cells.length);

function getRandomZeroCell(stateBoard) {
  const filterZero = (board) =>
    board.filter(cell => cell.value === 0);
  const randomIndex = () =>
    Math.floor(Math.random() * filterZero(stateBoard).length);

  return filterZero(stateBoard)[randomIndex()];
}

function updateState(stateBoard, newCell) {
  const getCellIndex = (cell) => cell.x + cell.y * size;
  const cellIndex = getCellIndex(newCell);

  stateBoard[cellIndex].value = newCell.value;

  cells[cellIndex].innerText = (newCell.value === 0)
    ? ''
    : newCell.value;

  const classCell = (newCell.value === 0)
    ? 'field-cell'
    : `field-cell field-cell--${newCell.value}`;

  cells[cellIndex].className = classCell;
}

function setTwoOrFour(stateBoard) {
  const filterZero = (board) =>
    board
      .map(cell => cell.value)
      .filter(cell => cell === 0);
  const getRandomCellValue = () => Math.random() > 0.1 ? 2 : 4;

  if (filterZero(stateBoard).length > 0) {
    const cell1 = getRandomZeroCell(stateBoard);

    cell1.value = getRandomCellValue();

    updateState(stateBoard, cell1);
  }
}

function arrowLeft(stateBoard) {
  for (let row = 0; row < size; row++) {
    const filterZero = (board) =>
      board.filter(cell => cell.y === row && cell.value !== 0)
        .map(cell => cell.value);
    const makeRow = (board) => {
      const filtered = filterZero(board);

      return filtered
        .concat(Array(size - filtered.length).fill(0));
    };
    const mergeRow = (newCells) => {
      for (let cell = 0; cell < newCells.length - 1; cell++) {
        if (newCells[cell] === newCells[cell + 1]) {
          const newValue = newCells[cell] * 2;

          newCells[cell] = newValue;
          newCells[cell + 1] = 0;
          gameScore.innerText = `${Number(gameScore.innerText) + newValue}`;
        }
      }
    };
    const makeCellsAndUpdate = (newCells) =>
      newCells
        .map((item, index) => (
          { x: index,
            y: row,
            value: item }))
        .map(cell => updateState(stateBoard, cell));

    let newRow = makeRow(stateBoard);

    mergeRow(newRow);
    makeCellsAndUpdate(newRow);

    newRow = makeRow(stateBoard);
    makeCellsAndUpdate(newRow);
  }
}

function arrowRight(stateBoard) {
  for (let row = 0; row < size; row++) {
    const filterZero = (board) =>
      board.filter(cell => cell.y === row && cell.value !== 0)
        .map(cell => cell.value);
    const makeRow = (board) => {
      const filtered = filterZero(board);

      return (Array(size - filtered.length).fill(0)).concat(filtered);
    };
    const mergeRow = (newCells) => {
      for (let cell = 0; cell < newCells.length - 1; cell++) {
        if (newCells[cell] === newCells[cell + 1]) {
          const newValue = newCells[cell] * 2;

          newCells[cell] = newValue;
          newCells[cell + 1] = 0;
          gameScore.innerText = `${Number(gameScore.innerText) + newValue}`;
        }
      }
    };
    const makeCellsAndUpdate = (newCells) =>
      newCells
        .map((item, index) => (
          { x: index,
            y: row,
            value: item }))
        .map(cell => updateState(stateBoard, cell));

    let newRow = makeRow(stateBoard);

    mergeRow(newRow);
    makeCellsAndUpdate(newRow);

    newRow = makeRow(stateBoard);
    makeCellsAndUpdate(newRow);
  }
}

function arrowDown(stateBoard) {
  for (let col = 0; col < size; col++) {
    const filterZero = (board) =>
      board.filter(cell => cell.x === col && cell.value !== 0)
        .map(cell => cell.value);
    const makeRow = (board) => {
      const filtered = filterZero(board);

      return (Array(size - filtered.length).fill(0)).concat(filtered);
    };
    const mergeRow = (newCells) => {
      for (let cell = 0; cell < newCells.length - 1; cell++) {
        if (newCells[cell] === newCells[cell + 1]) {
          const newValue = newCells[cell] * 2;

          newCells[cell] = newValue;
          newCells[cell + 1] = 0;
          gameScore.innerText = `${Number(gameScore.innerText) + newValue}`;
        }
      }
    };
    const makeCellsAndUpdate = (newCells) =>
      newCells
        .map((item, index) => (
          { x: col,
            y: index,
            value: item }))
        .map(cell => updateState(stateBoard, cell));

    let newRow = makeRow(stateBoard);

    mergeRow(newRow);
    makeCellsAndUpdate(newRow);

    newRow = makeRow(stateBoard);
    makeCellsAndUpdate(newRow);
  }
}

function arrowUp(stateBoard) {
  for (let col = 0; col < size; col++) {
    const filterZero = (board) =>
      board.filter(cell => cell.x === col && cell.value !== 0)
        .map(cell => cell.value);
    const makeRow = (board) => {
      const filtered = filterZero(board);

      return filtered.concat(Array(size - filtered.length).fill(0));
    };
    const mergeRow = (newCells) => {
      for (let cell = 0; cell < newCells.length - 1; cell++) {
        if (newCells[cell] === newCells[cell + 1]) {
          const newValue = newCells[cell] * 2;

          newCells[cell] = newValue;
          newCells[cell + 1] = 0;
          gameScore.innerText = `${Number(gameScore.innerText) + newValue}`;
        }
      }
    };
    const makeCellsAndUpdate = (newCells) =>
      newCells
        .map((item, index) => (
          { x: col,
            y: index,
            value: item }))
        .map(cell => updateState(stateBoard, cell));

    let newRow = makeRow(stateBoard);

    mergeRow(newRow);
    makeCellsAndUpdate(newRow);

    newRow = makeRow(stateBoard);
    makeCellsAndUpdate(newRow);
  }
}

function isWin(gameBoard) {
  if (gameBoard.map(cell => cell.value).includes(2048)) {
    messageWin.classList.toggle('hidden');
    document.body.removeEventListener('keyup', keyUpHandler);

    return true;
  }

  return false;
}

function isLose(gameBoard) {
  const filterZero = gameBoard
    .map(cell => cell.value)
    .filter(cell => cell === 0);

  const canNotMove = filterZero.length === 0
  && !canMoveLeftOrRight(gameBoard)
  && !canMoveUpOrDown(gameBoard);

  if (canNotMove) {
    messageLose.classList.toggle('hidden');
    document.body.removeEventListener('keyup', keyUpHandler);
  }
}

function resetCells(cellsBoard) {
  cellsBoard.forEach(cell => {
    cell.innerText = '';
    cell.className = 'field-cell';
  });
}

function canMoveLeftOrRight(stateBoard) {
  let canMove = false;

  for (let row = 0; row < size; row++) {
    const filterZeroByRow = (board) =>
      board.filter(cell => cell.y === row && cell.value !== 0)
        .map(cell => cell.value);
    const mergeRow = (newCells) => {
      for (let cell = 0; cell < newCells.length - 1; cell++) {
        if (newCells[cell] === newCells[cell + 1]) {
          canMove = true;
        }
      }
    };

    mergeRow(filterZeroByRow(stateBoard));
  }

  return canMove;
}

function canMoveUpOrDown(stateBoard) {
  let canMove = false;

  for (let col = 0; col < size; col++) {
    const filterZeroByCol = (board) =>
      board.filter(cell => cell.x === col && cell.value !== 0)
        .map(cell => cell.value);
    const mergeCol = (newCells) => {
      for (let cell = 0; cell < newCells.length - 1; cell++) {
        if (newCells[cell] === newCells[cell + 1]) {
          canMove = true;
        }
      }
    };

    mergeCol(filterZeroByCol(stateBoard));
  }

  return canMove;
}
