'use strict';

class Game {
  static initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  static status = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(initialState = Game.initialState) {
    this.state = JSON.parse(JSON.stringify(initialState));
    this.status = Game.status.idle;
    this.score = 0;
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    const getRandomN = () => Math.floor(Math.random() * 16) + 1;

    const getRandomCell = (n) => {
      const row = Math.ceil(n / 4) - 1;
      const cell = n % 4 === 0 ? 3 : (n % 4) - 1;

      return [row, cell];
    };

    const getRandomCells = () => {
      const n1 = getRandomN();
      let n2;

      do {
        n2 = getRandomN();
      } while (n1 === n2);

      return [getRandomCell(n1), getRandomCell(n2)];
    };

    const cells = getRandomCells();

    this.status = Game.status.playing;

    cells.forEach(
      ([row, cell]) => (this.state[row][cell] = Math.random() < 0.9 ? 2 : 4),
    );
  }

  restart() {
    this.status = Game.status.idle;
    this.state = JSON.parse(JSON.stringify(Game.initialState));
    this.score = 0;
  }

  // Add your own methods here
}

module.exports = Game;
