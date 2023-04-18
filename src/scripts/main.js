'use strict';

const startButton = document.querySelector('.button');
const gameFieldTable = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

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

  const startMessage = document.querySelector('.message-start');

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

  switch (keyType) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      handleNewMove(keyType);
      break;

    default:
      break;
  }
}

function renderGame() {
  let moveAvaliable = false;

  game.forEach((row, rowIndex) => row.forEach((cellValue, cellIndex) => {
    if (cellValue === 2048) {
      winMessage.classList.remove('hidden');
    }

    moveAvaliable
      = moveAvaliable || isMoveAvaliable(rowIndex, cellIndex, cellValue);

    const cellNode = gameFieldTable.rows[rowIndex].cells[cellIndex];

    cellNode.className = 'field-cell';

    if (cellValue !== 0) {
      cellNode.classList.add(`field-cell--${cellValue}`);
    }

    cellNode.innerHTML = cellValue || '';
  }));

  if (!moveAvaliable) {
    winMessage.classList.add('hidden');

    loseMessage.classList.remove('hidden');
  }
}

function isMoveAvaliable(rowIndex, cellIndex, cellValue) {
  let result = false;

  if (cellValue === 0) {
    return true;
  }

  const toTheRight = cellIndex <= 2
    ? game[rowIndex][cellIndex + 1]
    : null;

  const toTheBottom = rowIndex <= 2
    ? game[rowIndex + 1][cellIndex]
    : null;

  if (toTheRight === cellValue || toTheBottom === cellValue) {
    result = true;
  }

  return result;
}

function handleNewMove(keyType) {
  const minIndex = 0;
  const maxIndex = 3;

  let cellWasMoved = false;

  for (let x = minIndex; x <= maxIndex; x++) {
    if (keyType === 'ArrowUp') {
      cellWasMoved = handleMoveUp(x, minIndex, maxIndex) || cellWasMoved;
    }

    if (keyType === 'ArrowDown') {
      cellWasMoved = handleMoveDown(x, minIndex, maxIndex) || cellWasMoved;
    }

    if (keyType === 'ArrowLeft') {
      cellWasMoved = handleMoveLeft(x, minIndex, maxIndex) || cellWasMoved;
    }

    if (keyType === 'ArrowRight') {
      cellWasMoved = handleMoveRight(x, minIndex, maxIndex) || cellWasMoved;
    }
  }

  if (cellWasMoved) {
    populateNewCell();
  }

  renderGame();

  startButton.innerHTML = 'Restart';
  startButton.classList.replace('start', 'restart');
}

function handleMoveUp(x, minIndex, maxIndex) {
  let swiped;
  let moveIsPossible = false;
  const mergedCellCoords = {};

  do {
    swiped = false;

    for (let y = minIndex; y < maxIndex; y++) {
      const cell = game[y][x];
      const nextCellInCol = game[y + 1][x];
      const cellsCanBeMerged
        = mergedCellCoords[x] !== y && mergedCellCoords[x] !== y + 1;

      if (nextCellInCol !== 0 && cell === 0) {
        game[y][x] = game[y + 1][x];
        game[y + 1][x] = 0;

        swiped = true;
      }

      if (nextCellInCol === cell && cell !== 0 && cellsCanBeMerged) {
        game[y][x] += game[y + 1][x];
        game[y + 1][x] = 0;

        increaseScore(cell + nextCellInCol);

        mergedCellCoords[x] = y;

        swiped = true;
      }
    }

    moveIsPossible = moveIsPossible || swiped;
  } while (swiped);

  return moveIsPossible;
}

function handleMoveDown(x, minIndex, maxIndex) {
  let swiped;
  let moveIsPossible = false;
  const mergedCellCoords = {};

  do {
    swiped = false;

    for (let y = maxIndex; y > minIndex; y--) {
      const cell = game[y][x];
      const nextCellInCol = game[y - 1][x];
      const cellsCanBeMerged
        = mergedCellCoords[x] !== y && mergedCellCoords[x] !== y - 1;

      if (nextCellInCol !== 0 && cell === 0) {
        game[y][x] = game[y - 1][x];
        game[y - 1][x] = 0;

        swiped = true;
      }

      if (nextCellInCol === cell && cell !== 0 && cellsCanBeMerged) {
        game[y][x] += game[y - 1][x];
        game[y - 1][x] = 0;

        increaseScore(cell + nextCellInCol);

        mergedCellCoords[x] = y;

        swiped = true;
      }
    }

    moveIsPossible = moveIsPossible || swiped;
  } while (swiped);

  return moveIsPossible;
}

function handleMoveLeft(x, minIndex, maxIndex) {
  let swiped;
  let moveIsPossible = false;
  const mergedCellCoords = {};

  do {
    swiped = false;

    for (let y = minIndex; y < maxIndex; y++) {
      const cell = game[x][y];
      const nextCellInRow = game[x][y + 1];
      const cellsCanBeMerged
        = mergedCellCoords[x] !== y && mergedCellCoords[x] !== y + 1;

      if (nextCellInRow !== 0 && cell === 0) {
        game[x][y] = game[x][y + 1];
        game[x][y + 1] = 0;

        swiped = true;
      }

      if (nextCellInRow === cell && cell !== 0 && cellsCanBeMerged) {
        game[x][y] += game[x][y + 1];
        game[x][y + 1] = 0;

        increaseScore(cell + nextCellInRow);

        mergedCellCoords[x] = y;

        swiped = true;
      }
    }

    moveIsPossible = moveIsPossible || swiped;
  } while (swiped);

  return moveIsPossible;
}

function handleMoveRight(x, minIndex, maxIndex) {
  let swiped;
  let moveIsPossible = false;
  const mergedCellCoords = {};

  do {
    swiped = false;

    for (let y = maxIndex; y > minIndex; y--) {
      const cell = game[x][y];
      const nextCellInRow = game[x][y - 1];
      const cellsCanBeMerged
        = mergedCellCoords[x] !== y && mergedCellCoords[x] !== y - 1;

      if (nextCellInRow !== 0 && cell === 0) {
        game[x][y] = game[x][y - 1];
        game[x][y - 1] = 0;

        swiped = true;
      }

      if (nextCellInRow === cell && cell !== 0 && cellsCanBeMerged) {
        game[x][y] += game[x][y - 1];
        game[x][y - 1] = 0;

        increaseScore(cell + nextCellInRow);

        mergedCellCoords[x] = y;

        swiped = true;
      }
    }

    moveIsPossible = moveIsPossible || swiped;
  } while (swiped);

  return moveIsPossible;
}

function increaseScore(value) {
  const currentScoreNumber = +gameScore.innerHTML;

  gameScore.innerHTML = currentScoreNumber + value;
}

function populateNewCell() {
  let rowIndex = getRandomCellPosition();
  let colIndex = getRandomCellPosition();

  let currentCellValue = game[rowIndex][colIndex];
  const hasEmptyCell = game.flat().some(cell => cell === 0);

  if (!hasEmptyCell) {
    return;
  }

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
