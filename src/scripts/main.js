'use strict';

// write your code here

const field = document.querySelector('.game-field').tBodies[0];
const scoreField = document.querySelector('.controls .game-score');
const buttonStart = document.querySelector('button.start');

class Game {
  static randomWithProbability() {
    const numberForRandom = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
    const index = Math.floor(Math.random() * 10);

    return numberForRandom[index];
  }

  static insertRandomNumber() {
    this.findEmptyCells();

    const randomCellIndex = Math.floor(Math.random() * this.emptyCells.length);

    if (this.emptyCells.length === 0) {
      return;
    }

    const row = this.emptyCells[randomCellIndex].row;
    const index = this.emptyCells[randomCellIndex].index;

    this.valuesArray[row][index] = this.randomWithProbability();
  }

  static findEmptyCells() {
    this.emptyCells = [];

    this.valuesArray.forEach((item, index, array) => {
      item.forEach((item2, index2, array2) => {
        if (item2 === 0) {
          const emptyCell = {
            row: index,
            index: index2,
          };

          this.emptyCells.push(emptyCell);
        }
      });
    });
  }

  static findFilledCells() {
    this.filledCells = [];

    this.valuesArray.forEach((item, index, array) => {
      item.forEach((item2, index2, array2) => {
        if (item2 !== 0) {
          const filledCell = {
            row: index,
            index: index2,
          };

          this.filledCells.push(filledCell);
        }
      });
    });
  }

  static renderGameField(gameField) {
    this.valuesArray.forEach((item, index, array) => {
      item.forEach((item2, index2, array2) => {
        gameField.rows[index].cells[index2].innerText
        = (item2 === 0) ? '' : `${item2}`;
        gameField.rows[index].cells[index2].className = '';
        gameField.rows[index].cells[index2].classList.add('field-cell');

        if (item2 !== 0) {
          gameField.rows[index].cells[index2].classList
            .add(`field-cell--${item2}`);
        };
      });
    });
  }

  static rotateRight90deg() {
    this.valuesArray = this.valuesArray[0].map(
      (val, index) => this.valuesArray.map(row => row[index]).reverse()
    );
  };

  static moveUp() {
    this.findFilledCells();

    this.filledCells.forEach((fCell) => {
      this.findEmptyCells();

      const availableCellCoords = this.emptyCells.find(
        (eCell) => eCell.row < fCell.row && eCell.index === fCell.index
      );

      if (availableCellCoords) {
        this.valuesArray[availableCellCoords.row][availableCellCoords.index]
        = this.valuesArray[fCell.row][fCell.index];
        this.valuesArray[fCell.row][fCell.index] = 0;

        this.mergeDuplicatedCells(
          availableCellCoords.row, availableCellCoords.index
        );
      } else {
        this.mergeDuplicatedCells(fCell.row, fCell.index);
      }
    });
    this.insertRandomNumber();
  }

  static mergeDuplicatedCells(row, cell) {
    if (row > 0) {
      if (this.valuesArray[row][cell] === this.valuesArray[row - 1][cell]) {
        this.valuesArray[row - 1][cell] *= 2;
        this.valuesArray[row][cell] = 0;
        this.score += this.valuesArray[row - 1][cell];

        if (this.valuesArray[row - 1][cell] === 2048) {
          this.showWinMessage = true;
        }
      }
    }
  }

  static checkAvailableMoves() {
    for (let i = 0; i <= this.valuesArray.length - 1; i++) {
      for (let j = 0; j <= this.valuesArray[0].length - 1; j++) {
        if (this.valuesArray[i + 1] === undefined) {
          if (this.valuesArray[i][j] === this.valuesArray[i][j + 1]) {
            return true;
          }
        } else {
          if (this.valuesArray[i][j] === this.valuesArray[i][j + 1]
            || this.valuesArray[i][j] === this.valuesArray[i + 1][j]
          ) {
            return true;
          }
        }
      }
    }

    return false;
  };
}

Game.emptyCells = [];
Game.filledCells = [];

Game.valuesArray = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
Game.showWinMessage = false;
Game.score = 0;

buttonStart.onclick = function() {
  Game.insertRandomNumber();
  document.querySelector('.message-start').classList.add('hidden');
  buttonStart.classList.remove('start');
  buttonStart.classList.add('restart');
  buttonStart.innerText = 'Restart';
  Game.renderGameField(field);

  buttonStart.onclick = function() {
    Game.score = 0;
    scoreField.innerText = Game.score;

    Game.valuesArray = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    Game.showWinMessage = false;
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
    Game.insertRandomNumber();
    Game.renderGameField(field);
  };
};

document.addEventListener('keydown', (e) => {
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    return;
  }

  switch (e.code) {
    case 'ArrowUp':
      Game.moveUp();
      Game.renderGameField(field);
      break;

    case 'ArrowDown':
      Game.rotateRight90deg();
      Game.rotateRight90deg();
      Game.moveUp();
      Game.rotateRight90deg();
      Game.rotateRight90deg();
      Game.renderGameField(field);
      break;

    case 'ArrowLeft':
      Game.rotateRight90deg();
      Game.moveUp();
      Game.rotateRight90deg();
      Game.rotateRight90deg();
      Game.rotateRight90deg();
      Game.renderGameField(field);
      break;

    case 'ArrowRight':
      Game.rotateRight90deg();
      Game.rotateRight90deg();
      Game.rotateRight90deg();
      Game.moveUp();
      Game.rotateRight90deg();
      Game.renderGameField(field);
      break;
  }
  Game.findEmptyCells();

  if (!Game.checkAvailableMoves() && Game.emptyCells.length === 0) {
    document.querySelector('.message-lose').classList.remove('hidden');
  };

  if (Game.showWinMessage) {
    document.querySelector('.message-win').classList.remove('hidden');
  };

  scoreField.innerText = Game.score;

  e.preventDefault();
});
