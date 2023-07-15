'use strict';

const gameField = document.querySelector('.game-field');
const cellsNodes = Array.from(gameField.querySelectorAll('td'));
const cellsNumbers = cellsNodes.map(cell => +cell.innerHTML.trim());

const messageContainer = document.querySelector('.message-container');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');

const startButton = document.querySelector('.start');
const showChangeScore = document.querySelector('.show-change-score');

const cellSound = document.querySelector('#cell__sound');
const winSound = document.querySelector('#win__sound');
const loseSound = document.querySelector('#lose__sound');

let initialScore = 0;
let oldScore = initialScore;
let changeScore;
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
      'tile'
    );
  });

  if (isGameOver()) {
    setTimeout(() => {
      messageLose.classList.remove('hidden');
      messageStart.classList.remove('hidden');
      messageContainer.style.opacity = 0.7;
      startButton.classList.add('restart-lose');
      startButton.innerHTML = 'Restart';
      loseSound.play();
    }, 1000);
  }

  if (isWin()) {
    winMessage.classList.remove('hidden');
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
        initialScore += filteredColumn[index + 1] * 2;
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
  cellSound.play();
}

function moveRow(movement) {
  for (let i = 0; i < 16; i += 4) {
    const row = cellsNumbers.slice(i, i + 4);
    let filteredRow = row.filter(num => num > 0);

    for (let index = 0; index < filteredRow.length; index++) {
      if (filteredRow[index] === filteredRow[index + 1]) {
        initialScore += +filteredRow[index + 1] * 2;
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
  cellSound.play();
}

function resetGame() {
  cellsNumbers.fill(0);

  cellsNodes.forEach(cell => {
    cell.innerHTML = '';
    cell.classList.remove(...Array.from(cell.classList));
    cell.classList.add('field-cell');
  });

  initialScore = 0;
  score.innerHTML = '0';
}

function isWin() {
  if (cellsNumbers.find(num => num === 2048)) {
    disableKeyboardEvents();
    winSound.play();

    return true;
  }
}

function isGameOver() {
  if (cellsNumbers.includes(0)) {
    return false;
  }

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const index = row * 4 + col;

      if (cellsNumbers[index] === cellsNumbers[index + 1]) {
        return false;
      }
    }
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 4 + col;

      if (cellsNumbers[index] === cellsNumbers[index + 4]) {
        return false;
      }
    }
  }
  disableKeyboardEvents();

  return true;
}

startButton.addEventListener('click', () => {
  if (isGameOver()) {
    disableKeyboardEvents();
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');
    messageContainer.style.opacity = 0;
    resetGame();
  }
  startButton.innerHTML = 'Start';
  startButton.classList.add('restart');
  startButton.innerHTML = 'Restart';
  startButton.classList.remove('restart-lose');
  resetGame();

  getRandomCell(cellsNodes, cellsNumbers);
  getRandomCell(cellsNodes, cellsNumbers);
  updateBoard();

  enableKeyboardEvents();
});

function handleKeyDown(e) {
  if (e.defaultPrevented) {
    return;
  }

  switch (e.key) {
    case 'Down':
    case 'ArrowDown':
      oldScore = initialScore;
      moveColumn('down');
      updateBoard();
      getRandomCell();
      updateBoard();
      score.innerHTML = initialScore;
      changeScore = initialScore - oldScore;

      if (changeScore > 0) {
        showChangeScore.innerHTML = `+${changeScore}`;
        showChangeScore.style.opacity = 1;
        showChangeScore.style.transform = 'translateY(-15px)';

        setTimeout(() => {
          showChangeScore.style.opacity = 0;
          showChangeScore.style.transform = 'translateY(0)';
        }, 800);
      }

      break;
    case 'Up':
    case 'ArrowUp':
      oldScore = initialScore;

      moveColumn('up');
      updateBoard();
      getRandomCell();
      updateBoard();
      score.innerHTML = initialScore;
      changeScore = initialScore - oldScore;

      if (changeScore > 0) {
        showChangeScore.innerHTML = `+${changeScore}`;
        showChangeScore.style.opacity = 1;
        showChangeScore.style.transform = 'translateY(-15px)';

        setTimeout(() => {
          showChangeScore.style.opacity = 0;
          showChangeScore.style.transform = 'translateY(0)';
        }, 800);
      }

      break;

    case 'Left':
    case 'ArrowLeft':
      oldScore = initialScore;

      moveRow('left');
      updateBoard();
      getRandomCell();
      updateBoard();
      score.innerHTML = initialScore;
      changeScore = initialScore - oldScore;

      if (changeScore > 0) {
        showChangeScore.innerHTML = `+${changeScore}`;
        showChangeScore.style.opacity = 1;
        showChangeScore.style.transform = 'translateY(-15px)';

        setTimeout(() => {
          showChangeScore.style.opacity = 0;
          showChangeScore.style.transform = 'translateY(0)';
        }, 800);
      }
      break;
    case 'Right':
    case 'ArrowRight':
      oldScore = initialScore;

      moveRow('right');
      updateBoard();
      getRandomCell();
      updateBoard();
      score.innerHTML = initialScore;
      changeScore = initialScore - oldScore;

      if (changeScore > 0) {
        showChangeScore.innerHTML = `+${changeScore}`;
        showChangeScore.style.opacity = 1;
        showChangeScore.style.transform = 'translateY(-15px)';

        setTimeout(() => {
          showChangeScore.style.opacity = 0;
          showChangeScore.style.transform = 'translateY(0)';
        }, 800);
      }

      break;
    default:
      return;
  }

  e.preventDefault();
}

function enableKeyboardEvents() {
  window.addEventListener('keydown', handleKeyDown);
}

function disableKeyboardEvents() {
  window.removeEventListener('keydown', handleKeyDown);
}
