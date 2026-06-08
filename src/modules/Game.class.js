'use strict';

/**
 * This class represents the game.
 */
class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? JSON.parse(JSON.stringify(initialState))
      : this._createEmptyBoard();

    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';

    if (this._isEmptyBoard()) {
      this._addRandomTile();
      this._addRandomTile();
    }
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'playing';

    if (this._isEmptyBoard()) {
      this._addRandomTile();
      this._addRandomTile();
    }
  }

  moveLeft() {
    this._processMove('left');
  }

  moveRight() {
    this._processMove('right');
  }

  moveUp() {
    this._processMove('up');
  }

  moveDown() {
    this._processMove('down');
  }

  _createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  _isEmptyBoard() {
    return this.board.every((row) => row.every((cell) => cell === 0));
  }

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
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { r, c } = emptyCells[randomIndex];

      this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  // Сжатие и слияние одной линии (строки или колонки)
  _compressAndMerge(line) {
    // 1. Убираем нули
    const filtered = line.filter((val) => val !== 0);
    const merged = [];
    let scoreIncrease = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const newValue = filtered[i] * 2;

        merged.push(newValue);
        scoreIncrease += newValue;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return { newLine: merged, scoreIncrease };
  }

  _processMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const boardBeforeMove = JSON.stringify(this.board);

    if (direction === 'left' || direction === 'right') {
      for (let r = 0; r < 4; r++) {
        const row = this.board[r];

        if (direction === 'right') {
          row.reverse();
        }

        const { newLine, scoreIncrease } = this._compressAndMerge(row);

        this.score += scoreIncrease;

        if (direction === 'right') {
          newLine.reverse();
        }

        this.board[r] = newLine;
      }
    } else if (direction === 'up' || direction === 'down') {
      for (let c = 0; c < 4; c++) {
        const col = [
          this.board[0][c],
          this.board[1][c],
          this.board[2][c],
          this.board[3][c],
        ];

        if (direction === 'down') {
          col.reverse();
        }

        const { newLine, scoreIncrease } = this._compressAndMerge(col);

        this.score += scoreIncrease;

        if (direction === 'down') {
          newLine.reverse();
        }

        for (let r = 0; r < 4; r++) {
          this.board[r][c] = newLine[r];
        }
      }
    }

    const boardAfterMove = JSON.stringify(this.board);

    if (boardBeforeMove !== boardAfterMove) {
      this._addRandomTile();
      this._updateStatus();
    }
  }

  _updateStatus() {
    let hasEmpty = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }

        if (this.board[r][c] === 0) {
          hasEmpty = true;
        }
      }
    }

    if (hasEmpty) {
      return;
    }

    let canMove = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (c < 3 && current === this.board[r][c + 1]) {
          canMove = true;
        }

        if (r < 3 && current === this.board[r + 1][c]) {
          canMove = true;
        }
      }
    }

    if (!canMove) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
