'use strict';

const buttonStart = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScoreForUser = document.querySelector('.game-score');

const cells = document.querySelectorAll('.field-cell');
const rows = document.querySelectorAll('.field-row');

const game = {
  board: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  isUserWin: false,
  totalScore: 0,
};

function getRandomCell() {
  const x = (Math.round(Math.random() * 3));
  const y = (Math.round(Math.random() * 3));

  return [x, y];
}

function getRandomValue() {
  return Math.random() > 0.9 ? 4 : 2;
}

function addNumber() {
  let coords = getRandomCell();

  const value = getRandomValue();

  while (game.board[coords[0]][coords[1]] !== 0) {
    coords = getRandomCell();
  };

  game.board[coords[0]][coords[1]] = value;

  [...rows][coords[0]].children[coords[1]].innerHTML = value;

  [...rows][coords[0]].children[coords[1]].classList
    .add(`field-cell--${value}`);
};

function startGame() {
  addNumber();
  addNumber();

  buttonStart.innerHTML = 'Restart';
  buttonStart.classList = 'button restart';

  messageStart.classList.add('hidden', true);
};

function clearGameBoard() {
  [...cells].map(cell => {
    cell.innerHTML = '';
    cell.classList = 'field-cell';
  });

  game.board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

function restartGame() {
  clearGameBoard();

  clearTimeout(addNumber);

  game.totalScore = 0;
  gameScoreForUser.innerHTML = game.totalScore;

  game.isUserWin = false;

  buttonStart.innerHTML = 'Start';
  buttonStart.classList = 'button start';
  messageStart.classList.remove('hidden');
  messageLose.classList.add('hidden', true);
  messageWin.classList.add('hidden', true);
};

buttonStart.addEventListener('click', (ev) => {
  return (buttonStart.innerHTML === 'Start')
    ? startGame()
    : restartGame();
});

document.addEventListener('keyup', (ev) => {
  move(ev.code);
});

function move(codeOfEvent) {
  if (buttonStart.innerHTML !== 'Start') {
    const areAllCellsFull = [...cells].every(cell => cell.textContent);

    switch (codeOfEvent) {
      case 'ArrowUp':
        moveUpOrDown('up');
        break;

      case 'ArrowDown':
        moveUpOrDown('down');
        break;

      case 'ArrowLeft':
        moveLeftOrRight('left');
        break;

      case 'ArrowRight':
        moveLeftOrRight('right');
        break;

      default:
        break;
    }

    if (!areAllCellsFull) {
      setTimeout(addNumber, '200');
    }

    verifyStatusGame();
  }
};

function moveUpOrDown(direction) {
  for (let j = 0; j < game.board.length; j++) {
    let column = [];

    for (let i = 0; i < game.board.length; i++) {
      column.push(game.board[i][j]);
    }

    column = (direction === 'up')
      ? column.filter(cell => cell !== 0)
      : column.filter(cell => cell !== 0).reverse();

    mergeRowsAndColumns(column);

    const preparedColumn = getPreparedRowsAndColumns(column, direction);

    fillTheBoardByColumns(j, preparedColumn);

    column.length = 0;
  }
}

function moveLeftOrRight(direction) {
  const dataToMerge = [...game.board];

  for (let j = 0; j < dataToMerge.length; j++) {
    const row = (direction === 'left')
      ? dataToMerge[j].filter(cell => cell !== 0)
      : dataToMerge[j].filter(cell => cell !== 0).reverse();

    mergeRowsAndColumns(row);

    game.board[j] = getPreparedRowsAndColumns(row, direction);

    fillTheBoardByRows(j);
  };
};

function checkIfGameOver() {
  const allCellsAreFull = [...cells].every(cell => cell.textContent);
  const isHorizontalMoveExist = checkIfHorizontalMoveExist();
  const isVerticalMoveExist = checkIfVerticalMoveExist();

  if (allCellsAreFull && !isHorizontalMoveExist && !isVerticalMoveExist) {
    messageLose.classList.remove('hidden');
  }
};

function checkIfHorizontalMoveExist() {
  return [...cells].some(cell =>
    cell.textContent && cell.nextElementSibling && cell.textContent
    === cell.nextElementSibling.textContent);
};

function checkIfVerticalMoveExist() {
  for (let i = 4; i < [...cells].length; i++) {
    if ([...cells][i].textContent
      && [...cells][i].textContent === [...cells][i - 4].textContent) {
      return true;
    }
  }

  return false;
};

function checkIfUserWon() {
  if ([...cells].some(cell => cell.innerHTML === '2048')) {
    messageWin.classList.remove('hidden');
  }
};

function verifyStatusGame() {
  checkIfUserWon();
  checkIfGameOver();
};

function mergeRowsAndColumns(line) {
  let isMerged = false;

  for (let i = 0; i < line.length - 1; i++) {
    if (line[i] === 0) {
      line[i] = line[i + 1];
      line[i + 1] = 0;
    } else {
      if (line[i] === line[i + 1] && isMerged === false) {
        line[i] *= 2;
        game.totalScore += line[i];
        gameScoreForUser.innerHTML = game.totalScore;
        line[i + 1] = 0;
        isMerged = true;
      }
    }
  }
}

function getPreparedRowsAndColumns(line, direction) {
  const lineWithoutZeros = line.filter(cell => cell !== 0);

  while (lineWithoutZeros.length < game.board.length) {
    lineWithoutZeros.push(0);
  }

  return (direction === 'left' || direction === 'up')
    ? lineWithoutZeros
    : lineWithoutZeros.reverse();
};

function fillTheBoardByRows(j) {
  for (let i = 0; i < game.board[j].length; i++) {
    const targetCell = [...rows][j].children[i];

    if (game.board[j][i] !== 0) {
      targetCell.classList.remove(`field-cell--${targetCell.textContent}`);
      targetCell.innerHTML = game.board[j][i];
      targetCell.classList.add(`field-cell--${targetCell.textContent}`);
    } else {
      targetCell.classList.remove(`field-cell--${targetCell.textContent}`);
      targetCell.innerHTML = '';
    }
  }
};

function fillTheBoardByColumns(j, columnWithoutZeros) {
  for (let i = 0; i < columnWithoutZeros.length; i++) {
    game.board[i][j] = columnWithoutZeros[i];

    const targetCell = [...rows][i].children[j];

    if (game.board[i][j] !== 0) {
      targetCell.classList.remove(`field-cell--${targetCell.textContent}`);
      targetCell.innerHTML = columnWithoutZeros[i];
      targetCell.classList.add(`field-cell--${targetCell.textContent}`);
    } else {
      targetCell.classList.remove(`field-cell--${targetCell.textContent}`);
      targetCell.innerHTML = '';
    }
  }
}
