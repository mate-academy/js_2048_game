'use strict';

export default class Game {
  constructor(initialState = null) {
    if (initialState) {
      this.state = initialState;
    } else {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.score = 0;
    this.status = 'idle';
  }

  setStatus(newStatus) {
    this.gameStatus = newStatus;
  }

  getStatus() {
    return this.status;
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  hasChanged(oldState, newState) {
    return JSON.stringify(oldState) !== JSON.stringify(newState);
  }

  moveLeft() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moved = false;
    let scoreIncrease = 0;

    for (let row = 0; row < 4; row++) {
      const cells = this.state[row].filter((cell) => cell !== 0);

      for (let i = 0; i < cells.length - 1; i++) {
        if (cells[i] === cells[i + 1]) {
          cells[i] *= 2;
          scoreIncrease += cells[i];
          cells.splice(i + 1, 1);
          moved = true;
          i--;
        }
      }

      while (cells.length < 4) {
        cells.push(0);
      }

      if (JSON.stringify(this.state[row]) !== JSON.stringify(cells)) {
        moved = true;
      }

      this.state[row] = cells;
    }

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.checkGameEnd();
    }

    return moved;
  }

  moveRight() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moved = false;
    let scoreIncrease = 0;

    for (let row = 0; row < 4; row++) {
      const cells = this.state[row].filter((cell) => cell !== 0);

      for (let i = cells.length - 1; i > 0; i--) {
        if (cells[i] === cells[i - 1]) {
          cells[i] *= 2;
          scoreIncrease += cells[i];
          cells.splice(i - 1, 1);
          moved = true;
        }
      }

      while (cells.length < 4) {
        cells.unshift(0);
      }

      if (JSON.stringify(this.state[row]) !== JSON.stringify(cells)) {
        moved = true;
      }

      this.state[row] = cells;
    }

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.checkGameEnd();
    }

    return moved;
  }

  moveUp() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moved = false;
    let scoreIncrease = 0;

    for (let col = 0; col < 4; col++) {
      let cells = [];

      for (let row = 0; row < 4; row++) {
        cells.push(this.state[row][col]);
      }

      cells = cells.filter((cell) => cell !== 0);

      for (let i = 0; i < cells.length - 1; i++) {
        if (cells[i] === cells[i + 1]) {
          cells[i] *= 2;
          scoreIncrease += cells[i];
          cells.splice(i + 1, 1);
          moved = true;
          i--;
        }
      }

      while (cells.length < 4) {
        cells.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== cells[row]) {
          moved = true;
          this.state[row][col] = cells[row];
        }
      }
    }

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.checkGameEnd();
    }

    return moved;
  }

  moveDown() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moved = false;
    let scoreIncrease = 0;

    for (let col = 0; col < 4; col++) {
      let cells = [];

      for (let row = 0; row < 4; row++) {
        cells.push(this.state[row][col]);
      }

      cells = cells.filter((cell) => cell !== 0);

      for (let i = cells.length - 1; i > 0; i--) {
        if (cells[i] === cells[i - 1]) {
          cells[i] *= 2;
          scoreIncrease += cells[i];
          cells.splice(i - 1, 1);
          moved = true;
        }
      }

      while (cells.length < 4) {
        cells.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== cells[row]) {
          moved = true;
          this.state[row][col] = cells[row];
        }
      }
    }

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.checkGameEnd();
    }

    return moved;
  }

  start() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyPositions = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyPositions.push([row, col]);
        }
      }
    }

    if (emptyPositions.length > 0) {
      const [row, col] =
        emptyPositions[Math.floor(Math.random() * emptyPositions.length)];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  restart() {
    this.start();
  }

  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }
      }
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameEnd() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          return false;
        }
      }
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === this.state[row + 1][col]) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }

  #updateBoard(newBoard) {
    const oldState = JSON.stringify(this.state);

    this.state = newBoard;

    return oldState !== JSON.stringify(this.state);
  }
}
