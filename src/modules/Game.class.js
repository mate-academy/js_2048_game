import { GAME_STATUS } from '../constants';

export default class Game {
  constructor() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = GAME_STATUS.IDLE;
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
  }

  move(direction) {
    const newState = this.processDirection(direction);

    if (!this.arraysEqual(this.state, newState)) {
      this.state = newState;
      this.addNewTile();
      this.updateGameStatus();
    }
  }

  processDirection(direction) {
    switch (direction) {
      case 'left':
        return this.state.map((row) => this.processRow(row));

      case 'right':
        return this.state.map((row) => {
          return this.processRow(row.reverse()).reverse();
        });

      case 'up':
        return this.transpose(
          this.transpose(this.state).map((row) => this.processRow(row)),
        );

      case 'down':
        return this.transpose(
          this.transpose(this.state).map((row) => {
            return this.processRow(row.reverse()).reverse();
          }),
        );

      default:
        return this.state;
    }
  }

  processRow(row) {
    const filtered = row.filter((cell) => cell !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered.splice(i + 1, 1);
      }
    }

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  transpose(matrix) {
    return matrix[0].map((_, col) => matrix.map((row) => row[col]));
  }

  arraysEqual(a, b) {
    return a.every((row, i) => row.every((cell, j) => cell === b[i][j]));
  }

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
    this.status = GAME_STATUS.PLAYING;

    this.addNewTile();
    this.addNewTile();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = GAME_STATUS.IDLE;
  }

  addNewTile() {
    const emptyCells = [];

    this.state.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) {
          emptyCells.push({ i, j });
        }
      });
    });

    if (emptyCells.length) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { i, j } = emptyCells[randomIndex];

      this.state[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  updateGameStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = GAME_STATUS.WIN;

      return;
    }

    if (!this.canMove()) {
      this.status = GAME_STATUS.LOSE;
    }
  }

  canMove() {
    if (this.state.some((row) => row.includes(0))) {
      return true;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.state[i][j];

        if (
          (j < 3 && current === this.state[i][j + 1]) ||
          (i < 3 && current === this.state[i + 1][j])
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
