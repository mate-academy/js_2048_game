'use strict';

const offset = require('./offsetConfig');
const directions = require('./directionsConfig');

const everySquare = Array.from(document.querySelectorAll('.field-cell'));
const everyRow = Array.from(document.querySelectorAll('.field-row'));
const mainButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
let canMoveInAnyDirection = [];
let touchStartX = 0;
let touchStartY = 0;
let score = 0;

const COLUMN_LENGTH = 4;

function appendNumber() {
  const emptySquares = everySquare.filter(square => square.innerHTML === '');

  if (emptySquares.length === 0) {
    return;
  }

  const index = Math.floor(Math.random() * emptySquares.length);
  const randomSquare = emptySquares[index];
  const value = Math.random() > 0.9 ? 4 : 2;

  setCellValue(randomSquare, value);
}

function setColumn(filtered) {
  return filtered.map(cell => parseInt(cell.innerHTML, 10) || '');
}

function setCellValue(cell, value) {
  cell.innerHTML = value || '';
  cell.className = 'field-cell' + (value ? ` field-cell--${value}` : '');
}

function getNewRow(column, direction) {
  const filtered = column.filter(num => num);
  const missing = COLUMN_LENGTH - filtered.length;
  const unfilled = Array(missing).fill('');

  return (
    direction === directions.down || direction === directions.right
      ? unfilled.concat(filtered)
      : filtered.concat(unfilled)
  );
}

function checkMoveAndFinish() {
  if (canMoveInAnyDirection.includes(true)) {
    canMoveInAnyDirection = [];
    appendNumber();
  }

  checkIfGameFinished();
}

function moveDown() {
  for (let i = 0; i < everyRow.length; i++) {
    const filteredColumn = everySquare.filter(td => td.cellIndex === i);

    moveAndCombine(directions.down, filteredColumn);
  };

  checkMoveAndFinish();
}

function moveUp() {
  for (let i = 0; i < everyRow.length; i++) {
    const filteredColumn = everySquare.filter(td => td.cellIndex === i);

    moveAndCombine(directions.up, filteredColumn);
  };

  checkMoveAndFinish();
}

function moveRight() {
  for (let i = 0; i < everyRow.length; i++) {
    const filteredColumn = everyRow.filter(tr => tr.rowIndex === i)[0].cells;

    moveAndCombine(directions.right, filteredColumn);
  };

  checkMoveAndFinish();
}

function moveLeft() {
  for (let i = 0; i < everyRow.length; i++) {
    const filteredColumn = everyRow.filter(tr => tr.rowIndex === i)[0].cells;

    moveAndCombine(directions.left, filteredColumn);
  };

  checkMoveAndFinish();
}

function moveAndCombine(direction, filteredColumn) {
  const column = setColumn([...filteredColumn]);
  const newRow = getNewRow(column, direction);

  if (canMove(direction, column)) {
    move(filteredColumn, newRow);
    combine(direction, newRow, filteredColumn);
  }
}

function combine(direction, row, collection) {
  if (direction === directions.left || direction === directions.up) {
    for (let k = 1; k < row.length; k++) {
      const prev = row[k - offset.one];
      const total = row[k] + prev;
      const hasPairs = (
        row[k] === prev
        && prev !== ''
        && row[k + offset.one]
        && row[k + offset.two]
        && row[k + offset.one] === row[k + offset.two]
      );

      if (hasPairs) {
        row[k - offset.one] = total;
        row[k] = row[k + offset.one] + row[k + offset.two];
        row[k + offset.one] = '';
        row[k + offset.two] = '';

        updateScore(total + row[k]);

        setCellValue(collection[k - offset.one], total);
        setCellValue(collection[k], row[k]);
        setCellValue(collection[k + offset.one], row[k + offset.one]);
        setCellValue(collection[k + offset.two], row[k + offset.two]);

        break;
      }

      if (row[k] === prev && row[k]) {
        row[k - offset.one] = total;
        row[k] = '';

        updateScore(total);

        setCellValue(collection[k - offset.one], total);
        setCellValue(collection[k], row[k]);
      }

      if (row[k] && prev === '') {
        row[k - offset.one] = row[k];
        row[k] = '';

        setCellValue(collection[k - offset.one], row[k - offset.one]);
        setCellValue(collection[k], row[k]);
      }
    }
  }

  if (direction === directions.right || direction === directions.down) {
    for (let k = row.length - 1; k > 0; k--) {
      const prev = row[k - offset.one];
      const total = row[k] + prev;
      const hasPairs = (
        row[k] === prev
        && prev !== ''
        && row[k - offset.two]
        && row[k - offset.three]
        && row[k - offset.two] === row[k - offset.three]
      );

      if (hasPairs) {
        row[k] = total;
        row[k - offset.one] = row[k - offset.two] + row[k - offset.three];
        row[k - offset.two] = '';
        row[k - offset.three] = '';

        updateScore(total + row[k]);

        setCellValue(collection[k], total);
        setCellValue(collection[k - offset.one], row[k - offset.one]);
        setCellValue(collection[k - offset.two], '');
        setCellValue(collection[k - offset.three], '');

        break;
      }

      if (row[k] === prev && prev) {
        row[k - offset.one] = '';
        row[k] = total;

        updateScore(total);

        setCellValue(collection[k], total);
        setCellValue(collection[k - offset.one], '');
      }

      if (prev && row[k] === '') {
        row[k] = row[k - offset.one];
        row[k - offset.one] = '';

        setCellValue(collection[k], row[k]);
        setCellValue(collection[k - offset.one], '');
      }
    }
  }
}

