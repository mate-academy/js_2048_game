'use strict';

const everySquare = Array.from(document.querySelectorAll('.field-cell'));
const everyRow = Array.from(document.querySelectorAll('.field-row'));
const mainButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
let canMoveInAnyDirection = [];
let touchStartX = 0;
let touchStartY = 0;
let score = 0;

const COLUMN_LENGTH = 4;
const OFFSET_ONE = 1;
const OFFSET_TWO = 2;
const OFFSET_THREE = 3;
const OFFSET_FOUR = 4;
const RIGHT_DIRECTION = 'right';
const LEFT_DIRECTION = 'left';
const UP_DIRECTION = 'up';
const DOWN_DIRECTION = 'down';

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
    direction === DOWN_DIRECTION || direction === RIGHT_DIRECTION
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

    moveAndCombine(DOWN_DIRECTION, filteredColumn);
  };

  checkMoveAndFinish();
}

function moveUp() {
  for (let i = 0; i < everyRow.length; i++) {
    const filteredColumn = everySquare.filter(td => td.cellIndex === i);

    moveAndCombine(UP_DIRECTION, filteredColumn);
  };

  checkMoveAndFinish();
}

function moveRight() {
  for (let i = 0; i < everyRow.length; i++) {
    const filteredColumn = everyRow.filter(tr => tr.rowIndex === i)[0].cells;

    moveAndCombine(RIGHT_DIRECTION, filteredColumn);
  };

  checkMoveAndFinish();
}

function moveLeft() {
  for (let i = 0; i < everyRow.length; i++) {
    const filteredColumn = everyRow.filter(tr => tr.rowIndex === i)[0].cells;

    moveAndCombine(LEFT_DIRECTION, filteredColumn);
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
  if (direction === LEFT_DIRECTION || direction === UP_DIRECTION) {
    for (let k = 1; k < row.length; k++) {
      const prev = row[k - OFFSET_ONE];
      const total = row[k] + prev;
      const hasPairs = (
        row[k] === prev
        && prev !== ''
        && row[k + OFFSET_ONE]
        && row[k + OFFSET_TWO]
        && row[k + OFFSET_ONE] === row[k + OFFSET_TWO]
      );

      if (hasPairs) {
        row[k - OFFSET_ONE] = total;
        row[k] = row[k + OFFSET_ONE] + row[k + OFFSET_TWO];
        row[k + OFFSET_ONE] = '';
        row[k + OFFSET_TWO] = '';

        updateScore(total + row[k]);

        setCellValue(collection[k - OFFSET_ONE], total);
        setCellValue(collection[k], row[k]);
        setCellValue(collection[k + OFFSET_ONE], row[k + OFFSET_ONE]);
        setCellValue(collection[k + OFFSET_TWO], row[k + OFFSET_TWO]);

        break;
      }

      if (row[k] === prev && row[k]) {
        row[k - OFFSET_ONE] = total;
        row[k] = '';

        updateScore(total);

        setCellValue(collection[k - OFFSET_ONE], total);
        setCellValue(collection[k], row[k]);
      }

      if (row[k] && prev === '') {
        row[k - OFFSET_ONE] = row[k];
        row[k] = '';

        setCellValue(collection[k - OFFSET_ONE], row[k - OFFSET_ONE]);
        setCellValue(collection[k], row[k]);
      }
    }
  }

  if (direction === RIGHT_DIRECTION || direction === DOWN_DIRECTION) {
    for (let k = row.length - 1; k > 0; k--) {
      const prev = row[k - OFFSET_ONE];
      const total = row[k] + prev;
      const hasPairs = (
        row[k] === prev
        && prev !== ''
        && row[k - OFFSET_TWO]
        && row[k - OFFSET_THREE]
        && row[k - OFFSET_TWO] === row[k - OFFSET_THREE]
      );

      if (hasPairs) {
        row[k] = total;
        row[k - OFFSET_ONE] = row[k - OFFSET_TWO] + row[k - OFFSET_THREE];
        row[k - OFFSET_TWO] = '';
        row[k - OFFSET_THREE] = '';

        updateScore(total + row[k]);

        setCellValue(collection[k], total);
        setCellValue(collection[k - OFFSET_ONE], row[k - OFFSET_ONE]);
        setCellValue(collection[k - OFFSET_TWO], '');
        setCellValue(collection[k - OFFSET_THREE], '');

        break;
      }

      if (row[k] === prev && prev) {
        row[k - OFFSET_ONE] = '';
        row[k] = total;

        updateScore(total);

        setCellValue(collection[k], total);
        setCellValue(collection[k - OFFSET_ONE], '');
      }

      if (prev && row[k] === '') {
        row[k] = row[k - OFFSET_ONE];
        row[k - OFFSET_ONE] = '';

        setCellValue(collection[k], row[k]);
        setCellValue(collection[k - OFFSET_ONE], '');
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
  if (direction === LEFT_DIRECTION || direction === UP_DIRECTION) {
    for (let j = 1; j < column.length; j++) {
      const emptyString = column.find(col => col === '');
      const curr = column[j];
      const prev = column[j - OFFSET_ONE];

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

  if (direction === RIGHT_DIRECTION || direction === DOWN_DIRECTION) {
    for (let j = column.length - 1; j > 0; j--) {
      const emptyString = column.find(col => col === '');
      const curr = column[j];
      const prev = column[j - OFFSET_ONE];

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
    const rightCell = cells[i + OFFSET_ONE];
    const bottomCell = cells[i + OFFSET_FOUR];
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
