'use strict';

class Game {
  static STATUS = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.score = 0;
    this.status = Game.STATUS;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
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

  generateTiles(count = 1) {
    const freeTiles = this.getEmptyTiles();

    const minTilesToAdd = Math.min(count, freeTiles.length);

    if (!freeTiles.length) {
      return;
    }

    for (let i = 0; i < minTilesToAdd; i++) {
      const maxIndex = freeTiles.length;
      const randomIndex = Math.floor(Math.random() * maxIndex);

      const chosenTile = freeTiles[randomIndex];
      const row = chosenTile[0];
      const col = chosenTile[1];

      freeTiles.splice(randomIndex, 1);

      const newValue = Math.random() >= 0.9 ? 4 : 2;

      this.state[row][col] = newValue;
    }

    this.updateBoard();
  }

  updateBoard() {
    const fieldRow = document.querySelectorAll('fiels-row');

    fieldRow.forEach((row, index) => {
      row.querySelectorAll('field-cell').forEach((cell, i) => {
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
        this.gameStatus = Game.STATUS.win;
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
          (r < 3 && this.state[r][c] === this.state[r][c + 1])
        ) {
          return;
        }
      }
    }

    this.gameStatus = Game.STATUS.lose;
  }

  updateState(newState) {
    if (JSON.stringify(newState !== JSON.stringify(this.getState()))) {
      this.state = newState;
      this.updateBoard();
      this.generateTile();
    }
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    const newState = this.getState().map((row) => this.compareAndMerge(row));

    this.updateState(newState);
  }
  moveRight() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    const newState = this.getState().map((row) => {
      return this.compareAndMerge([...row].reverse());
    });

    const reversedState = newState.map((row) => row.reverse());

    this.updateState(reversedState);
  }
  moveUp() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    const newState = [];

    for (let r = 0; r < 4; r++) {
      const column = [];

      for (let c = 0; c < 4; c++) {
        column.push(this.state[c][r]);
      }

      const mergedColumn = this.compareAndMerge(column);

      for (let c = 0; c < 4; c++) {
        newState[c] = newState[c] || [];

        newState[c][r] = mergedColumn[c];
      }
    }

    this.updateState(newState);
  }
  moveDown() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    const newState = [];

    for (let c = 0; c < 4; c++) {
      const column = [];

      for (let r = 3; r >= 0; r--) {
        column.push(this.state[r][c]);
      }

      const mergedColumn = this.compareAndMerge(column);

      for (let r = 3; r >= 0; r--) {
        newState[r] = newState[r] || [];

        newState[r][c] = mergedColumn[3 - r];
      }
    }

    this.updateState(newState);
  }

  filterZero(row) {
    return row.filter((num) => num !== 0);
  }

  compareAndMerge() {
    let changedRow = this.filterZero();

    for (let i = 0; i < changedRow; i++) {
      if (changedRow[i] === changedRow[i + 1]) {
        changedRow[i] += changedRow[i + 1];
        changedRow[i + 1] = 0;

        this.score += changedRow[i];
      }
    }

    changedRow = this.filterZero(changedRow);

    while (changedRow.length < 4) {
      changedRow.push(0);
    }

    return changedRow;
  }

  start() {
    this.gameStatus = Game.gameStatus.playing;
    this.generateTile(2);
  }

  restart() {
    this.score = 0;
    this.state = Game.getInitialState();
    this.gameStatus = Game.gameStatus.idle;
    this.updateBoard();
  }
}
module.exports = Game;