function markMovementPossible() {
  canMoveInAnyDirection.push(true);

  return true;
}

function move(filteredColumn, row) {
  for (let j = 0; j < filteredColumn.length; j++) {
    setCellValue(filteredColumn[j], row[j]);
  }
}

function canMove(direction, column) {
  if (direction === directions.left || direction === directions.up) {
    for (let j = 1; j < column.length; j++) {
      const emptyString = column.find(col => col === '');
      const curr = column[j];
      const prev = column[j - offset.one];

      if (prev === emptyString && curr) {
        return markMovementPossible();
      }

      if (column[0] === '' && curr) {
        return markMovementPossible();
      }

      if ((curr && prev) && (curr === prev)) {
        return markMovementPossible();
      }
    }
  }

  if (direction === directions.right || direction === directions.down) {
    for (let j = column.length - 1; j > 0; j--) {
      const emptyString = column.find(col => col === '');
      const curr = column[j];
      const prev = column[j - offset.one];

      if (curr === emptyString && prev) {
        return markMovementPossible();
      }

      if (column[column.length - 1] === '' && curr) {
        return markMovementPossible();
      }

      if ((curr && prev) && (curr === prev)) {
        return markMovementPossible();
      }
    }
  }

  return false;
}

function checkIfGameFinished() {
  const cells = Array.from(document.querySelectorAll('td'));
  const isWon = cells.find(cell => cell.innerHTML.includes('2048'));

  if (isWon) {
    document.querySelector('.message-win').classList.remove('hidden');

    return;
  }

  let gameOver = true;

  for (let i = 0; i < cells.length; i++) {
    const currCell = cells[i];
    const rightCell = cells[i + offset.one];
    const bottomCell = cells[i + offset.four];
    const isGameOver = !currCell.innerHTML || (
      rightCell && currCell.cellIndex !== 3
      && currCell.innerHTML === rightCell.innerHTML
    ) || (bottomCell && currCell.innerHTML === bottomCell.innerHTML);

    if (isGameOver) {
      gameOver = false;
      break;
    }
  }

  if (gameOver) {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

function updateScore(value) {
  score += value;
  gameScore.innerHTML = score;
}

function restart() {
  Array.from(document.querySelectorAll('td')).forEach(cell => {
    setCellValue(cell, '');
  });

  score = 0;

  updateScore(score);
  appendNumber();
  appendNumber();
}

mainButton.addEventListener('click', (e) => {
  const { target } = e;

  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');

  target.classList.remove('start');
  target.classList.add('restart');
  target.innerHTML = 'Restart';

  if (target.classList.contains('restart')) {
    restart();
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowDown':
      moveDown();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowLeft':
      moveLeft();
      break;

    default:
      break;
  }
});

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
  if (!touchStartX || !touchStartY) {
    return;
  }

  const touchEndX = e.touches[0].clientX;
  const touchEndY = e.touches[0].clientY;
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  Math.abs(deltaX) > Math.abs(deltaY)
    ? deltaX > 0 ? moveRight() : moveLeft()
    : deltaY > 0 ? moveDown() : moveUp();

  touchStartX = 0;
  touchStartY = 0;
}
