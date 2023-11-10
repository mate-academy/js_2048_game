'use strict';

const button = document.querySelector('.button');
const cell = document.querySelectorAll('.field-cell');
const startMessage = document.querySelector('.message-start');
const winText = document.querySelector('.message-win');
const loseText = document.querySelector('.message-lose');
const scorePlace = document.querySelector('.game-score');
let gameOver = false;

let score = 0;

const matrix = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function makeMatrix() {
  for (let indexRow = 0; indexRow < matrix.length; indexRow++) {
    for (let indexCell = 0; indexCell < matrix[indexRow].length; indexCell++) {
      const indexOf = (indexRow * 4) + indexCell;

      cell[indexOf].className = 'field-cell';
      cell[indexOf].textContent = '';

      if (matrix[indexRow][indexCell] !== 0) {
        cell[indexOf].classList.add(
          `field-cell--${matrix[indexRow][indexCell]}`,
        );
        cell[indexOf].textContent = `${matrix[indexRow][indexCell]}`;
      } else {
        cell[indexOf].className = 'field-cell';
        cell[indexOf].textContent = '';
      }
    }
  }
}

function clearMatrix() {
  for (let indexRow = 0; indexRow < matrix.length; indexRow++) {
    for (let indexCell = 0; indexCell < matrix[indexRow].length; indexCell++) {
      const indexOf = (indexRow * 4) + indexCell;

      cell[indexOf].className = 'field-cell';
      cell[indexOf].textContent = '';
      matrix[indexRow][indexCell] = 0;
    }
  }
}

function makeOneRandomCell() {
  const maxRowIndex = matrix.length;
  const maxColumnIndex = matrix[0].length;
  let numOfNewCell = 0;

  while (numOfNewCell < 1) {
    const randomRowCell = Math.floor(Math.random() * maxRowIndex);
    const randomColumnCell = Math.floor(Math.random() * maxColumnIndex);
    const numToInput = getRandomTwoOrFour();

    if (matrix[randomRowCell][randomColumnCell] !== 0) {
      continue;
    } else {
      matrix[randomRowCell][randomColumnCell] = numToInput;
      numOfNewCell++;
    }
  }
}

function makeStartPairOfCell() {
  const maxRowIndex = matrix.length;
  const maxColumnIndex = matrix[0].length;

  let numOfNewCell = 0;

  while (numOfNewCell < 2) {
    const randomRowCell = Math.floor(Math.random() * maxRowIndex);
    const randomColumnCell = Math.floor(Math.random() * maxColumnIndex);
    const numToInput = getRandomTwoOrFour();

    if (matrix[randomRowCell][randomColumnCell] !== 0) {
      continue;
    } else {
      matrix[randomRowCell][randomColumnCell] = numToInput;
      numOfNewCell++;
    }
  }
}

function getRandomTwoOrFour() {
  const randomValue = Math.random();

  if (randomValue < 0.9) {
    return 2;
  } else {
    return 4;
  }
}

function moveCells(turn) {
  switch (turn) {
    case 'Up':
      moveUp();
      break;

    case 'Down':
      moveDown();
      break;

    case 'Right':
      moveRight();
      break;

    case 'Left':
      moveLeft();
      break;
  }
}

function moveDown() {
  for (let indexRow = 0; indexRow < matrix.length; indexRow++) {
    for (let indexColumn = matrix[0].length - 1;
      indexColumn >= 0; indexColumn--) {
      if (matrix[indexColumn][indexRow] !== 0
        && indexColumn !== matrix[0].length - 1
        && matrix[indexColumn + 1][indexRow] === 0) {
        matrix[indexColumn + 1][indexRow] = matrix[indexColumn][indexRow];
        matrix[indexColumn][indexRow] = 0;
        indexColumn += 2;
      } else if (indexColumn < matrix[0].length - 1
        && matrix[indexColumn][indexRow] === matrix[indexColumn + 1][indexRow]
        && matrix[indexColumn][indexRow] !== 0) {
        matrix[indexColumn + 1][indexRow] *= 2;
        matrix[indexColumn][indexRow] = 0;

        score += matrix[indexColumn + 1][indexRow];
      }
    }
  }
}

function moveUp() {
  for (let indexColumn = 0; indexColumn < matrix.length; indexColumn++) {
    for (let indexRow = 0; indexRow < matrix[0].length; indexRow++) {
      if (matrix[indexRow][indexColumn]
        !== 0 && indexRow
        !== 0 && matrix[indexRow - 1][indexColumn] === 0) {
        matrix[indexRow - 1][indexColumn] = matrix[indexRow][indexColumn];
        matrix[indexRow][indexColumn] = 0;
        indexRow -= 2;
      } else if (indexRow > 0
        && matrix[indexRow][indexColumn] === matrix[indexRow - 1][indexColumn]
        && matrix[indexRow][indexColumn] !== 0) {
        matrix[indexRow - 1][indexColumn] *= 2;
        matrix[indexRow][indexColumn] = 0;

        score += matrix[indexRow - 1][indexColumn];
      }
    }
  }
}

