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
    this.field[0][0] = 2;
    this.field[0][1] = 2;
  }
}

module.exports = Game;
