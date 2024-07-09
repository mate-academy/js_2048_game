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

  moveLeft() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    const newState = this.getState().map((row) => this.compareAndMerge(row));

    this.updateState(newState);
  }

  moveRight() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    const newState = this.getState().map((row) => {
      return this.compareAndMerge([...row].reverse());
    });

    const reversedState = newState.map((row) => row.reverse());

    this.updateState(reversedState);
  }

  moveUp() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    const newState = Game.getInitialState();

    for (let c = 0; c < 4; c++) {
      let rowFromCol = [
        this.state[0][c],
        this.state[1][c],
        this.state[2][c],
        this.state[3][c],
      ];

      rowFromCol = this.compareAndMerge(rowFromCol);

      for (let r = 0; r < 4; r++) {
        newState[r][c] = rowFromCol[r];
      }
    }

    this.updateState(newState);
  }

  moveDown() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    const newState = Game.getInitialState();

    for (let c = 0; c < 4; c++) {
      let rowFromCol = [
        this.state[0][c],
        this.state[1][c],
        this.state[2][c],
        this.state[3][c],
      ];

      rowFromCol = this.compareAndMerge(rowFromCol.reverse());
      rowFromCol.reverse();

      for (let r = 0; r < 4; r++) {
        newState[r][c] = rowFromCol[r];
      }
    }

    this.updateState(newState);
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

  /**
   * Starts the game.
   */
  start() {
    this.gameStatus = Game.gameStatus.playing;
    this.generateTile(2);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.state = Game.getInitialState();
    this.gameStatus = Game.gameStatus.idle;
    this.updateBoard();
  }

  filterZero(row) {
    return row.filter((num) => num !== 0);
  }

  compareAndMerge(row) {
    let changedRow = this.filterZero(row);

    for (let i = 0; i < changedRow.length; i++) {
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
}

module.exports = Game;
