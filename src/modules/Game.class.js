'use strict';
export default class Game {
  static Status = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  static Config = {
    ROWS: 4,
    COLUMNS: 4,
  };

  constructor(initialState) {
    this.state = initialState;
    this.score = 0;
    this.status = Game.Status.IDLE;
  }

  renderBoard() {
    document.querySelector('.game-field').innerHTML = '';

    for (let r = 0; r < Game.Config.ROWS; r++) {
      for (let c = 0; c < Game.Config.COLUMNS; c++) {
        const tile = document.createElement('div');

        tile.id = `${r}-${c}`;

        const num = this.state[r][c];

        this.updateTile(tile, num);
        document.querySelector('.game-field').append(tile);
      }
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < Game.Config.ROWS; row++) {
      for (let col = 0; col < Game.Config.COLUMNS; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  filterZero(row) {
    return row.filter((num) => num !== 0);
  }

  slide(row) {
    let newRow = this.filterZero(row);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
        this.score += newRow[i];
      }
    }

    newRow = this.filterZero(newRow);

    while (newRow.length < Game.Config.ROWS) {
      newRow.push(0);
    }

    return newRow;
  }

  updateTile(tile, num) {
    tile.innerText = '';
    tile.classList.value = '';
    tile.classList.add('field-cell');

    if (num > 0) {
      tile.innerText = num;
      tile.classList.add(`field-cell--${num}`);
    }
  }

  moveLeft() {
    for (let r = 0; r < Game.Config.ROWS; r++) {
      let row = this.state[r];

      row = this.slide(row);
      this.state[r] = row;

      for (let c = 0; c < Game.Config.COLUMNS; c++) {
        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = this.state[r][c];

        this.updateTile(tile, num);
      }
    }
  }

  moveRight() {
    for (let r = 0; r < Game.Config.ROWS; r++) {
      let row = this.state[r];

      row.reverse();
      row = this.slide(row);
      row.reverse();
      this.state[r] = row;

      for (let c = 0; c < Game.Config.COLUMNS; c++) {
        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = this.state[r][c];

        this.updateTile(tile, num);
      }
    }
  }
  moveUp() {
    for (let c = 0; c < Game.Config.COLUMNS; c++) {
      let row = [
        this.state[0][c],
        this.state[1][c],
        this.state[2][c],
        this.state[3][c],
      ];

      row = this.slide(row);

      for (let r = 0; r < Game.Config.ROWS; r++) {
        this.state[r][c] = row[r];

        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = this.state[r][c];

        this.updateTile(tile, num);
      }
    }
  }
  moveDown() {
    for (let c = 0; c < Game.Config.COLUMNS; c++) {
      let row = [
        this.state[0][c],
        this.state[1][c],
        this.state[2][c],
        this.state[3][c],
      ];

      row.reverse();
      row = this.slide(row);
      row.reverse();

      for (let r = 0; r < Game.Config.ROWS; r++) {
        this.state[r][c] = row[r];

        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = this.state[r][c];

        this.updateTile(tile, num);
      }
    }
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
    this.status = Game.Status.PLAYING;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.status = Game.Status.PLAYING;
    this.state = this.state.map((row) => row.map(() => 0));
    this.score = 0;
    this.start();
  }

  hasPossibleMoves() {
    for (let r = 0; r < Game.Config.ROWS; r++) {
      for (let c = 0; c < Game.Config.COLUMNS; c++) {
        const current = this.state[r][c];

        if (current === 0) {
          return true;
        }

        if (c < Game.Config.COLUMNS && current === this.state[r][c + 1]) {
          return true;
        }

        if (r < Game.Config.ROWS - 1 && current === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  isMoveMade(prevBoard) {
    for (let r = 0; r < Game.Config.ROWS; r++) {
      for (let c = 0; c < Game.Config.COLUMNS; c++) {
        if (prevBoard[r][c] !== this.state[r][c]) {
          return true;
        }
      }
    }

    return false;
  }

  hasEmptyTile() {
    return this.state.some((row) => row.includes(0));
  }

  checkGameOver() {
    if (!this.hasEmptyTile() && !this.hasPossibleMoves()) {
      this.status = Game.Status.LOSE;
    } else if (this.state.some((row) => row.includes(2048))) {
      this.status = Game.Status.WIN;
    }
  }
}
