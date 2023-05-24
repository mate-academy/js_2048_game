'use strict';

const rows = 4;
const cols = 4;

const quantityRows = rows - 1;
const quantityCols = cols - 1;
let board = createCleanBoard();
let emptyCells = rows * cols;
let moves = 1;
let dontAddCells = [];

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const table = document.querySelector('.game-field');

const trs = [];
const trsTbody = [...document.querySelector('tbody').children];

trsTbody.map(tr => {
  trs.push([...tr.children]);
});

button.addEventListener('click', e => {
  if (button.innerText === 'Restart') {
    moves = 1;
    emptyCells = rows * cols;
    score.innerHTML = 0;
    table.style.opacity = 1;

    trs.map(tr => tr.map(td => {
      td.removeAttribute('class');
      td.innerText = '';
      td.classList.add('field-cell');
    }));

    board = createCleanBoard();
    addNewTile();
    addNewTile();
  }

  if (button.innerText === 'Start') {
    addNewTile();
    addNewTile();
    button.innerText = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
    messageStart.innerText = 'Press "Restart" to new game';
    addEventsKeyboard();
  }
});

function addEventsKeyboard() {
  document.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') {
      resetAfterCycle();

      for (let r = 0; r <= quantityRows; r++) {
        for (let c = 0; c <= quantityCols; c++) {
          if (board[r][c] !== 0 && c !== 0) {
            for (let i = c - 1; i >= 0; i--) {
              if (trs[r][i].innerText !== '') {
                if (trs[r][i].innerText === trs[r][c].innerText
                  && !trs[r][i].classList['notAdd']) {
                  moveCell(r, c, i, true, true);
                  break;
                }

                if (c !== i + 1) {
                  moveCell(r, c, i + 1, true, false);
                }
                break;
              } else if (i === 0) {
                moveCell(r, c, i, true, false);
              }
            }
          }
        }
      }

      afterCheckMoves();
      checkLose();
    }

    if (e.code === 'ArrowRight') {
      resetAfterCycle();

      for (let r = 0; r <= quantityRows; r++) {
        for (let c = quantityCols; c >= 0; c--) {
          if (board[r][c] !== 0 && c !== quantityCols) {
            for (let i = c + 1; i <= quantityCols; i++) {
              if (trs[r][i].innerText !== '') {
                if (trs[r][i].innerText === trs[r][c].innerText
                  && !trs[r][i].classList['notAdd']) {
                  moveCell(r, c, i, true, true);
                  break;
                }

                if (c !== i - 1) {
                  moveCell(r, c, i - 1, true, false);
                }
                break;
              } else if (i === quantityCols) {
                moveCell(r, c, i, true, false);
              }
            }
          }
        }
      }

      afterCheckMoves();
      checkLose();
    }

    if (e.code === 'ArrowDown') {
      resetAfterCycle();

      for (let c = 0; c <= quantityCols; c++) {
        for (let r = quantityRows; r >= 0; r--) {
          if (board[r][c] !== 0 && r !== quantityRows) {
            for (let i = r + 1; i <= quantityRows; i++) {
              if (trs[i][c].innerText !== '') {
                if (trs[i][c].innerText === trs[r][c].innerText
                  && !trs[i][c].classList['notAdd']) {
                  moveCell(c, r, i, false, true);
                  break;
                }

                if (r !== i - 1) {
                  moveCell(c, r, i - 1, false, false);
                }
                break;
              } else if (i === quantityRows) {
                moveCell(c, r, i, false, false);
              }
            }
          }
        }
      }

      afterCheckMoves();
      checkLose();
    }

    if (e.code === 'ArrowUp') {
      resetAfterCycle();

      for (let c = 0; c <= quantityCols; c++) {
        for (let r = 0; r <= quantityRows; r++) {
          if (board[r][c] !== 0 && r !== 0) {
            for (let i = r - 1; i >= 0; i--) {
              if (trs[i][c].innerText !== '') {
                if (trs[i][c].innerText === trs[r][c].innerText
                  && !trs[i][c].classList['notAdd']) {
                  moveCell(c, r, i, false, true);
                  break;
                }

                if (r !== i + 1) {
                  moveCell(c, r, i + 1, false, false);
                }
                break;
              } else if (i === 0) {
                moveCell(c, r, i, false, false);
              }
            }
          }
        }
      }

      afterCheckMoves();
      checkLose();
    }
  });
}

function checkLose() {
  if (!board.some(tr => tr.includes(0))) {
    const posibleMove = board.some(tr => {
      for (let i = 1; i < tr.length; i++) {
        if (tr[i] === tr[i - 1]) {
          return true;
        }
      }
    });

    if (posibleMove) {
      return;
    }

    for (let col = 0; col < board[0].length; col++) {
      for (let row = 1; row < board.length; row++) {
        if (board[row][col] === board[row - 1][col]) {
          return;
        }
      }
    }

    table.style.opacity = 0.5;
    messageStart.classList.add('hidden');
    messageLose.classList.remove('hidden');
  }
}

function afterCheckMoves() {
  if (moves > 0) {
    addNewTile();
    dontAddCells = [...document.querySelectorAll('.notAdd')];
  }
}

function resetAfterCycle() {
  moves = 0;
  dontAddCells.map(cell => cell.classList.remove('notAdd'));
}

function moveCell(constant, startIndex, endIndex, byRow, addtiton) {
  const startCell = (byRow)
    ? trs[constant][startIndex]
    : trs[startIndex][constant];
  const endCell = (byRow)
    ? trs[constant][endIndex]
    : trs[endIndex][constant];

  const digit = startCell.innerText;
  const sum = '' + (Number(digit) * 2);

  if (byRow) {
    board[constant][startIndex] = 0;
    board[constant][endIndex] = (addtiton) ? sum : digit;
  } else {
    board[startIndex][constant] = 0;
    board[endIndex][constant] = (addtiton) ? sum : digit;
  }

  if (addtiton) {
    endCell.classList.remove(`field-cell--${digit}`);
    endCell.classList.add(`notAdd`);
    emptyCells++;
    score.innerText = Number(score.innerText) + Number(sum);
  }

  endCell.classList.add(`field-cell--${(addtiton) ? sum : digit}`);
  endCell.innerText = `${(addtiton) ? sum : digit}`;

  startCell.classList.remove(`field-cell--${digit}`);
  startCell.innerText = '';

  moves++;

  if (endCell.innerText === '2048') {
    messageStart.classList.add('hidden');
    messageWin.classList.remove('hidden');
  }
}

function createCleanBoard() {
  const matrix = [];

  for (let r = 0; r < rows; r++) {
    matrix.push([]);

    for (let c = 0; c < cols; c++) {
      matrix[r].push(0);
    }
  }

  return matrix;
}

function addNewTile() {
  while (emptyCells >= 1) {
    const row = Math.floor(Math.random() * rows);

    while (board[row].includes(0)) {
      const col = Math.floor(Math.random() * cols);

      if (board[row][col] === 0) {
        return createNewTile(row, col);
      }
    }

    continue;
  }
}

function createNewTile(row, col) {
  const digit = (Math.random() < 0.1) ? 4 : 2;

  emptyCells--;
  createTile(digit, row, col);
}

function createTile(digit, row, col) {
  trs[row][col].classList.add(`field-cell--${digit}`);
  trs[row][col].innerText = `${digit}`;
  board[row][col] = `${digit}`;
}
