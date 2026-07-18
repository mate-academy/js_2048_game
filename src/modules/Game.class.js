'use strict';

/**
 * This class represents the game.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   */
  constructor(initialState) {
    this.initialState = initialState ? this._cloneBoard(initialState) : [];

    this.board = this._cloneBoard(this.initialState);
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  /**
   * @returns {string}
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';

    // Если игра началась с пустого поля, добавляем две плитки
    if (this._isEmpty(this.board)) {
      this._addRandomTile();
      this._addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this._cloneBoard(this.initialState);
    this.score = 0;
    this.status = 'playing';

    if (this._isEmpty(this.board)) {
      this._addRandomTile();
      this._addRandomTile();
    }
  }

  moveLeft() {
    this._processMove(() => {
      let moved = false;

      for (let r = 0; r < 4; r++) {
        const { row, changed } = this._slideAndMerge(this.board[r]);

        if (changed) {
          moved = true;
        }
        this.board[r] = row;
      }

      return moved;
    });
  }

  moveRight() {
    this._processMove(() => {
      let moved = false;

      for (let r = 0; r < 4; r++) {
        const reversed = [...this.board[r]].reverse();
        const { row, changed } = this._slideAndMerge(reversed);

        if (changed) {
          moved = true;
        }
        this.board[r] = row.reverse();
      }

      return moved;
    });
  }

  moveUp() {
    this._processMove(() => {
      let moved = false;

      for (let c = 0; c < 4; c++) {
        const col = [
          this.board[0][c],
          this.board[1][c],
          this.board[2][c],
          this.board[3][c],
        ];
        const { row, changed } = this._slideAndMerge(col);

        if (changed) {
          moved = true;
        }

        for (let r = 0; r < 4; r++) {
          this.board[r][c] = row[r];
        }
      }

      return moved;
    });
  }

  moveDown() {
    this._processMove(() => {
      let moved = false;

      for (let c = 0; c < 4; c++) {
        const col = [
          this.board[3][c],
          this.board[2][c],
          this.board[1][c],
          this.board[0][c],
        ];
        const { row, changed } = this._slideAndMerge(col);

        if (changed) {
          moved = true;
        }

        for (let r = 0; r < 4; r++) {
          this.board[3 - r][c] = row[r];
        }
      }

      return moved;
    });
  }

  // --- Private Helper Methods ---

  _processMove(moveFn) {
    if (this.status !== 'playing') {
      return;
    }

    const hasMoved = moveFn();

    if (hasMoved) {
      this._addRandomTile();
      this._updateStatus();
    }
  }

  _slideAndMerge(row) {
    // 1. Фильтруем нули (сдвиг влево)
    const filtered = row.filter((val) => val !== 0);
    let changed = false;
    const newRow = [];

    // 2. Объединяем одинаковые плитки
    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const newValue = filtered[i] * 2;

        newRow.push(newValue);
        this.score += newValue;
        i++; // Пропускаем следующую плитку, так как она объединена
        changed = true;
      } else {
        newRow.push(filtered[i]);
      }
    }

    // Дополняем нулями до длины 4
    while (newRow.length < 4) {
      newRow.push(0);
    }

    // Проверяем, изменился ли ряд по сравнению с исходным
    if (!changed) {
      for (let i = 0; i < 4; i++) {
        if (newRow[i] !== row[i]) {
          changed = true;
          break;
        }
      }
    }

    return { row: newRow, changed };
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
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      // 90% шанс для двойки, 10% для четверки
      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  _updateStatus() {
    // Проверка на победу (ищем 2048)
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    // Проверка на поражение (если нет пустых мест и возможных ходов)
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return;
        } // Есть пустая клетка

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return;
        } // Ход по горизонтали

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return;
        } // Ход по вертикали
      }
    }

    this.status = 'lose';
  }

  _cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  _isEmpty(board) {
    return board.every((row) => row.every((cell) => cell === 0));
  }
}

module.exports = Game;
