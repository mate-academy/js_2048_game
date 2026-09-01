'use strict';

class Game {
  constructor(initialState) {
    const defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    // Create deep copies to prevent modifying the original arguments
    this.initialState = initialState
      ? this._copyGrid(initialState)
      : this._copyGrid(defaultState);

    this.board = this._copyGrid(this.initialState);
    this.score = 0;
    this.stats = 'idle';
  }

  _copyGrid(grid) {
    return grid.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  /**
   * Returns the current game stats.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStats() {
    return this.stats;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.stats === 'idle') {
      this.stats = 'playing';

      // Only spawn initial tiles if the board is completely empty
      // (prevents breaking tests that pass a populated initial state)
      const isEmpty = this.board.flat().every((cell) => cell === 0);

      if (isEmpty) {
        this._addRandomTile();
        this._addRandomTile();
      }
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this._copyGrid(this.initialState);
    this.score = 0;
    this.stats = 'idle';
  }

  // Add your own methods here
  _addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const idx = Math.floor(Math.random() * emptyCells.length);
      const { r, c } = emptyCells[idx];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  _checkGameStats() {
    // Check for Win
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.stats = 'win';

          return;
        }
      }
    }

    // Check if there are any empty spaces left
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return;
        }
      }
    }

    // Check for any possible merges
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (c < 3 && current === this.board[r][c + 1]) {
          return; // match right
        }

        if (r < 3 && current === this.board[r + 1][c]) {
          return; // match down
        }
      }
    }

    // If no zeros and no merges are possible, the game is lost
    this.stats = 'lose';
  }

  // Core merging logic applied to a single row / column array
  _slideAndMerge(line) {
    let filtered = line.filter((val) => val !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] !== 0 && filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    filtered = filtered.filter((val) => val !== 0);

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  _processMove(processBoardCallback) {
    if (this.stats !== 'playing') {
      return;
    }

    const prevBoard = JSON.stringify(this.board);

    processBoardCallback();

    // If the board actually changed, process the end-of0turn steps
    if (JSON.stringify(this.board) !== prevBoard) {
      this._addRandomTile();
      this._checkGameStats();
    }
  }

  moveLeft() {
    this._processMove(() => {
      for (let r = 0; r < 4; r++) {
        this.board[r] = this._slideAndMerge(this.board[r]);
      }
    });
  }

  moveRight() {
    this._processMove(() => {
      for (let r = 0; r < 4; r++) {
        let reversedRow = [...this.board[r]].reverse();

        reversedRow = this._slideAndMerge(reversedRow);
        this.board[r] = reversedRow.reverse();
      }
    });
  }

  moveUp() {
    this._processMove(() => {
      for (let c = 0; c < 4; c++) {
        let col = [
          this.board[0][c],
          this.board[1][c],
          this.board[2][c],
          this.board[3][c],
        ];

        col = this._slideAndMerge(col);

        for (let r = 0; r < 4; r++) {
          this.board[r][c] = col[r];
        }
      }
    });
  }

  moveDown() {
    this._processMove(() => {
      for (let c = 0; c < 4; c++) {
        let col = [
          this.board[3][c],
          this.board[2][c],
          this.board[1][c],
          this.board[0][c],
        ];

        col = this._slideAndMerge(col);

        const reversedCol = col.reverse();

        for (let r = 0; r < 4; r++) {
          this.board[r][c] = reversedCol[r];
        }
      }
    });
  }
}

module.exports = Game;
