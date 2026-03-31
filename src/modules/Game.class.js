/* eslint-disable function-paren-newline */
'use strict';

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
    if (this.status === 'idle') {
      this.status = 'playing';

      const isEmpty = this.state.every((row) =>
        row.every((cell) => cell === 0),
      );

      if (isEmpty) {
        this._spawnTile();
        this._spawnTile();
      }
    }
  }

  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this._spawnTile();
    this._spawnTile();
  }

  moveLeft() {
    this._processMove(() => {
      this.state = this.state.map((row) => this._slideAndMerge(row));
    });
  }

  moveRight() {
    this._processMove(() => {
      this.state = this.state.map((row) =>
        this._slideAndMerge([...row].reverse()).reverse(),
      );
    });
  }

  moveUp() {
    this._processMove(() => {
      let transposed = this._transpose(this.state);

      transposed = transposed.map((row) => this._slideAndMerge(row));
      this.state = this._transpose(transposed);
    });
  }

  moveDown() {
    this._processMove(() => {
      let transposed = this._transpose(this.state);

      transposed = transposed.map((row) =>
        this._slideAndMerge([...row].reverse()).reverse(),
      );
      this.state = this._transpose(transposed);
    });
  }

  _processMove(moveAction) {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = JSON.stringify(this.state);

    moveAction();

    const newState = JSON.stringify(this.state);

    if (oldState !== newState) {
      this._spawnTile();
      this._checkWin();

      if (this.status !== 'win') {
        this._checkLose();
      }
    }
  }

  _slideAndMerge(row) {
    let filtered = row.filter((val) => val !== 0);

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

  _transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  _spawnTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[r][c] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  _checkWin() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  _checkLose() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.state[r][c];

        if (c < 3 && val === this.state[r][c + 1]) {
          return;
        }

        if (r < 3 && val === this.state[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
