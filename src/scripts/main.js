'use strict';

const everySquare = Array.from(document.querySelectorAll('.field-cell'));
const everyRow = Array.from(document.querySelectorAll('.field-row'));
const mainButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
let canMoveInAnyDirection = [];
let score = 0;

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
  const missing = 4 - filtered.length;
  const unfilled = Array(missing).fill('');

  return (
    direction === 'down'
    || direction === 'right'
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

    moveAndCombine('down', filteredColumn);
  };

  checkMoveAndFinish();
}

function moveUp() {
  for (let i = 0; i < everyRow.length; i++) {
    const filteredColumn = everySquare.filter(td => td.cellIndex === i);

    moveAndCombine('up', filteredColumn);
  };

  checkMoveAndFinish();
}

function moveRight() {
  for (let i = 0; i < everyRow.length; i++) {
    const filteredColumn = everyRow.filter(tr => tr.rowIndex === i)[0].cells;

    moveAndCombine('right', filteredColumn);
  };

  checkMoveAndFinish();
}

function moveLeft() {
  for (let i = 0; i < everyRow.length; i++) {
    const filteredColumn = everyRow.filter(tr => tr.rowIndex === i)[0].cells;

    moveAndCombine('left', filteredColumn);
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
  if (direction === 'left' || direction === 'up') {
    for (let k = 1; k < row.length; k++) {
      const prev = row[k - 1];
      const total = row[k] + prev;
      const hasPairs = row[k] === prev
         && prev !== ''
         && row[k + 1] === row[k + 2]
         && row[k + 1]
         && row[k + 2];

      if (hasPairs) {
        row[k - 1] = total;
        row[k] = row[k + 1] + row[k + 2];
        row[k + 1] = '';
        row[k + 2] = '';

        updateScore(total + row[k]);

        setCellValue(collection[k - 1], total);
        setCellValue(collection[k], row[k]);
        setCellValue(collection[k + 1], row[k + 1]);
        setCellValue(collection[k + 2], row[k + 2]);

        break;
      }

      if (row[k] === prev && row[k]) {
        row[k - 1] = total;
        row[k] = '';

        updateScore(total);

        setCellValue(collection[k - 1], total);
        setCellValue(collection[k], row[k]);
      }

      if (row[k] && prev === '') {
        row[k - 1] = row[k];
        row[k] = '';

        setCellValue(collection[k - 1], row[k - 1]);
        setCellValue(collection[k], row[k]);
      }
    }
  }

  if (direction === 'right' || direction === 'down') {
    for (let k = row.length - 1; k > 0; k--) {
      const prev = row[k - 1];
      const total = row[k] + prev;
      const hasPairs = row[k] === prev
        && prev !== ''
        && row[k - 2] === row[k - 3]
        && row[k - 2]
        && row[k - 3];

      if (hasPairs) {
        row[k] = total;
        row[k - 1] = row[k - 2] + row[k - 3];
        row[k - 2] = '';
        row[k - 3] = '';

        updateScore(total + row[k]);

        setCellValue(collection[k], total);
        setCellValue(collection[k - 1], row[k - 1]);
        setCellValue(collection[k - 2], '');
        setCellValue(collection[k - 3], '');

        break;
      }

      if (row[k] === prev && prev) {
        row[k - 1] = '';
        row[k] = total;

        updateScore(total);

        setCellValue(collection[k], total);
        setCellValue(collection[k - 1], '');
      }

      if (prev && row[k] === '') {
        row[k] = row[k - 1];
        row[k - 1] = '';

        setCellValue(collection[k], row[k]);
        setCellValue(collection[k - 1], '');
      }
    }
  }
}

function move(filteredColumn, row) {
  for (let j = 0; j < filteredColumn.length; j++) {
    setCellValue(filteredColumn[j], row[j]);
  }
}

function canMove(direction, column) {
  if (direction === 'left' || direction === 'up') {
    for (let j = 1; j < column.length; j++) {
      const emptyString = column.find(col => col === '');
      const curr = column[j];
      const prev = column[j - 1];

      if (prev === emptyString && curr) {
        canMoveInAnyDirection.push(true);

        return true;
      }

      if (column[0] === '' && curr) {
        canMoveInAnyDirection.push(true);

        return true;
      }

      if ((curr && prev) && (curr === prev)) {
        canMoveInAnyDirection.push(true);

        return true;
      }
    }
  }

  if (direction === 'right' || direction === 'down') {
    for (let j = column.length - 1; j > 0; j--) {
      const emptyString = column.find(col => col === '');
      const curr = column[j];
      const prev = column[j - 1];

      if (curr === emptyString && prev) {
        canMoveInAnyDirection.push(true);

        return true;
      }

      if (column[column.length - 1] === '' && curr) {
        canMoveInAnyDirection.push(true);

        return true;
      }

      if ((curr && prev) && (curr === prev)) {
        canMoveInAnyDirection.push(true);

        return true;
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
    const rightCell = cells[i + 1];
    const bottomCell = cells[i + 4];
    const isGameOver = !currCell.innerHTML || (rightCell
      && currCell.cellIndex !== 3 && currCell.innerHTML === rightCell.innerHTML)
      || (bottomCell && currCell.innerHTML === bottomCell.innerHTML);

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
  Array.from(document.querySelectorAll('td')).map(cell => {
    setCellValue(cell, '');

    return cell;
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
