'use strict';

const gameField = document.querySelector('.game-field');
const cellsNodes = Array.from(gameField.querySelectorAll('td'));
const cellsNumbers = cellsNodes.map(cell => +cell.innerHTML.trim());
const messageContainer = document.querySelector('.message-container');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const startButton = document.querySelector('.start');

const score = document.querySelector('.game-score');

function getRandomCell() {
  const emptyCells = cellsNodes.filter(isEmptyCell);

  if (emptyCells.length === 0) {
    return;
  }

  const value = Math.random() > 0.9 ? 4 : 2;
  const index = Math.floor(Math.random() * emptyCells.length);
  const cell = emptyCells[index];

  cell.innerHTML = value;
  cellsNumbers[cellsNodes.indexOf(cell)] = value;
}

function isEmptyCell(cell) {
  return +cell.innerHTML < 2;
}

function sumScore(array) {
  return array.reduce((sum, current) => sum + current);
}

function updateBoard() {
  cellsNodes.forEach((cell, index) => {
    if (cellsNumbers[index] === 0) {
      cell.innerHTML = '';
      cell.classList.remove(...Array.from(cell.classList));
      cell.classList.add(`field-cell`);

      return;
    }
    cell.innerHTML = cellsNumbers[index];
    cell.classList.remove(...Array.from(cell.classList));

    cell.classList.add(
      `field-cell`,
      `field-cell--${cellsNumbers[index]}`,
      'tile');
  });

  if (isGameOver()) {
    setTimeout(() => {
      messageLose.classList.remove('hidden');
      messageStart.classList.remove('hidden');
      messageContainer.style.opacity = 0.7;
      startButton.classList.add('restart');
      startButton.innerHTML = 'Restart';
    }, 1000);
  }
}

function moveColumn(movement) {
  for (let col = 0; col < 4; col++) {
    const column = [];

    for (let row = 0; row < 4; row++) {
      const currentIndex = row * 4 + col;

      column.push(cellsNumbers[currentIndex]);
    }

    let filteredColumn = column.filter(num => num > 0);

    for (let index = 0; index < filteredColumn.length; index++) {
      if (filteredColumn[index] === filteredColumn[index + 1]) {
        filteredColumn[index] *= 2;
        filteredColumn[index + 1] = 0;
        ++index;
      }
    }
    filteredColumn = filteredColumn.filter(num => num > 0);

    const emptyCellsLength = 4 - filteredColumn.length;

    const zeroArray = Array(emptyCellsLength).fill(0);
    let updatedColumn;

    if (movement === 'up') {
      updatedColumn = filteredColumn.concat(zeroArray);
    } else {
      updatedColumn = zeroArray.concat(filteredColumn);
    }

    for (let row = 0; row < 4; row++) {
      cellsNumbers[row * 4 + col] = updatedColumn[row];
    }
  }
}

function moveRow(movement) {
  for (let i = 0; i < 16; i += 4) {
    const row = cellsNumbers.slice(i, i + 4);
    let filteredRow = row.filter(num => num > 0);

    for (let index = 0; index < filteredRow.length; index++) {
      if (filteredRow[index] === filteredRow[index + 1]) {
        filteredRow[index + 1] *= 2;
        filteredRow[index] = 0;
        index++;
      }
    }

    filteredRow = filteredRow.filter(num => num > 0);

    const emptyCellsLength = 4 - filteredRow.length;
    const zeroArray = Array(emptyCellsLength).fill(0);
    let updatedRow;

    if (movement === 'right') {
      updatedRow = zeroArray.concat(filteredRow);
    } else {
      updatedRow = filteredRow.concat(zeroArray);
    }

    for (let j = 0; j < 4; j++) {
      cellsNumbers[i + j] = updatedRow[j];
    }
  }
}

function resetGame() {
  // Clear cellsNumbers array
  cellsNumbers.fill(0);

  // Reset cell HTML and class
  cellsNodes.forEach(cell => {
    cell.innerHTML = '';
    cell.classList.remove(...Array.from(cell.classList));
    cell.classList.add('field-cell');
  });

  // Reset score
  score.innerHTML = '0';

  // Reset any other necessary variables or game state
}

function isGameOver() {
  if (cellsNumbers.includes(0)) {
    return false;
  }

  // horizontal check

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const index = row * 4 + col;

      if (cellsNumbers[index] === cellsNumbers[index + 1]) {
        return false;
      }
    }
  }

  // vertical  check

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 4 + col;

      if (cellsNumbers[index] === cellsNumbers[index + 4]) {
        return false;
      }
    }
  }

  return true;
}

startButton.addEventListener('click', () => {
  if (isGameOver()) {
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');
    messageContainer.style.opacity = 0;
    resetGame();
  }
  startButton.innerHTML = 'Start';

  startButton.classList.remove('restart');
  resetGame();

  getRandomCell(cellsNodes, cellsNumbers);
  getRandomCell(cellsNodes, cellsNumbers);
  updateBoard();
});

window.addEventListener('keydown', function(e) {
  if (e.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (e.key) {
    case 'Down': // IE/Edge specific value
    case 'ArrowDown':
      score.innerHTML = sumScore(cellsNumbers);
      moveColumn('down');
      updateBoard();
      getRandomCell();
      updateBoard();
      break;
    case 'Up': // IE/Edge specific value
    case 'ArrowUp':
      score.innerHTML = sumScore(cellsNumbers);

      moveColumn('up');
      updateBoard();
      getRandomCell();
      updateBoard();
      break;

    case 'Left': // IE/Edge specific value
    case 'ArrowLeft':
      score.innerHTML = sumScore(cellsNumbers);
      moveRow('left');
      updateBoard();
      getRandomCell();
      updateBoard();

      break;
    case 'Right': // IE/Edge specific value
    case 'ArrowRight':
      score.innerHTML = sumScore(cellsNumbers);
      moveRow('right');
      updateBoard();
      getRandomCell();
      updateBoard();
      break;
    case 'Enter':
      score.innerHTML = sumScore(cellsNumbers);
      break;
    case 'Esc': // IE/Edge specific value
    case 'Escape':
      score.innerHTML = sumScore(cellsNumbers);
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  e.preventDefault();
}, true);
