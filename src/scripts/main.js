// /* eslint-disable no-unused-vars */
'use strict';

// #region initialize variables
const gameField = document.querySelector('.game-field');
const buttonStart = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const displayScore = document.querySelector('.game-score');

const winScore = 2048;
const gameFieldWidth = 4;
let playerScore = 0;

const blankGameGrid = () => {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
};

let gameGrid = blankGameGrid();
// #endregion

// #region handle win and lose
const handleLose = () => {
  const hasEmptyTile = gameGrid.flat().some(tile => tile === 0);

  if (!hasEmptyTile) {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');

    document.removeEventListener('keyup', movesController);
  }
};

const handleWin = () => {
  const userWon = gameGrid.flat().includes(winScore);

  if (userWon) {
    messageWin.classList.remove('hidden');
    buttonStart.classList.remove('restart');
    buttonStart.classList.add('start');
    buttonStart.innerText = 'Start';

    gameGrid = blankGameGrid();
    document.removeEventListener('keyup', movesController);
  }
};
// #endregion

// #region game start : display buttons, messages, fillGrid
// fill helpers
const randomNumber = () => {
  return Math.floor(Math.random() * gameFieldWidth);
};

const fillRandomTile = () => {
  const [row, col] = [
    randomNumber(),
    randomNumber(),
  ];

  if (!gameGrid[row][col]) {
    gameGrid[row][col] = Math.random() > 0.9 ? 4 : 2;
    handleLose();
  } else {
    fillRandomTile();
  }
};

const fillGrid = () => {
  gameGrid.map((row, rowCount) => row.map((_, cellCount) => {
    const tile = gameField.rows[rowCount].cells[cellCount];
    const tileValue = gameGrid[rowCount][cellCount];

    tile.classList = ('field-cell');
    tile.innerText = tileValue;

    tileValue > 0
      ? tile.classList.add('field-cell--' + tileValue)
      : tile.innerText = '';
  }));
};

// start logic
const startGame = () => {
  messageStart.classList.add('hidden');
  buttonStart.classList.remove('start');
  buttonStart.classList.add('restart');
  buttonStart.innerText = 'Restart';

  fillRandomTile();
  fillRandomTile();
  fillGrid();

  document.addEventListener('keyup', movesController);
};

buttonStart.addEventListener('click', startGame);

// restart logic
const restartGame = () => {
  gameGrid = blankGameGrid();
  displayScore.innerText = 0;
  playerScore = 0;
  startGame();

  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
};

buttonStart.addEventListener('click', restartGame);
// #endregion

// #region actions: duplicate, compare, flip, spin, slide, mergeTiles
function duplicateGameGrid() {
  return JSON.parse(JSON.stringify(gameGrid));
}

const compareArrays = (newArr, prevArr) => {
  return JSON.stringify(newArr) === JSON.stringify(prevArr);
};

// flipVertical, spin
const flipGridVertical = () => {
  return gameGrid.map(row => row.reverse());
};

function spinGrid() {
  const newGrid = blankGameGrid();

  newGrid.map((row, rowCount) => row.map((_, colCount) => {
    newGrid[rowCount][colCount] = gameGrid[colCount][rowCount];
  }));

  return newGrid;
}

// slideRight, merge equal tiles
function slideRight(row) {
  const notEmptyTiles = row.filter(tile => tile > 0);
  const emptyTiles = Array(gameFieldWidth - notEmptyTiles.length).fill(0);

  return emptyTiles.concat(notEmptyTiles);
}

function mergeTiles(arr) {
  for (let i = gameFieldWidth - 1; i > 0; i--) {
    if (arr[i] === arr[i - 1]) {
      arr[i] += arr[i - 1];
      arr[i - 1] = 0;

      playerScore += arr[i];
    }
  }

  displayScore.innerText = playerScore;

  return arr;
}
// #endregion

// #region arrow keys handlers
const makeMove = (keypress) => {
  let [undoFlip, undoSpin] = [false, false];

  switch (keypress) {
    case 'ArrowUp':
      gameGrid = spinGrid();
      gameGrid = flipGridVertical();
      undoFlip = true;
      undoSpin = true;
      break;
    case 'ArrowDown':
      gameGrid = spinGrid();
      undoSpin = true;
      break;
    case 'ArrowLeft':
      gameGrid = flipGridVertical();
      undoFlip = true;
      break;
    default:
      break;
  };

  const preMergeGrid = duplicateGameGrid();

  gameGrid = gameGrid.map(row => {
    return slideRight(mergeTiles(slideRight(row)));
  });

  const preUndoGridsCompare = compareArrays(gameGrid, preMergeGrid);

  if (undoFlip) {
    gameGrid = flipGridVertical(gameGrid);
  };

  if (undoSpin) {
    gameGrid = spinGrid();
  };

  if (!preUndoGridsCompare) {
    fillRandomTile();
  }
};

const movesController = (ev) => {
  makeMove(ev.key);
  fillGrid();
  handleWin();
};
// #endregion
