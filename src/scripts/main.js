'use strict';

const body = document.querySelector('body');
const rows = document.querySelectorAll('.field-row');
const scoreElement = document.querySelector('.game-score');
const buttonElement = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const game = {
  win: false,
  lose: false,
  process: false,
  firstMove: false,
  isMoved: false,
  freeCells: 16,
  score: 0,
  gameField: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  update() {
    this.gameField.map((row, rowIndex) => {
      row.map((cell, cellIndex) => {
        if (cell !== 0) {
          rows[rowIndex].children[cellIndex].textContent = cell;

          rows[rowIndex].children[cellIndex].className = `field-cell
           field-cell--${cell}`;

          if (cell >= 2048) {
            this.win = true;
          }
        } else {
          rows[rowIndex].children[cellIndex].textContent = '';
          rows[rowIndex].children[cellIndex].className = `field-cell`;
        }
      });

      scoreElement.textContent = this.score;
    });

    if (this.firstMove) {
      buttonElement.classList.remove('start');
      buttonElement.classList.add('restart');
      buttonElement.textContent = 'Restart';
      buttonElement.disabled = false;
      buttonElement.style.opacity = 1;
      this.firstMove = false;
    }

    if (this.win) {
      winMessage.classList.remove('hidden');
    } else {
      winMessage.classList.add('hidden');
    }

    if (this.lose) {
      loseMessage.classList.remove('hidden');
      loseMessage.classList.add('restart');
    } else {
      loseMessage.classList.add('hidden');
      loseMessage.classList.remove('restart');
    }
  },
  getRandomIndex(max) {
    return Math.floor(Math.random() * (max + 1));
  },
  addNumber() {
    const probability = Math.random();
    const emptyCoords = [];
    let newPosition;

    if (this.isMoved) {
      this.gameField.map((row, rowIndex) => {
        row.map((cell, cellIndex) => {
          if (cell === 0) {
            emptyCoords.push([rowIndex, cellIndex]);
          }
        });
      });
  
      this.freeCells = emptyCoords.length - 1;
  
      if (emptyCoords.length > 0) {
        newPosition = emptyCoords[this.getRandomIndex(emptyCoords.length - 1)];
  
        if (probability < 0.1) {
          this.gameField[newPosition[0]][newPosition[1]] = 4;
        } else {
          this.gameField[newPosition[0]][newPosition[1]] = 2;
        }
      }
    } else {
      return
    }
  },
  transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  },
  findPair(matrix) {
    for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
      for (let cellIndex = 0; cellIndex < matrix[0].length; cellIndex++) {
        if (matrix[rowIndex][cellIndex] === matrix[rowIndex][cellIndex - 1]) {
          return true;
        }
      }
    }

    return false;
  },
  losing() {
    if (this.freeCells < 1) {
      if (!this.findPair(this.gameField)
        && !this.findPair(this.transpose(this.gameField))) {
        this.lose = true;
      }
    }
  },
  moveRight() {
    this.isMoved = false;

    this.gameField.map(row => {
      const mergedCells = [false, false, false, false];

      for (let i = row.length - 1; i > 0; i--) {
        row.sort((current, prev) => {
          if ((current - prev) < 0) {
            this.isMoved = true;
          }

          return current - prev;
        });

        if (row[i] === row[i - 1] && !mergedCells[i] && row[i] !== 0) {
          row[i] = row[i - 1] + row[i];
          row[i - 1] = 0;
          mergedCells[i] = true;
          this.score = this.score + row[i];
          this.isMoved = true;
        }
      } 
    });
  },
  moveLeft() {
    this.isMoved = false;

    this.gameField.map(row => {
      const mergedСells = [false, false, false, false];

      for (let i = 1; i < row.length; i++) {
        row.sort((current, prev) => {
          if ((prev - current) < 0) {
            this.isMoved = true;
          }

          return prev - current;
        });

        if (row[i] === row[i - 1] && !mergedСells[i - 1] && row[i] > 0) {
          row[i - 1] = row[i - 1] + row[i];
          row[i] = 0;
          mergedСells[i - 1] = true;
          this.score = this.score + row[i - 1];
          this.isMoved = true;
        }
      }
    });
  },
};

body.addEventListener('click', action => {
  if (!action.target.matches('.start') && !action.target.matches('.restart')) {
    return;
  }

  if (action.target.matches('.start')) {
    startMessage.classList.add('hidden');
    buttonElement.disabled = true;
    buttonElement.style.opacity = 0.5;
    game.process = true;
    game.isMoved = true;
  }

  if (action.target.matches('.restart')) {
    game.win = false;
    game.lose = false;
    buttonElement.disabled = true;
    buttonElement.style.opacity = 0.5;
    game.score = 0;

    game.gameField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  game.addNumber();
  game.addNumber();
  game.update();
});

body.addEventListener('keydown', action => {
  if (action.key !== 'ArrowRight' || !game.process || game.win || game.lose) {
    return;
  }

  game.firstMove = true;
  game.moveRight();
  game.addNumber();
  game.losing();
  game.update();
});

body.addEventListener('keydown', action => {
  if (action.key !== 'ArrowLeft' || !game.process || game.win || game.lose) {
    return;
  }

  game.firstMove = true;
  game.moveLeft();
  game.addNumber();
  game.losing();
  game.update();
});

body.addEventListener('keydown', action => {
  if (action.key !== 'ArrowUp' || !game.process || game.win || game.lose) {
    return;
  }

  game.firstMove = true;
  game.gameField = game.transpose(game.gameField);
  game.moveLeft();
  game.gameField = game.transpose(game.gameField);
  game.addNumber();
  game.losing();
  game.update();
});

body.addEventListener('keydown', action => {
  if (action.key !== 'ArrowDown' || !game.process || game.win || game.lose) {
    return;
  }

  game.firstMove = true;
  game.gameField = game.transpose(game.gameField);
  game.moveRight();
  game.gameField = game.transpose(game.gameField);
  game.addNumber();
  game.losing();
  game.update();
});
