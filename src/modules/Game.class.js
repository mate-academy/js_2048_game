'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    if (initialState) {
      this.state = initialState.map((row) => [...row]);
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

  moveAllRowAndCol(row) {
    const rowWithOutZeros = row.filter((cell) => cell !== 0);
    const result = [];

    for (let i = 0; i < rowWithOutZeros.length; i++) {
      if (rowWithOutZeros[i] === rowWithOutZeros[i + 1]) {
        result.push(rowWithOutZeros[i] * 2);
        this.score += rowWithOutZeros[i] * 2;
        i++;
      } else {
        result.push(rowWithOutZeros[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  moveLeft() {
    return this.applyMove(() => {
      this.state = this.state.map((row) => this.moveAllRowAndCol(row));
    });
  }

  moveRight() {
    return this.applyMove(() => {
      this.state = this.state.map((row) => {
        const reversed = [...row].reverse();
        const moved = this.moveAllRowAndCol(reversed);

        return moved.reverse();
      });
    });
  }

  moveUp() {
    return this.applyMove(() => {
      for (let col = 0; col < 4; col++) {
        const column = [
          this.state[0][col],
          this.state[1][col],
          this.state[2][col],
          this.state[3][col],
        ];

        const moved = this.moveAllRowAndCol(column);

        for (let row = 0; row < 4; row++) {
          this.state[row][col] = moved[row];
        }
      }
    });
  }

  moveDown() {
    return this.applyMove(() => {
      for (let col = 0; col < 4; col++) {
        const column = [
          this.state[0][col],
          this.state[1][col],
          this.state[2][col],
          this.state[3][col],
        ];

        const reversed = [...column].reverse();
        const moved = this.moveAllRowAndCol(reversed).reverse();

        for (let row = 0; row < 4; row++) {
          this.state[row][col] = moved[row];
        }
      }
    });
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    const coordsEmptyCell = [];

    if (this.status === 'playing') {
      return;
    }

    this.status = 'playing';

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          coordsEmptyCell.push([i, j]);
        }
      }
    }

    if (!coordsEmptyCell.length) {
      return;
    }

    const randomIndex1 = Math.floor(Math.random() * coordsEmptyCell.length);
    const [row1, col1] = coordsEmptyCell[randomIndex1];

    this.state[row1][col1] = 2;
    coordsEmptyCell.splice(randomIndex1, 1);

    const randomIndex2 = Math.floor(Math.random() * coordsEmptyCell.length);
    const [row2, col2] = coordsEmptyCell[randomIndex2];

    this.state[row2][col2] = Math.random() < 0.9 ? 2 : 4;
  }

  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  spawn() {
    const coordsEmptyCellSpawn = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          coordsEmptyCellSpawn.push([i, j]);
        }
      }
    }

    if (!coordsEmptyCellSpawn.length) {
      return;
    }

    const randomIndex1 = Math.floor(
      Math.random() * coordsEmptyCellSpawn.length,
    );
    const [row1, col1] = coordsEmptyCellSpawn[randomIndex1];

    this.state[row1][col1] = Math.random() < 0.9 ? 2 : 4;
  }

  render(cells) {
    const flat = this.state.flat();

    for (let i = 0; i < flat.length; i++) {
      const value = flat[i];
      const cell = cells[i];

      cell.textContent = value === 0 ? '' : value;

      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  hasMoves() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.state[i][j];

        if (current === 0) {
          return true;
        }

        if (j < 3 && current === this.state[i][j + 1]) {
          return true;
        }

        if (i < 3 && current === this.state[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    if (this.status === 'win') {
      return;
    }

    if (!this.hasMoves()) {
      this.status = 'lose';

      return true;
    }

    return false;
  }

  isChanged(a, b) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (a[i][j] !== b[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  applyMove(callback) {
    if (this.status !== 'playing') {
      return false;
    }

    const oldState = this.getState();

    callback();

    const newState = this.getState();

    const changed = this.isChanged(oldState, newState);

    if (!changed) {
      return false;
    }

    if (this.status === 'playing') {
      this.spawn();
    }

    this.checkWin();
    this.checkLose();

    return true;
  }
}

module.exports = Game;
