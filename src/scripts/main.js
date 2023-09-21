import _ from 'lodash';

const ROWS = 4;
const COLUMNS = 4;
const WINNING_RESULT = 2048;

let isWon = false;
let score = 0;

const initialBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let gameBoard = _.cloneDeep(initialBoard);

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

const slideLeft = (currentBoard) => {
  for (let i = 0; i < ROWS; i++) {
    let row = currentBoard[i];

    row = slide(row);
    currentBoard[i] = row;
  }
};

const slideRight = (currentBoard) => {
  for (let i = 0; i < ROWS; i++) {
    let row = currentBoard[i];

    row = slide(row.reverse());
    currentBoard[i] = row.reverse();
  }
};

const slideUp = (currentBoard) => {
  for (let i = 0; i < ROWS; i++) {
    const verticalRow = [];

    for (const arr of currentBoard) {
      verticalRow.push(arr[i]);
    }

    const row = slide(verticalRow);

    for (let k = 0; k < currentBoard.length; k++) {
      currentBoard[k][i] = row[k];
    }
  }
};

const slideDown = (currentBoard) => {
  for (let i = 0; i < ROWS; i++) {
    const verticalRow = [];

    for (const arr of currentBoard) {
      verticalRow.push(arr[i]);
    }

    const row = slide(verticalRow.reverse());

    row.reverse();

    for (let k = 0; k < currentBoard.length; k++) {
      currentBoard[k][i] = row[k];
    }
  }
};

const getNewCell = () => {
  const percent = Math.floor(Math.random() * 100) + 1;

  if (percent <= 10) {
    return 4;
  }

  return 2;
};

const addNewCell = () => {
  const emptyCells = getEmptyCells();
  const newCellValue = getNewCell();

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
  gameBoard = _.cloneDeep(initialBoard);
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  score = 0;
  isWon = false;
  document.removeEventListener('keyup', gameControl);
  document.addEventListener('keyup', gameControl);
};

const checkMerges = () => {
  const gameBoardPrevState = _.cloneDeep(gameBoard);
  const gameBoardWillModified = _.cloneDeep(gameBoard);

  const actions = [slideLeft, slideRight, slideUp, slideDown];

  for (const action of actions) {
    action(gameBoardWillModified);

    if (gameBoardPrevState.toString() !== gameBoardWillModified.toString()) {
      return true;
    }
  }

  return false;
};

const gameControl = (e) => {
  const prevGameBoard = _.cloneDeep(gameBoard);

  switch (e.key) {
    case 'ArrowLeft':
      slideLeft(gameBoard);
      break;

    case 'ArrowRight':
      slideRight(gameBoard);
      break;

    case 'ArrowUp':
      slideUp(gameBoard);
      break;

    case 'ArrowDown':
      slideDown(gameBoard);
      break;
  }

  if (prevGameBoard.toString() !== gameBoard.toString()) {
    addNewCell();
    updateGame();
  }

  if (!checkMerges()) {
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
