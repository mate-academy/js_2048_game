'use strict';

// const start = document.querySelector('.button');
// const cells = document.querySelectorAll('.field-cell');
// const gameScore = document.querySelector('.game-score');
// const messageStart = document.querySelector('.message-start');

// start.addEventListener('click', startingNewGame);

// function startingNewGame(cells) {
//   cells.forEach(cell => cell.textContent = '1');
//   gameScore.textContent = '10';
//   messageStart.classList.add('hidden');
// }

class Game {
  constructor() {
    this.score = 0;
    this.state = 'start';

    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  cellsValues() {
    return this.field.reduce((prev, curr) => prev.concat(curr), []);
  }

  startingNewGame() {
    this.state = 'started';

    const initialCellNumber = 2;

    for (let i = 0; i < initialCellNumber; i++) {
      const [row, col] = this.randomEmptyCell();

      this.field[row][col] = 2;
    }
  }

  randomEmptyCell() {
    const emptyCells = [];

    this.field.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
      if (!cell) {
        emptyCells.push([rowIndex, columnIndex]);
      }
    }));

    if (!emptyCells.length) {
      throw new Error('no empty cells');
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  moveLeft() {
    this.collapseCells('left');

    this.field.forEach(row => {
      let emptyCell = row.findIndex(el => el === 0);

      if (emptyCell < 0) {
        return;
      }

      for (let i = emptyCell + 1; i < row.length; i++) {
        if (!row[i]) {
          continue;
        }

        row[emptyCell] = row[i];
        row[i] = 0;
        emptyCell++;
      }
    });
  }

  collapseCells(direction) {
    switch (direction) {
      case 'left':
        this.field.forEach(row => {
          let index = row.findIndex(el => el !== 0);

          if (index === -1) {
            return;
          }

          for (let i = index + 1; i < this.field.length; i++) {
            if (!row[i]) {
              continue;
            }

            if (row[i] === row[index]) {
              row[index] *= 2;
              row[i] = 0;
              index = row.findIndex((el, j) => el !== 0 && j > i);
              i = index;
            }
          }
        });
    }
  }
}

module.exports = Game;
