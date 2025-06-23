'use strict';

class Game {
  constructor(initialState) {
    const defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.status = 'idle';

    const baseState = initialState || defaultState;

    // initial state, using it to come back to it after restart
    this.init = structuredClone(baseState);
    this.state = structuredClone(baseState);
    this.score = 0;
  }

  moveLeft() {
    const oldState = structuredClone(this.state);

    for (let r = 0; r < this.state.length; r++) {
      // Extract row tiles into an array
      const row = [];

      for (let c = 0; c < this.state.length; c++) {
        row.push(this.state[r][c]);
      }

      // Remove zeros (move tiles)
      let filtered = row.filter((i) => i !== 0);

      // Merge adjacent equal tiles
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2; // Merge
          this.score += filtered[i]; // Update score
          filtered[i + 1] = 0; // Mark merged tile as empty
          i++; // Skip next tile
        }
      }

      // Remove zeros after merge
      filtered = filtered.filter((i) => i !== 0);

      // Fill the rest with zeros to keep column length 4
      while (filtered.length < this.state.length) {
        filtered.push(0);
      }

      // Write back to the board
      for (let c = 0; c < this.state.length; c++) {
        this.state[r][c] = filtered[c];
      }
    }

    // Compare oldState and this.state
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (oldState[r][c] !== this.state[r][c]) {
          return true; // Board changed
        }
      }
    }

    return false; // No change
  }

  moveRight() {
    const oldState = structuredClone(this.state);

    for (let r = 0; r < this.state.length; r++) {
      const row = [];

      for (let c = 0; c < this.state.length; c++) {
        row.push(this.state[r][c]);
      }

      let filtered = row.filter((i) => i !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered[i + 1] = 0;
          i++;
        }
      }

      filtered = filtered.filter((i) => i !== 0);

      while (filtered.length < this.state.length) {
        filtered.unshift(0);
      }

      for (let c = 0; c < this.state.length; c++) {
        this.state[r][c] = filtered[c];
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (oldState[r][c] !== this.state[r][c]) {
          return true;
        }
      }
    }

    return false;
  }

  moveUp() {
    const oldState = structuredClone(this.state);

    for (let col = 0; col < this.state.length; col++) {
      const column = [];

      for (let row = 0; row < this.state.length; row++) {
        column.push(this.state[row][col]);
      }

      let filtered = column.filter((i) => i !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered[i + 1] = 0;
          i++;
        }
      }

      filtered = filtered.filter((i) => i !== 0);

      while (filtered.length < this.state.length) {
        filtered.push(0);
      }

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][col] = filtered[row];
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (oldState[r][c] !== this.state[r][c]) {
          return true;
        }
      }
    }

    return false;
  }

  moveDown() {
    const oldState = structuredClone(this.state);

    for (let col = 0; col < this.state.length; col++) {
      const column = [];

      for (let row = 0; row < this.state.length; row++) {
        column.push(this.state[row][col]);
      }

      let filtered = column.filter((i) => i !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered[i + 1] = 0;
          i++;
        }
      }

      filtered = filtered.filter((i) => i !== 0);

      while (filtered.length < this.state.length) {
        filtered.unshift(0);
      }

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][col] = filtered[row];
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (oldState[r][c] !== this.state[r][c]) {
          return true;
        }
      }
    }

    return false;
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
    let tileCount = this.state.flat().filter((val) => val !== 0).length;

    while (tileCount < 2) {
      this.addNewTile();
      tileCount = this.state.flat().filter((val) => val !== 0).length;
    }

    this.updateUI();

    this.status = 'playing';
  }

  restart() {
    const tileCount = this.state.flat().filter((val) => val !== 0).length;

    // prettier-ignore
    this.state =
      tileCount > 0
        ? structuredClone([
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ])
        : structuredClone(this.init);
    this.score = 0;

    this.updateUI();

    this.status = 'idle';
  }

  // Add your own methods here

  addNewTile() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state.length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  updateUI() {
    const rows = document.querySelectorAll('.field-row');

    for (let i = 0; i < this.state.length; i++) {
      const cells = rows[i].querySelectorAll('.field-cell');

      for (let j = 0; j < this.state.length; j++) {
        const val = this.state[i][j];

        cells[j].className = `field-cell${val ? ` field-cell--${val}` : ''}`;
        cells[j].textContent = val || '';
      }
    }
  }

  hasNoMoves() {
    const board = this.state;
    const size = this.state.length;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === 0) {
          return false;
        }

        if (c < size - 1 && board[r][c] === board[r][c + 1]) {
          return false;
        }

        if (r < size - 1 && board[r][c] === board[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }

  has2048Tile() {
    return this.state.flat().some((t) => t === 2048);
  }

  checkGameOver() {
    if (this.hasNoMoves()) {
      this.status = 'lose';
    }

    if (this.has2048Tile()) {
      this.status = 'win';
    }
  }
}

export default Game;
