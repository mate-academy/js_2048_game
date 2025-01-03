'use strict';

class Game {
  static InitialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  static InitialStatus = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(initialState = Game.InitialState) {
    this.score = 0;
    this.status = Game.InitialStatus.idle;
    this.state = initialState.map((item) => [...item]);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    const noEmptyArray = [[], [], [], []];
    const noEmptyArrayMarges = [[], [], [], []];

    for (let i = 0; i < 4; i++) {
      noEmptyArray[i] = this.state[i].filter((cell) => cell !== 0);
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < noEmptyArray[i].length; j++) {
        if (noEmptyArray[i][j] === noEmptyArray[i][j + 1]) {
          this.score += noEmptyArray[i][j];
          noEmptyArray[i][j] = noEmptyArray[i][j] * 2;
          noEmptyArray[i][j + 1] = 0;
          j++;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      noEmptyArrayMarges[i] = noEmptyArray[i].filter((cell) => cell !== 0);
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (noEmptyArrayMarges[i][j] > 0) {
          this.state[i][j] = noEmptyArrayMarges[i][j];
        } else if (!noEmptyArrayMarges[i][j]) {
          this.state[i][j] = 0;
        }
      }
    }

    this.boards();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    const noEmptyArray = [[], [], [], []];
    const noEmptyArrayMarges = [[], [], [], []];

    for (let i = 0; i < 4; i++) {
      noEmptyArray[i] = this.state[i].filter((cell) => cell !== 0);
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < noEmptyArray[i].length; j++) {
        if (noEmptyArray[i][j] === noEmptyArray[i][j + 1]) {
          this.score += noEmptyArray[i][j];
          noEmptyArray[i][j] = noEmptyArray[i][j] * 2;
          noEmptyArray[i][j + 1] = 0;
          j++;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      noEmptyArrayMarges[i] = noEmptyArray[i].filter((cell) => cell !== 0);
    }

    for (let i = 0; i < 4; i++) {
      let countLeft = 0;
      let countRight = 3;

      for (let j = 3; j >= 0; j--) {
        if (noEmptyArrayMarges[i][j] && noEmptyArrayMarges[i][j] > 0) {
          this.state[i][countRight] = noEmptyArrayMarges[i][j];
          countRight--;
        } else if (!noEmptyArrayMarges[i][j]) {
          this.state[i][countLeft] = 0;
          countLeft++;
        }
      }
    }

    this.boards();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    const transformArray = [[], [], [], []];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        transformArray[j][i] = this.state[i][j];
      }
    }

    const noEmptyArray = [[], [], [], []];
    const noEmptyArrayMarges = [[], [], [], []];

    for (let i = 0; i < 4; i++) {
      noEmptyArray[i] = transformArray[i].filter((cell) => cell !== 0);
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < noEmptyArray[i].length; j++) {
        if (noEmptyArray[i][j] === noEmptyArray[i][j + 1]) {
          this.score += noEmptyArray[i][j];
          noEmptyArray[i][j] = noEmptyArray[i][j] * 2;
          noEmptyArray[i][j + 1] = 0;
          j++;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      noEmptyArrayMarges[i] = noEmptyArray[i].filter((cell) => cell !== 0);
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (noEmptyArrayMarges[i][j] > 0) {
          transformArray[i][j] = noEmptyArrayMarges[i][j];
        } else if (!noEmptyArrayMarges[i][j]) {
          transformArray[i][j] = 0;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.state[i][j] = transformArray[j][i];
      }
    }

    this.boards();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    const transformArray = [[], [], [], []];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        transformArray[j][i] = this.state[i][j];
      }
    }

    const noEmptyArray = [[], [], [], []];
    const noEmptyArrayMarges = [[], [], [], []];

    for (let i = 0; i < 4; i++) {
      noEmptyArray[i] = transformArray[i].filter((cell) => cell !== 0);
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < noEmptyArray[i].length; j++) {
        if (noEmptyArray[i][j] === noEmptyArray[i][j + 1]) {
          this.score += noEmptyArray[i][j];
          noEmptyArray[i][j] = noEmptyArray[i][j] * 2;
          noEmptyArray[i][j + 1] = 0;
          j++;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      noEmptyArrayMarges[i] = noEmptyArray[i].filter((cell) => cell !== 0);
    }

    for (let i = 0; i < 4; i++) {
      let countLeft = 0;
      let countRight = 3;

      for (let j = 3; j >= 0; j--) {
        if (noEmptyArrayMarges[i][j] && noEmptyArrayMarges[i][j] > 0) {
          transformArray[i][countRight] = noEmptyArrayMarges[i][j];
          countRight--;
        } else if (!noEmptyArrayMarges[i][j]) {
          transformArray[i][countLeft] = 0;
          countLeft++;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.state[i][j] = transformArray[j][i];
      }
    }

    this.boards();
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    const win = document.querySelector('.message-win');
    const lose = document.querySelector('.message-lose');

    if (this.status === 'win') {
      win.classList.remove('hidden');
    } else if (this.status === 'lose') {
      lose.classList.remove('hidden');
    } else if (this.status === 'playing') {
      win.classList.add('hidden');
      lose.classList.add('hidden');
    }
  }

  getState() {
    document.querySelectorAll('.field-cell').forEach((cell, index) => {
      cell.classList.remove(`field-cell--${cell.textContent}`);

      cell.textContent =
        this.state.flat()[index] === 0 ? '' : this.state.flat()[index];

      cell.classList.add(`field-cell--${cell.textContent}`);
    });

    if (!this.state.flat().includes(0)) {
      this.status = Game.InitialStatus.lose;
    } else if (this.state.flat().includes(2048)) {
      this.status = Game.InitialStatus.win;
    }
  }

  start() {
    this.state = Game.InitialState.map((item) => [...item]);
    this.score = 0;
    this.randomCells();
    this.randomCells();
    this.status = Game.InitialStatus.playing;

    return this.status;
  }

  restart() {
    this.score = 0;
    this.state = Game.InitialState.map((item) => [...item]);
    this.getState();
  }
  randomCells() {
    const empty = [];

    this.state.map((row, indexRow) => {
      row.map((cell, indexCell) => {
        if (cell === 0) {
          empty.push({
            indexRow,
            indexCell,
          });
        }
      });
    });

    const randomCell = Math.round(Math.random() * (empty.length - 1));

    this.state[empty[randomCell].indexRow][empty[randomCell].indexCell] =
      Math.random() < 0.9 ? 2 : 4;
  }

  boards() {
    const board = [];

    document.querySelectorAll('.field-cell').forEach((cell, index) => {
      board[index] = cell.textContent === '' ? 0 : cell.textContent;
    });

    if (this.state.flat().toString() !== board.toString()) {
      this.randomCells();
    }
  }
}

module.exports = Game;
