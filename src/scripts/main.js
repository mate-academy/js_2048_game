'use strict';

const startButton = document.querySelector('.button');
const gameFieldTable = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

let game = getEmptyGame();

function getEmptyGame() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

startButton.addEventListener('click', () => {
  startNewGame();

  startMessage.classList.add('hidden');
});

function startNewGame() {
  game = getEmptyGame();

  gameScore.innerHTML = 0;

  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');

  populateNewCell();
  populateNewCell();

  renderGame();

  document.addEventListener('keydown', keyDownHandler);
}

function keyDownHandler(e) {
  if (e.repeat === true) {
    return;
  }

  const keyType = e.code;

  handleNewMove(keyType);
}

function renderGame() {
  game.forEach((row, rowIndex) => row.forEach((cellValue, cellIndex) => {
    if (cellValue === 2048) {
      winMessage.classList.remove('hidden');
    }

    const cellNode = gameFieldTable.rows[rowIndex].cells[cellIndex];

    cellNode.className = 'field-cell';

    if (cellValue !== 0) {
      cellNode.classList.add(`field-cell--${cellValue}`);
    }

    cellNode.innerHTML = cellValue || '';
  }));
}

function handleNewMove(keyType) {
  const minIndex = 0;
  const maxIndex = 4;

  switch (keyType) {
    case 'ArrowLeft':
      handleMove(minIndex, maxIndex, 'left');
      break;

    case 'ArrowRight':
      handleMove(minIndex, maxIndex, 'right');
      break;

    case 'ArrowUp':
      handleMove(minIndex, maxIndex, 'up');
      break;

    case 'ArrowDown':
      handleMove(minIndex, maxIndex, 'down');
      break;

    default:
      return;
  }

  renderGame();

  const gameIsOver = isGameOver();

  if (gameIsOver) {
    winMessage.classList.add('hidden');

    loseMessage.classList.remove('hidden');
  }

  startButton.innerHTML = 'Restart';
  startButton.classList.replace('start', 'restart');
}

function isGameOver() {
  if (gameHasEmptyCell()) {
    return false;
  }

  for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
    const row = game[rowIndex];
    const column = transpose(rowIndex);

    for (let colIndex = 0; colIndex < 3; colIndex++) {
      if (row[colIndex] === row[colIndex + 1]) {
        return false;
      }

      if (column[colIndex] === column[colIndex + 1]) {
        return false;
      }
    }
  }

  return true;
}

function handleMove(minIndex, maxIndex, direction) {
  let cellsWasMoved = false;

  for (let rowIndex = minIndex; rowIndex < maxIndex; rowIndex++) {
    let oldRow = game[rowIndex];

    let row = [...game[rowIndex]];

    if (direction === 'up' || direction === 'down') {
      row = transpose(rowIndex);
      oldRow = transpose(rowIndex);
    }

    if (direction === 'right' || direction === 'down') {
      row.reverse();
    }

    row = slide(row);

    if (direction === 'right' || direction === 'down') {
      row.reverse();
    }

    if (!rowsAreEqual(oldRow, row)) {
      cellsWasMoved = true;
    }

    if (direction === 'left' || direction === 'right') {
      game[rowIndex] = row;

      continue;
    }

    game[0][rowIndex] = row[0];
    game[1][rowIndex] = row[1];
    game[2][rowIndex] = row[2];
    game[3][rowIndex] = row[3];
  }

  if (cellsWasMoved) {
    populateNewCell();
  }
}

function transpose(index) {
  return [
    game[0][index],
    game[1][index],
    game[2][index],
    game[3][index],
  ];
}

function slide(row) {
  let newRow = removeZeroes(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;

      increaseScore(newRow[i]);
    }
  }

  newRow = removeZeroes(newRow);

  while (newRow.length < 4) {
    newRow.push(0);
  }

  return newRow;
}

function rowsAreEqual(oldRow, newRow) {
  return oldRow.join('.') === newRow.join('.');
}

function removeZeroes(row) {
  return row.filter(value => value !== 0);
}

function increaseScore(value) {
  const currentScoreNumber = +gameScore.innerHTML;

  gameScore.innerHTML = currentScoreNumber + value;
}

function gameHasEmptyCell() {
  return game.flat().some(cell => cell === 0);
}

function populateNewCell() {
  if (!gameHasEmptyCell()) {
    return;
  }

  let rowIndex = getRandomCellPosition();
  let colIndex = getRandomCellPosition();

  let currentCellValue = game[rowIndex][colIndex];

  while (currentCellValue !== 0) {
    rowIndex = getRandomCellPosition();
    colIndex = getRandomCellPosition();

    currentCellValue = game[rowIndex][colIndex];
  }

  game[rowIndex][colIndex] = getRandomCellValue();
}

function getRandomCellPosition() {
  return Math.floor(Math.random() * 4);
}

function getRandomCellValue() {
  const distribution = [2, 2, 2, 2, 2, 2, 4, 2, 2, 2];
  const index = Math.floor(distribution.length * Math.random());

  return distribution[index];
}
