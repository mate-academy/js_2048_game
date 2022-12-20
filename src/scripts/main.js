import _ from 'lodash';

const ROWS = 4;
const COLUMNS = 4;
const WINNING_RESULT = 2048;

let isWon = false;
let isLose = false;
let score = 0;

const initialBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let gameBoard = JSON.parse(JSON.stringify(initialBoard));

const gameTable = document.querySelector('.game-field');
const scoreInfo = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const gameHeader = document.querySelector('.game-header');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const resetCell = (cell) => {
  cell.className = 'field-cell';
  cell.innerText = '';
};

const getEmptyCells = () => {
  const emptyCells = [];

  for (let r = 0; r < gameBoard.length; r++) {
    for (let c = 0; c < gameBoard[r].length; c++) {
      if (gameBoard[r][c] === 0) {
        emptyCells.push(
          {
            r,
            c,
          }
        );
      }
    }
  }

  return emptyCells;
};

const checkResult = (value) => {
  if (value === WINNING_RESULT) {
    isWon = true;
  }
};

const gameOver = () => {
  document.removeEventListener('keyup', gameControl);
};

const showWinningMessage = () => {
  messageWin.classList.remove('hidden');
};

const showLossMessage = () => {
  messageLose.classList.remove('hidden');
};

const updateGame = () => {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      const tableCell = gameTable.rows[r].cells[c];
      const currentValue = gameBoard[r][c];

      resetCell(tableCell);

      if (currentValue !== 0) {
        tableCell.classList.add(`field-cell--${currentValue}`);
        tableCell.innerText = `${currentValue}`;
      }
    }
  }

  scoreInfo.innerText = score;
};

const filterZeros = (row) => {
  return row.filter(item => item !== 0);
};

const slide = (row) => {
  const newRow = filterZeros(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      const newValue = newRow[i] * 2;

      newRow[i] = newValue;
      newRow[i + 1] = 0;

      score += newRow[i];
      checkResult(newValue);
    }
  }

  const rowResult = filterZeros(newRow);

  while (rowResult.length < COLUMNS) {
    rowResult.push(0);
  }

  return rowResult;
};

const slideLeft = () => {
  for (let i = 0; i < ROWS; i++) {
    let row = gameBoard[i];

    row = slide(row);
    gameBoard[i] = row;
  }
};

const slideRight = () => {
  for (let i = 0; i < ROWS; i++) {
    let row = gameBoard[i];

    row = slide(row.reverse());
    gameBoard[i] = row.reverse();
  }
};

const slideUp = () => {
  for (let i = 0; i < ROWS; i++) {
    const verticalRow = [];

    for (const arr of gameBoard) {
      verticalRow.push(arr[i]);
    }

    const row = slide(verticalRow);

    for (let k = 0; k < gameBoard.length; k++) {
      gameBoard[k][i] = row[k];
    }
  }
};

const slideDown = () => {
  for (let i = 0; i < ROWS; i++) {
    const verticalRow = [];

    for (const arr of gameBoard) {
      verticalRow.push(arr[i]);
    }

    const row = slide(verticalRow.reverse());

    row.reverse();

    for (let k = 0; k < gameBoard.length; k++) {
      gameBoard[k][i] = row[k];
    }
  }
};

const getNewCell = () => {
  const percent = Math.floor(Math.random() * 100) + 1;

  switch (true) {
    case percent <= 10:
      return 4;

    default:
      return 2;
  }
};

const addNewCell = () => {
  const emptyCells = getEmptyCells();
  const newCellValue = getNewCell();

  if (!emptyCells.length) {
    isLose = true;

    return;
  }

  const randomEmptyCell = _.sample(emptyCells);

  if (gameBoard[randomEmptyCell.r][randomEmptyCell.c] === 0) {
    gameBoard[randomEmptyCell.r][randomEmptyCell.c] = newCellValue;
  }
};

const prepareStart = () => {
  messageStart.style.display = 'none';
  startButton.innerText = 'Restart';
  startButton.style.fontSize = '18px';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
};

const restartGame = () => {
  gameBoard = JSON.parse(JSON.stringify(initialBoard));
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  score = 0;
  isWon = false;
  isLose = false;
  document.removeEventListener('keyup', gameControl);
  document.addEventListener('keyup', gameControl);
};

const gameControl = (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      slideLeft();
      break;

    case 'ArrowRight':
      slideRight();
      break;

    case 'ArrowUp':
      slideUp();
      break;

    case 'ArrowDown':
      slideDown();
      break;
  }
  addNewCell();
  updateGame();

  if (isLose) {
    gameOver();
    showLossMessage();
  }

  if (isWon) {
    gameOver();
    showWinningMessage();
  }
};

gameHeader.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    restartGame();
  }

  if (startButton.classList.contains('start')) {
    prepareStart();
    document.addEventListener('keyup', gameControl);
  }
  addNewCell();
  updateGame();
});
