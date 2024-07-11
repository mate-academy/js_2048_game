'use strict';

class Game {
  static gameStatus = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  static getInitialState() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  constructor(initialState = Game.getInitialState()) {
    this.gameStatus = Game.gameStatus.idle;
    this.score = 0;
    this.initialState = JSON.parse(JSON.stringify(initialState));
    this.state = initialState;
  }

  getEmptyTiles() {
    const emptyTiles = [];

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (this.state[x][y] === 0) {
          emptyTiles.push([x, y]);
        }
      }
    }

    return emptyTiles;
  }

  generateTile(count = 1) {
    const availableTiles = this.getEmptyTiles();
    const minTilesToAdd = Math.min(count, availableTiles.length);

    if (!availableTiles.length) {
      return;
    }

    for (let i = 0; i < minTilesToAdd; i++) {
      const randomIndex = Math.floor(Math.random() * availableTiles.length);
      const [row, col] = availableTiles.splice(randomIndex, 1)[0];

      this.state[row][col] = Math.random() >= 0.9 ? 4 : 2;
    }

    this.updateBoard();
  }

  updateBoard() {
    const fieldRow = document.querySelectorAll('.field-row');

    fieldRow.forEach((row, index) => {
      row.querySelectorAll('.field-cell').forEach((cell, i) => {
        const num = this.state[index][i];

        cell.classList = 'field-cell';
        cell.innerHTML = '';

        if (num === 0) {
          return;
        }

        cell.classList.add(`field-cell--${num}`);
        cell.innerHTML = num;
      });
    });

    this.isWin();
    this.isLose();
  }

  isWin() {
    this.state.flat().some((tile) => {
      if (tile === 2048) {
        this.gameStatus = Game.gameStatus.win;
      }
    });
  }

  isLose() {
    if (this.getEmptyTiles().length > 0) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (
          (r < 3 && this.state[r][c] === this.state[r + 1][c]) ||
          (c < 3 && this.state[r][c] === this.state[r][c + 1])
        ) {
          return;
        }
      }
    }

    this.gameStatus = Game.gameStatus.lose;
  }

  updateState(newState) {
    if (JSON.stringify(newState) !== JSON.stringify(this.getState())) {
      this.state = newState;
      this.updateBoard();
      this.generateTile();
    }
  }

  move(direction) {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    const newState = Game.getInitialState();

    for (let i = 0; i < 4; i++) {
      let rowOrCol = this.getTilesForRowOrColumn(i, direction);

      rowOrCol = this.compareAndMerge(rowOrCol, direction);
      this.setTilesForRowOrColumn(newState, rowOrCol, i, direction);
    }

    this.updateState(newState);
  }

  getTilesForRowOrColumn(index, direction) {
    switch (direction) {
      case 'left':
        return [...this.state[index]];
      case 'right':
        return [...this.state[index]].reverse();
      case 'up':
        return [
          this.state[0][index],
          this.state[1][index],
          this.state[2][index],
          this.state[3][index],
        ];
      case 'down':
        return [
          this.state[3][index],
          this.state[2][index],
          this.state[1][index],
          this.state[0][index],
        ];
      default:
        return [];
    }
  }

  setTilesForRowOrColumn(newState, tiles, index, direction) {
    switch (direction) {
      case 'left':
        tiles.forEach((value, i) => (newState[index][i] = value));
        break;
      case 'right':
        tiles.reverse().forEach((value, i) => (newState[index][i] = value));
        break;
      case 'up':
        tiles.forEach((value, i) => (newState[i][index] = value));
        break;
      case 'down':
        tiles.reverse().forEach((value, i) => (newState[i][index] = value));
        break;
    }
  }

  compareAndMerge(rowOrCol, direction) {
    let changedRowOrCol = this.filterZero(rowOrCol);

    for (let i = 0; i < changedRowOrCol.length - 1; i++) {
      if (changedRowOrCol[i] === changedRowOrCol[i + 1]) {
        changedRowOrCol[i] += changedRowOrCol[i + 1];
        changedRowOrCol[i + 1] = 0;
        this.score += changedRowOrCol[i];
      }
    }

    changedRowOrCol = this.filterZero(changedRowOrCol);

    while (changedRowOrCol.length < 4) {
      changedRowOrCol.push(0);
    }

    return changedRowOrCol;
  }

  filterZero(rowOrCol) {
    return rowOrCol.filter((num) => num !== 0);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.gameStatus = Game.gameStatus.playing;
    this.generateTile(2);
  }

  restart() {
    this.score = 0;
    this.state = this.initialState;
    this.gameStatus = Game.gameStatus.idle;
    this.updateBoard();
  }
}

module.exports = Game;
