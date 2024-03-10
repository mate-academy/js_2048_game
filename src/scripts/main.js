'use strict';

const sizeAllBoxes = 4;
let allBoxes = [...Array(sizeAllBoxes)].map(() => Array(sizeAllBoxes).fill(0));
let score = 0;
let statusWinner = false;
const boxes = document.querySelectorAll('.field-cell');
const startButton = document.getElementById('start-button');
const needKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
const message = {
  Start: document.getElementById('message-start'),
  Lose: document.getElementById('message-lose'),
  Winner: document.getElementById('message-win'),
};
/// Стврюєм початок : Викликаєм Функцію startGame

startButton.addEventListener('click', startGame);

function startGame() {
  resetGame();
  changeButton();
  addRandomField(allBoxes);
  addRandomField(allBoxes);
  drawallBoxes(allBoxes, boxes);
}
/// Це зброс гри для початку

const resetGame = () => {
  score = 0;
  statusWinner = false;
  document.querySelector('.game-score').innerText = score;
  /// Чи обов'язково створювати повторно allBoxes , адже Він є рядок 2
  allBoxes = [...Array(sizeAllBoxes)].map(() => Array(sizeAllBoxes).fill(0));
  message.Winner.classList.add('hidden');
  message.Lose.classList.add('hidden');
};

function addRandomField(allBoxesArray) {
  const emptyboxes = [];

  allBoxesArray.forEach((row, roWinnerdex) => {
    row.forEach((value, colIndex) => {
      value === 0 && emptyboxes.push({
        roWinnerdex, colIndex,
      });
    });
  });

  if (emptyboxes.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyboxes.length);
    const randomCell = emptyboxes[randomIndex];

    // randomCell зберіг коп кординат,числа кординат яких фіксуєм allBoxesArray

    allBoxesArray[randomCell.roWinnerdex][randomCell.colIndex]
      = Math.random() < 0.9 ? 2 : 4;
  }
}

const drawallBoxes = (allBoxesArray, curboxes) => {
  allBoxesArray.forEach((row, roWinnerd) => {
    row.forEach((value, colInd) => {
      /// Проходимось по всім клітинам
      const cell = curboxes[roWinnerd * allBoxesArray.length + colInd];

      if (value > 0) {
        cell.textContent = value;
        cell.classList = 'field-cell' + ` field-cell--${value}`;
      } else {
        cell.textContent = null;
        cell.classList = 'field-cell';
      }
    });
  });
};

const changeButton = () => {
  startButton.classList += ' restart';
  startButton.innerText = 'Restart';
  startButton.style = 'border: 2px solid red; color: #776e65; outline: none;';
  message.Start.classList.add('hidden');
};
/// спрацьовує виклик при нажатті

document.addEventListener('keyup', e => {
  if (!needKeys.includes(e.key) || statusWinner) {
    return;
  }
  /// ???

  const copieBoxes = JSON.parse(JSON.stringify(allBoxes));

  switch (e.key) {
    case 'ArrowLeft':
      slideLeft();
      getWinnerMessage(allBoxes);
      getLoseMessage(allBoxes);
      break;

    case 'ArrowRight':
      slideRight();
      getWinnerMessage(allBoxes);
      getLoseMessage(allBoxes);
      break;

    case 'ArrowUp':
      slideUp();
      getWinnerMessage(allBoxes);
      getLoseMessage(allBoxes);
      break;

    case 'ArrowDown':
      slideDown();
      getWinnerMessage(allBoxes);
      getLoseMessage(allBoxes);
      break;

    default:
      break;
  }

  document.querySelector('.game-score').innerText = score;

  if (isMoved(copieBoxes)) {
    addRandomField(allBoxes);
    drawallBoxes(allBoxes, boxes);
  }
});

const isMoved = (copieBoxes) => {
  for (let r = 0; r < sizeAllBoxes; r++) {
    for (let c = 0; c < sizeAllBoxes; c++) {
      if (copieBoxes[r][c] !== allBoxes[r][c]) {
        return true;
      }
    }
  }

  return false;
};

const slideLeft = () => {
  allBoxes = allBoxes.map(row => slide(row));
};

const slideRight = () => {
  allBoxes = allBoxes.map(row => slide(row.reverse()).reverse());
};

function slideUp() {
  /// Зберігаємо зміну трансформуючи рядок в колонку
  const columns = prepareColumns(allBoxes);

  allBoxes = prepareColumns(columns.map(col => slide(col)));
}

function slideDown() {
  let columns = prepareColumns(allBoxes);

  columns = columns.map(col => slide(col.reverse()).reverse());

  allBoxes = prepareColumns(columns);
};

const deleteZeros = row => row.filter(Boolean);

const slide = row => {
  const rowClear = deleteZeros(row);
  let newRow = rowClear;

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }
  newRow = deleteZeros(newRow);

  while (newRow.length < 4) {
    newRow.push(0);
  }

  return newRow;
};

function prepareColumns(allBoxesArr) {
  return allBoxesArr.map((row, roWinnerd, rowArr) => {
    return row.map((_, colInd) => {
      return rowArr[colInd][roWinnerd];
    });
  });
}

const getWinnerMessage = (allBoxesArray) => {
  allBoxesArray.forEach(row => {
    row.forEach(cell => {
      if (cell >= 2048) {
        statusWinner = true;
        message.Start.classList.remove('hidden');
      }
    });
  });
};

function getLoseMessage() {
  if (isallBoxesFull() && !canMakeMove()) {
    message.Lose.classList.remove('hidden');
  }
};

function isallBoxesFull() {
  return allBoxes.every(row => row.every(tile => tile !== 0));
}

function canMakeMove() {
  for (let r = 0; r < sizeAllBoxes; r++) {
    for (let c = 0; c < sizeAllBoxes; c++) {
      const value = allBoxes[r][c];

      if (value !== 0) {
        if (r < 3 && value === allBoxes[r + 1][c]) {
          return true;
        };

        if (c < 3 && value === allBoxes[r][c + 1]) {
          return true;
        };
      }
    }
  }

  return false;
}
