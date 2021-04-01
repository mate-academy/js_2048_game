'use strict';

const root = document.querySelector('body');
const actionButton = root.querySelector('.button');
const gameScore = root.querySelector('.game-score');
const loseMessage = root.querySelector('.message-lose');
const winMessage = root.querySelector('.message-win');
const startMessage = root.querySelector('.message-start');
const MULTIPLIER = 2;

class Game {
};

Game.matrix = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
Game.isStarted = false;
Game.score = 0;

Game.startApp = function() {
  actionButton.addEventListener('click', () => {
    this.isStarted = !this.isStarted;

    if (this.isStarted) {
      this.handleStart();
    } else {
      this.handleRestart();
    }
  });

  root.addEventListener('keydown', (e) => {
    const useKeys = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
    ];

    if (!useKeys.includes(e.key) || !this.isStarted) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        this.calculateMove('DOWN');
        break;
      case 'ArrowUp':
        this.calculateMove('UP');
        break;
      case 'ArrowRight':
        this.calculateMove('RIGHT');
        break;
      case 'ArrowLeft':
        this.calculateMove('LEFT');
        break;
    }

    this.render();
  });
};

Game.calculateMove = function(direction) {
  const valuesBeforeMove = this.getMatrixValues();
  const useMatrix = this.getMatrixCopy(this.matrix);
  let changesMade = false;

  switch (direction) {
    case 'LEFT':
      this.manipulateMatrixCells(useMatrix);
      break;
    case 'RIGHT':
      this.flipMatrix(useMatrix);
      this.manipulateMatrixCells(useMatrix);
      this.flipMatrix(useMatrix);
      break;
    case 'UP':
      this.rotateMatrix(useMatrix, false);
      this.manipulateMatrixCells(useMatrix);
      this.rotateMatrix(useMatrix);
      break;
    case 'DOWN':
      this.rotateMatrix(useMatrix);
      this.manipulateMatrixCells(useMatrix);
      this.rotateMatrix(useMatrix, false);
      break;
  }

  this.matrix = useMatrix;

  const valuesAfterMove = this.getMatrixValues();

  valuesBeforeMove.forEach((valueBeforeMove, i) => {
    if (valueBeforeMove !== valuesAfterMove[i]) {
      changesMade = true;
    }
  });

  if (changesMade) {
    this.setCellValue(this.getRandomCellCoords(), this.getRandomCellValue());
  }
};

Game.manipulateMatrixCells = function(useMatrix) {
  for (let i = 0; i < useMatrix.length; i++) {
    this.moveCells(useMatrix[i]);
    this.mergeCells(useMatrix[i]);
    this.moveCells(useMatrix[i]);
  }
};

Game.flipMatrix = function(useMatrix) {
  const initialMatrix = this.getMatrixCopy(useMatrix);

  for (let i = 0; i < initialMatrix.length; i++) {
    for (let j = initialMatrix[i].length - 1; j >= 0; j--) {
      const k = initialMatrix[i].length - 1 - j;

      useMatrix[i][k] = initialMatrix[i][j];
    }
  }
};

Game.rotateMatrix = function(useMatrix, clockwise = true) {
  const initialMatrix = this.getMatrixCopy(useMatrix);

  for (let i = 0; i < initialMatrix.length; i++) {
    for (let j = 0; j < initialMatrix.length; j++) {
      if (clockwise) {
        const k = initialMatrix.length - 1 - i;

        useMatrix[j][k] = initialMatrix[i][j];
      } else {
        const k = initialMatrix.length - 1 - j;

        useMatrix[k][i] = initialMatrix[i][j];
      }
    }
  }
};

Game.getMatrixCopy = function(useMatrix) {
  return useMatrix.map(row => {
    return [...row];
  });
};

Game.moveCells = function(row) {
  let madeMoves = true;

  while (madeMoves) {
    let movesCounter = 0;

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === 0 && row[i + 1] !== 0) {
        row[i] = row[i + 1];
        row[i + 1] = 0;
        movesCounter++;
      }
    }

    madeMoves = movesCounter > 0;
  }
};

Game.mergeCells = function(row) {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1] && row[i] !== 0) {
      row[i] *= MULTIPLIER;
      row[i + 1] = 0;
      this.score += row[i];
    }
  }
};

Game.handleStart = function() {
  this.setCellValue(this.getRandomCellCoords(), this.getRandomCellValue());
  this.setCellValue(this.getRandomCellCoords(), this.getRandomCellValue());

  this.render();
};

Game.handleRestart = function() {
  this.matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  this.score = 0;
  winMessage.classList.toggle('hidden', true);
  loseMessage.classList.toggle('hidden', true);
  this.render();
};

Game.setCellValue = function(coords, value) {
  const [i, j] = coords;

  this.matrix[i][j] = value;
};

Game.getRandomCellCoords = function() {
  const availableCells = [];

  this.matrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) {
        availableCells.push([i, j]);
      }
    });
  });

  const randomCellNumber = Math.floor(Math.random() * availableCells.length);

  return availableCells[randomCellNumber];
};

Game.getMatrixValues = function() {
  const values = [];

  this.matrix.forEach(row => {
    row.forEach(value => {
      values.push(value);
    });
  });

  return values;
};

Game.getRandomCellValue = function() {
  const FIRST_VALUE = 2;
  const SECOND_VALUE = 4;
  const SECOND_VALUE_PROBABILITY = 0.1;

  return Math.random() > SECOND_VALUE_PROBABILITY ? FIRST_VALUE : SECOND_VALUE;
};

Game.render = function() {
  this.renderCells();
  this.renderScore();
  this.renderActionButton();
  this.renderMessages();
};

Game.renderCells = function() {
  const cells = root.querySelectorAll('.field-cell');
  const matrixValues = this.getMatrixValues();

  cells.forEach((cell, i) => {
    const value = matrixValues[i];

    if (value !== 0) {
      const useClass = `field-cell--${value}`;

      cell.innerText = value;

      if (cell.classList.length > 1) {
        cell.classList.replace(cell.classList[1], useClass);
      } else {
        cell.classList.add(useClass);
      }
    } else {
      cell.classList.remove(cell.classList[1]);
      cell.innerText = '';
    }
  });
};

Game.renderScore = function() {
  gameScore.innerText = this.score;
};

Game.renderActionButton = function() {
  actionButton.classList.toggle('start', !this.isStarted);
  actionButton.classList.toggle('restart', this.isStarted);
  actionButton.innerText = this.isStarted ? 'Restart' : 'Start';
};

Game.renderMessages = function() {
  startMessage.classList.toggle('hidden', this.isStarted);
  winMessage.classList.toggle('hidden', !this.didWin());
  loseMessage.classList.toggle('hidden', !this.didLose());
};

Game.didWin = function() {
  return this.getMatrixValues().includes(2048);
};

Game.didLose = function() {
  const values = this.getMatrixValues();
  const testMatrixes = [
    this.getMatrixCopy(this.matrix),
    this.getMatrixCopy(this.matrix),
  ];

  this.rotateMatrix(testMatrixes[1]);

  if (values.includes(0)) {
    return false;
  }

  for (const testMatrix of testMatrixes) {
    for (let i = 0; i < testMatrix.length; i++) {
      for (let j = 0; j < testMatrix[i].length - 1; j++) {
        if (testMatrix[i][j] === testMatrix[i][j + 1]) {
          return false;
        }
      }
    }
  }

  return true;
};

Game.startApp();