function moveLeft() {
  for (let indexRow = 0; indexRow < matrix.length; indexRow++) {
    for (let indexColumn = 0; indexColumn < matrix[0].length; indexColumn++) {
      if (matrix[indexRow][indexColumn]
        !== 0 && indexColumn
        !== 0 && matrix[indexRow][indexColumn - 1] === 0) {
        matrix[indexRow][indexColumn - 1] = matrix[indexRow][indexColumn];
        matrix[indexRow][indexColumn] = 0;
        indexColumn -= 2;
      } else if (indexColumn > 0
        && matrix[indexRow][indexColumn] === matrix[indexRow][indexColumn - 1]
        && matrix[indexRow][indexColumn] !== 0) {
        matrix[indexRow][indexColumn - 1] *= 2;
        matrix[indexRow][indexColumn] = 0;

        score += matrix[indexRow][indexColumn - 1];
      }
    }
  }
}

function moveRight() {
  for (let indexRow = 0; indexRow < matrix[0].length; indexRow++) {
    for (let indexColumn = matrix.length - 1; indexColumn >= 0; indexColumn--) {
      if (matrix[indexRow][indexColumn] !== 0
        && indexColumn !== matrix.length - 1
        && matrix[indexRow][indexColumn + 1] === 0) {
        matrix[indexRow][indexColumn + 1] = matrix[indexRow][indexColumn];
        matrix[indexRow][indexColumn] = 0;
        indexColumn += 2;
      } else if (matrix[indexRow][indexColumn]
        === matrix[indexRow][indexColumn + 1]
        && matrix[indexRow][indexColumn] !== 0) {
        matrix[indexRow][indexColumn + 1] *= 2;
        matrix[indexRow][indexColumn] = 0;

        score += matrix[indexRow][indexColumn + 1];
      }
    }
  }
}

button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    button.textContent = 'Restart';
    startMessage.classList.add('hidden');
    button.classList.add('restart');
    makeStartPairOfCell();
    makeMatrix(matrix);
  } else {
    loseText.classList.add('hidden');
    clearMatrix();
    makeStartPairOfCell();
    makeMatrix(matrix);
  }
});

document.addEventListener('keydown', (press) => {
  press.preventDefault();
  // вгору

  if (gameOver) {
    loseText.classList.remove('hidden');

    return;
  }

  if (press.keyCode === 38) {
    const turn = 'Up';

    moveCells(turn);

    const indicator = ifCellsNotEmpty();

    if (indicator === 16) {
      gameOportunity();
    }

    checkWin();
    scorePlace.textContent = `${score}`;
    makeOneRandomCell();
    makeMatrix();
  }

  // вниз
  if (press.keyCode === 40) {
    const turn = 'Down';

    moveCells(turn);

    const indicator = ifCellsNotEmpty();

    if (indicator === 16) {
      gameOportunity();
    }

    checkWin();
    scorePlace.textContent = `${score}`;
    makeOneRandomCell();
    makeMatrix();
  }

  //  вправо
  if (press.keyCode === 39) {
    const turn = 'Right';

    moveCells(turn);

    const indicator = ifCellsNotEmpty();

    if (indicator === 16) {
      gameOportunity();
    }

    checkWin();
    scorePlace.textContent = `${score}`;
    makeOneRandomCell();
    makeMatrix();
  }

  //  вліво
  if (press.keyCode === 37) {
    const turn = 'Left';

    moveCells(turn);

    const indicator = ifCellsNotEmpty();

    if (indicator === 16) {
      gameOportunity();
    }

    checkWin();
    scorePlace.textContent = `${score}`;
    makeOneRandomCell();
    makeMatrix();
  }
});

function checkWin() {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === 2048) {
        winText.classList.remove('hidden');
        gameOver = true;
        break;
      }
    }
  }
}

function gameOportunity() {
  for (let indexRow = 0; indexRow < matrix.length; indexRow++) {
    for (let indexColumn = 0; indexColumn < matrix.length; indexColumn++) {
      const currentCell = matrix[indexRow][indexColumn];
      const lastRow = matrix.length - 1;
      const lastColumn = matrix.length - 1;

      if (indexRow === lastRow) {
        if (currentCell === matrix[indexRow - 1][indexColumn]
          || currentCell === matrix[indexRow][indexColumn - 1]) {
          gameOver = false;
        }
      }

      if (indexColumn === lastColumn) {
        if (currentCell === matrix[indexRow][indexColumn - 1]
          || currentCell === matrix[indexRow - 1][indexColumn]) {
          gameOver = false;
        }
      }

      if (currentCell === 0
        || currentCell === matrix[indexRow][indexColumn + 1]
        || currentCell === matrix[indexRow + 1][indexColumn]
      ) {
        gameOver = false;
      } else {
        gameOver = true;
        break;
      }
    }
  }
}

function ifCellsNotEmpty() {
  let cellsPoints = 0;

  for (let indexRow = 0; indexRow < matrix.length; indexRow++) {
    for (let indexColumn = 0; indexColumn < matrix.length; indexColumn++) {
      if (matrix[indexRow][indexColumn] !== 0) {
        cellsPoints += 1;
      }
    }
  }

  return cellsPoints;
}
