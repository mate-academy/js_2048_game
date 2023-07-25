'use strict';

const ANIMATION_TIME = 250;
// delay must be equal or greater than ANIMATION_TIME
// left 0 for cypress tests to pass
const DELAY = 0;
const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let score = 0;
let canMove = true;

const btn = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const messageElement = document.querySelector('.message');
const boardElement = document.querySelector('.game-field');

const clearBoard = () => {
  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      board[rowIndex][cellIndex] = 0;
    });
  });
};

const buildBoard = () => {
  boardElement.innerHTML = '';

  const boardBG = document.createElement('div');

  boardBG.classList.add('field-bg');

  board.forEach((row, rowIndex) => {
    const rowBG = document.createElement('div');

    rowBG.classList.add('field-row');

    row.forEach((cell, cellIndex) => {
      const cellElement = document.createElement('div');
      const cellBG = document.createElement('div');

      cellBG.classList.add('field-cell');
      cellBG.classList.add('field-cell--empty');

      cellElement.classList.add('field-cell');
      cellElement.classList.add(`field-cell--${cell}`);
      cellElement.classList.add(`field-cell--pop`);

      setTimeout(() => {
        cellElement.classList.remove(`field-cell--pop`);
      }, ANIMATION_TIME);

      cellElement.classList
        .add(`field-cell--position--${rowIndex}-${cellIndex}`);

      cellElement.setAttribute('data-row', rowIndex);
      cellElement.setAttribute('data-cell', cellIndex);

      cellElement.innerHTML = cell || '';

      boardElement.appendChild(cellElement);
      rowBG.appendChild(cellBG);
    });

    boardBG.appendChild(rowBG);
  });

  boardElement.appendChild(boardBG);
};

const updateBoard = () => {
  const allCeslls = document.querySelectorAll('.field-cell');

  const allCellsArray = Array.from(allCeslls).filter(
    (cell) => !cell.classList.contains('field-cell--empty')
  );

  for (const cell of allCellsArray) {
    const r = cell.getAttribute('data-row');
    const c = cell.getAttribute('data-cell');

    cell.classList.remove(`field-cell--${cell.innerHTML}`);
    cell.classList.add(`field-cell--${board[r][c]}`);
    cell.innerHTML = board[r][c] || '';

    cell.classList.add(`field-cell--pop`);

    setTimeout(() => {
      cell.classList.remove(`field-cell--pop`);
    }, ANIMATION_TIME);
  }
};

const setScore = (scoreToSet) => {
  scoreElement.innerHTML = scoreToSet;
};

const addRandomCell = () => {
  const emptyCells = [];

  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (!cell) {
        emptyCells.push({
          row: rowIndex,
          cell: cellIndex,
        });
      }
    });
  });

  if (emptyCells.length) {
    const randCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    board[randCell.row][randCell.cell] = Math.random() > 0.9 ? 4 : 2;
  }
};

const slide = (row) => {
  const newRow = row.filter((cell) => cell !== 0);

  newRow.forEach((cell, cellIndex) => {
    if (cell === newRow[cellIndex + 1]) {
      newRow[cellIndex] *= 2;
      newRow[cellIndex + 1] = 0;
    }
  });

  const finalRow = newRow.filter((cell) => cell !== 0);

  while (finalRow.length < 4) {
    finalRow.push(0);
  }

  return finalRow;
};

const moveLeft = (tempBoard) => {
  tempBoard.forEach((row, rowIndex) => {
    tempBoard[rowIndex] = slide(row);
  });
};

const moveRight = (tempBoard) => {
  tempBoard.forEach((row, rowIndex) => {
    tempBoard[rowIndex] = slide(row.reverse()).reverse();
  });
};

const moveUp = (tempBoard) => {
  for (let c = 0; c < 4; c += 1) {
    const column = tempBoard.map((row) => row[c]);

    const newColumn = slide(column);

    newColumn.forEach((cell, rowIndex) => {
      tempBoard[rowIndex][c] = cell;
    });
  }
};

const moveDown = (tempBoard) => {
  for (let c = 0; c < 4; c += 1) {
    const column = tempBoard.map((row) => row[c]).reverse();

    const newColumn = slide(column).reverse();

    newColumn.forEach((cell, rowIndex) => {
      tempBoard[rowIndex][c] = cell;
    });
  }
};

const moveCells = (direction) => {
  if (!canMove) {
    return;
  }

  const currentBoard = board.map((row) => [...row]);

  switch (direction) {
    case 'ArrowUp':
      moveUp(currentBoard);
      break;
    case 'ArrowDown':
      moveDown(currentBoard);
      break;
    case 'ArrowLeft':
      moveLeft(currentBoard);
      break;
    case 'ArrowRight':
      moveRight(currentBoard);
      break;
    default:
      break;
  }

  let toChange = false;

  canMove = false;

  setTimeout(() => {
    canMove = true;
  }, DELAY);

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (currentBoard[r][c] !== board[r][c]) {
        toChange = true;

        break;
      }
    }

    if (toChange) {
      break;
    }
  }

  if (!toChange) {
    return;
  }

  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      board[rowIndex][cellIndex] = currentBoard[rowIndex][cellIndex];
    });
  });

  addRandomCell();

  updateBoard();

  const increaseScore = board.reduce(
    (acc, row) => acc + row.reduce((acc2, cell) => acc2 + cell, 0), 0
  );

  setScore(score += increaseScore);

  winGame();
  looseGame();
};

const proccesInput = (ev) => {
  const key = ev.key;

  if (
    key === 'ArrowUp'
    || key === 'ArrowDown'
    || key === 'ArrowLeft'
    || key === 'ArrowRight'
  ) {
    moveCells(key);
  }
};

const winGame = () => {
  const win = board.some((row) => row.some((cell) => cell === 2048));

  if (win) {
    document.removeEventListener('keydown', proccesInput);
    messageElement.innerHTML = 'Winner! Congrats! You did it!';

    messageElement.classList = '';
    messageElement.classList.add('message');
    messageElement.classList.add('message-win');
  }
};

const looseGame = () => {
  let condidtion = true;

  const allMoves = [
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
  ];

  for (const move of allMoves) {
    const currentBoard = board.map((row) => [...row]);

    move(currentBoard);

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentBoard[r][c] !== board[r][c]) {
          condidtion = false;

          break;
        }
      }

      if (!condidtion) {
        break;
      }
    }

    if (!condidtion) {
      break;
    }
  }

  if (condidtion) {
    document.removeEventListener('keydown', proccesInput);
    messageElement.innerHTML = 'You lose! Restart the game?';

    messageElement.classList = '';
    messageElement.classList.add('message');
    messageElement.classList.add('message-lose');
  }
};

const startGame = () => {
  setScore(score = 0);
  clearBoard();

  btn.innerHTML = 'Restart';
  btn.classList.remove('start');
  btn.classList.add('restart');

  messageElement.classList.add('hidden');

  addRandomCell();
  buildBoard();

  document.addEventListener('keydown', proccesInput);
};

btn.addEventListener('click', startGame);
