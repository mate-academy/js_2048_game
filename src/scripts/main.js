'use strict';

const root = document.querySelector('body');
const actionButton = root.querySelector('.button');
const gameScore = root.querySelector('.game-score');
const loseMessage = root.querySelector('.message-lose');
const winMessage = root.querySelector('.message-win');
const startMessage = root.querySelector('.message-start');
const MULTIPLIER = 2;

class Game {
  constructor() {
    this.matrix = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.isStarted = false;
    this.score = 0;
  }

  startApp() {
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

  calculateMove(direction) {
    const valuesBeforeMove = this.getMatrixValues();
    const useMatrix = this.getMatrixCopy(this.matrix);
    let changesMade = false;

    switch (direction) {
      case 'LEFT':
        this.manipulateMatrixCells(useMatrix);
        break;
      case 'RIGHT':
        this.rotateMatrix(useMatrix, 2);
        this.manipulateMatrixCells(useMatrix);
        this.rotateMatrix(useMatrix, 2);
        break;
      case 'UP':
        this.rotateMatrix(useMatrix, 3);
        this.manipulateMatrixCells(useMatrix);
        this.rotateMatrix(useMatrix, 1);
        break;
      case 'DOWN':
        this.rotateMatrix(useMatrix, 1);
        this.manipulateMatrixCells(useMatrix);
        this.rotateMatrix(useMatrix, 3);
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

  manipulateMatrixCells(useMatrix) {
    for (let i = 0; i < useMatrix.length; i++) {
      this.moveCells(useMatrix[i]);
      this.mergeCells(useMatrix[i]);
      this.moveCells(useMatrix[i]);
    }
  };

  rotateMatrix(useMatrix, numberOfTimes = 1) {
    // This function rotates matrix clockwise
    for (let rotations = 0; rotations < numberOfTimes; rotations++) {
      const initialMatrix = this.getMatrixCopy(useMatrix);

      for (let i = 0; i < initialMatrix.length; i++) {
        for (let j = 0; j < initialMatrix.length; j++) {
          const k = initialMatrix.length - 1 - i;

          useMatrix[j][k] = initialMatrix[i][j];
        }
      }
    }
  };

  getMatrixCopy(useMatrix) {
    return useMatrix.map(row => {
      return [...row];
    });
  };

  moveCells(row) {
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

  mergeCells(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1] && row[i] !== 0) {
        row[i] *= MULTIPLIER;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }
  };

  handleStart() {
    this.setCellValue(this.getRandomCellCoords(), this.getRandomCellValue());
    this.setCellValue(this.getRandomCellCoords(), this.getRandomCellValue());

    this.render();
  };

  handleRestart() {
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

  setCellValue(coords, value) {
    const [i, j] = coords;

    this.matrix[i][j] = value;
  };

  getRandomCellCoords() {
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

  getMatrixValues() {
    const values = [];

    this.matrix.forEach(row => {
      row.forEach(value => {
        values.push(value);
      });
    });

    return values;
  };

  getRandomCellValue() {
    const FIRST_VALUE = 2;
    const SECOND_VALUE = 4;
    const SECOND_VALUE_PROBABILITY = 0.1;

    return Math.random() > SECOND_VALUE_PROBABILITY
      ? FIRST_VALUE
      : SECOND_VALUE;
  };

  render() {
    this.renderCells();
    this.renderScore();
    this.renderActionButton();
    this.renderMessages();
  };

  renderCells() {
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

  renderScore() {
    gameScore.innerText = this.score;
  };

  renderActionButton() {
    actionButton.classList.toggle('start', !this.isStarted);
    actionButton.classList.toggle('restart', this.isStarted);
    actionButton.innerText = this.isStarted ? 'Restart' : 'Start';
  };

  renderMessages() {
    startMessage.classList.toggle('hidden', this.isStarted);
    winMessage.classList.toggle('hidden', !this.didWin());
    loseMessage.classList.toggle('hidden', !this.didLose());
  };

  didWin() {
    return this.getMatrixValues().includes(2048);
  };

  didLose() {
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
};

const game = new Game();

game.startApp();
