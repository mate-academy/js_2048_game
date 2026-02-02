'use strict';

function copyState(state) {
  return state.map((row) => [...row]);
}

class Game {
  constructor(initialState) {
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.state = copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  addNewTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.1 ? 4 : 2;

      this.state[randomCell[0]][randomCell[1]] = value;
    }
  }

  addScore(points) {
    this.score += points;
  }

  moveRowLeft(row) {
    let tiles = row.filter((num) => num !== 0);

    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] === tiles[i + 1]) {
        tiles[i] *= 2;
        this.addScore(tiles[i]);
        tiles[i + 1] = 0;
        i++;
      }
    }
    tiles = tiles.filter((num) => num !== 0);

    while (tiles.length < 4) {
      tiles.push(0);
    }

    return tiles;
  }

  moveRowRight(row) {
    let tiles = row
      .slice()
      .reverse()
      .filter((num) => num !== 0);

    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] === tiles[i + 1]) {
        tiles[i] *= 2;
        this.addScore(tiles[i]);
        tiles[i + 1] = 0;
        i++;
      }
    }
    tiles = tiles.filter((num) => num !== 0);

    while (tiles.length < 4) {
      tiles.push(0);
    }

    return tiles.reverse();
  }

  _hasAvailableMoves() {
    // return true if any empty cell
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return true;
        }
      }
    }

    // check horizontal merges
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.state[r][c] === this.state[r][c + 1]) {
          return true;
        }
      }
    }

    // check vertical merges
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 3; r++) {
        if (this.state[r][c] === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    const newState = [];

    for (let row = 0; row < 4; row++) {
      const oldRow = this.state[row];
      const newRow = this.moveRowLeft(oldRow);

      newState.push(newRow);

      if (oldRow.join(',') !== newRow.join(',')) {
        moved = true;
      }
    }

    if (moved) {
      this.state = newState;
      this.addNewTile();
      // update status after the move
      this.status = this.getStatus();
    }

    return moved;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    const newState = [];

    for (let row = 0; row < 4; row++) {
      const oldRow = this.state[row];
      const newRow = this.moveRowRight(oldRow);

      newState.push(newRow);

      if (oldRow.join(',') !== newRow.join(',')) {
        moved = true;
      }
    }

    if (moved) {
      this.state = newState;
      this.addNewTile();
      this.status = this.getStatus();
    }

    return moved;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    const newState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let col = 0; col < 4; col++) {
      const oldCol = [
        this.state[0][col],
        this.state[1][col],
        this.state[2][col],
        this.state[3][col],
      ];
      const newCol = this.moveRowLeft(oldCol);

      newState[0][col] = newCol[0];
      newState[1][col] = newCol[1];
      newState[2][col] = newCol[2];
      newState[3][col] = newCol[3];

      if (oldCol.join(',') !== newCol.join(',')) {
        moved = true;
      }
    }

    if (moved) {
      this.state = newState;
      this.addNewTile();
      this.status = this.getStatus();
    }

    return moved;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    const newState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let col = 0; col < 4; col++) {
      const oldCol = [
        this.state[0][col],
        this.state[1][col],
        this.state[2][col],
        this.state[3][col],
      ];
      const newCol = this.moveRowRight(oldCol);

      newState[0][col] = newCol[0];
      newState[1][col] = newCol[1];
      newState[2][col] = newCol[2];
      newState[3][col] = newCol[3];

      if (oldCol.join(',') !== newCol.join(',')) {
        moved = true;
      }
    }

    if (moved) {
      this.state = newState;
      this.addNewTile();
      this.status = this.getStatus();
    }

    return moved;
  }

  getState() {
    return copyState(this.state);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    const flat = this.state.flat();

    if (flat.includes(2048)) {
      return 'win';
    }

    // If game hasn't been started yet, keep 'idle'
    if (this.status === 'idle') {
      return 'idle';
    }

    if (this._hasAvailableMoves()) {
      return 'playing';
    }

    return 'lose';
  }

  start() {
    // Use the initialState as the starting board (don't reset to empty)
    this.state = copyState(this.initialState);
    this.score = 0;
    this.status = 'playing';
    this.addNewTile();
    this.addNewTile();
    // refresh status in case of immediate win (edge cases)
    this.status = this.getStatus();
  }

  restart() {
    this.state = copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
