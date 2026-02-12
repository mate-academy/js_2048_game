'use strict';

/**
 * This class represents the game.
 * Obligatory methods (used in tests):
 * constructor(initialState)
 * getState()
 * getScore()
 * getStatus()
 * moveLeft()
 * moveRight()
 * moveUp()
 * moveDown()
 * start()
 * restart()
 */
class Game {
  constructor(initialState) {
    this.size = 4;

    this.initialState = initialState
      ? this.#cloneBoard(initialState)
      : this.#createEmptyBoard();

    this.board = this.#cloneBoard(this.initialState);
    this.score = 0;
    this.status = 'idle'; // 'idle' | 'playing' | 'win' | 'lose'
  }

  moveLeft() {
    return this.#makeMove('left');
  }

  moveRight() {
    return this.#makeMove('right');
  }

  moveUp() {
    return this.#makeMove('up');
  }

  moveDown() {
    return this.#makeMove('down');
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.#cloneBoard(this.board);
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    // Se estiver vazio, começa com 2 tiles
    if (this.#countEmpty(this.board) === this.size * this.size) {
      this.#spawnRandomTile();
      this.#spawnRandomTile();
    }
  }

  restart() {
    this.board = this.#cloneBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // ----------------- PRIVATE -----------------
  #makeMove(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const prevBoard = this.#cloneBoard(this.board);
    const { board: movedBoard, gained } = this.#moveBoard(
      this.board,
      direction,
    );

    const changed = !this.#boardsEqual(prevBoard, movedBoard);

    if (!changed) {
      return false;
    }

    this.board = movedBoard;
    this.score += gained;

    if (this.#hasValue(this.board, 2048)) {
      this.status = 'win';

      return true;
    }

    this.#spawnRandomTile();

    if (!this.#hasAvailableMoves(this.board)) {
      this.status = 'lose';
    }

    return true;
  }

  #moveBoard(board, direction) {
    const size = this.size;
    let gainedTotal = 0;
    const newBoard = this.#cloneBoard(board);

    const moveLine = (line) => {
      const filtered = line.filter((v) => v !== 0);
      const result = [];
      let gained = 0;

      for (let i = 0; i < filtered.length; i += 1) {
        const cur = filtered[i];
        const next = filtered[i + 1];

        if (next !== undefined && cur === next) {
          const merged = cur * 2;

          result.push(merged);
          gained += merged;
          i += 1; // impede merge duplo na mesma jogada
        } else {
          result.push(cur);
        }
      }

      while (result.length < size) {
        result.push(0);
      }

      return { line: result, gained };
    };

    if (direction === 'left' || direction === 'right') {
      for (let r = 0; r < size; r += 1) {
        const line = newBoard[r].slice();

        if (direction === 'right') {
          line.reverse();
        }

        const moved = moveLine(line);

        gainedTotal += moved.gained;

        let finalLine = moved.line;

        if (direction === 'right') {
          finalLine = finalLine.slice().reverse();
        }

        newBoard[r] = finalLine;
      }
    }

    if (direction === 'up' || direction === 'down') {
      for (let c = 0; c < size; c += 1) {
        const col = [];

        for (let r = 0; r < size; r += 1) {
          col.push(newBoard[r][c]);
        }

        if (direction === 'down') {
          col.reverse();
        }

        const moved = moveLine(col);

        gainedTotal += moved.gained;

        let finalCol = moved.line;

        if (direction === 'down') {
          finalCol = finalCol.slice().reverse();
        }

        for (let r = 0; r < size; r += 1) {
          newBoard[r][c] = finalCol[r];
        }
      }
    }

    return { board: newBoard, gained: gainedTotal };
  }

  #spawnRandomTile() {
    const empties = this.#getEmptyCells(this.board);

    if (empties.length === 0) {
      return;
    }

    const idx = Math.floor(Math.random() * empties.length);
    const { r, c } = empties[idx];

    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[r][c] = value;
  }

  #hasAvailableMoves(board) {
    if (this.#countEmpty(board) > 0) {
      return true;
    }

    const size = this.size;

    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        const v = board[r][c];

        if (c + 1 < size && board[r][c + 1] === v) {
          return true;
        }

        if (r + 1 < size && board[r + 1][c] === v) {
          return true;
        }
      }
    }

    return false;
  }

  #createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  #cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  #boardsEqual(a, b) {
    for (let r = 0; r < this.size; r += 1) {
      for (let c = 0; c < this.size; c += 1) {
        if (a[r][c] !== b[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  #hasValue(board, value) {
    return board.some((row) => row.includes(value));
  }

  #getEmptyCells(board) {
    const res = [];

    for (let r = 0; r < this.size; r += 1) {
      for (let c = 0; c < this.size; c += 1) {
        if (board[r][c] === 0) {
          res.push({ r, c });
        }
      }
    }

    return res;
  }

  #countEmpty(board) {
    return this.#getEmptyCells(board).length;
  }
}

export default Game;
