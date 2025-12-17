'use strict';

class Game {
  constructor(initialState) {
    this.board = initialState
      ? structuredClone(initialState)
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.initialState = structuredClone(this.board);
    this.score = 0;
    this.gameStatus = 'idle';
  }

  start() {
    if (this.gameStatus !== 'idle') {
      return;
    }
    this.gameStatus = 'playing';
    this.spawnRandomTile();
    this.spawnRandomTile();
  }

  restart() {
    this.board = structuredClone(this.initialState);
    this.score = 0;
    this.gameStatus = 'idle';
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.gameStatus;
  }

  spawnRandomTile() {
    const empty = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          empty.push({ i, j });
        }
      }
    }

    if (!empty.length) {
      return null;
    }

    const { i: row, j: col } = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  reverseRows(board) {
    return board.map((row) => [...row].reverse());
  }

  rotateLeft(board) {
    return board[0].map((_, i) => board.map((row) => row[i]).reverse());
  }

  rotateRight(board) {
    return board[0].map((_, i) => board.map((row) => row[row.length - 1 - i]));
  }

  moveWithMeta(direction) {
    if (this.gameStatus !== 'playing') {
      return null;
    }

    const prevBoard = structuredClone(this.board);
    const meta = { moves: [], merges: [] };

    const mapIndexToCell = (line, idx) => {
      if (direction === 'left') {
        return { r: line, c: idx };
      }

      if (direction === 'right') {
        return { r: line, c: 3 - idx };
      }

      if (direction === 'up') {
        return { r: idx, c: line };
      }

      return { r: 3 - idx, c: line }; // down
    };

    const newBoard = Array.from({ length: 4 }, () => Array(4).fill(0));

    for (let line = 0; line < 4; line++) {
      const values = [];
      const fromCells = [];

      for (let idx = 0; idx < 4; idx++) {
        const { r, c } = mapIndexToCell(line, idx);
        const v = this.board[r][c];

        if (v !== 0) {
          values.push(v);
          fromCells.push({ r, c });
        }
      }

      let write = 0;

      for (let i = 0; i < values.length; i++) {
        const cur = values[i];
        const next = values[i + 1];

        if (next !== undefined && cur === next) {
          const merged = cur * 2;
          const to = mapIndexToCell(line, write);

          newBoard[to.r][to.c] = merged;
          this.score += merged;

          meta.moves.push({ from: fromCells[i], to });
          meta.moves.push({ from: fromCells[i + 1], to });
          meta.merges.push({ at: to, value: merged });

          i++;
          write++;
        } else {
          const to = mapIndexToCell(line, write);

          newBoard[to.r][to.c] = cur;
          meta.moves.push({ from: fromCells[i], to });
          write++;
        }
      }
    }

    const changed = JSON.stringify(prevBoard) !== JSON.stringify(newBoard);

    if (!changed) {
      return null;
    }

    this.board = newBoard;
    this.spawnRandomTile();

    if (this.board.some((row) => row.includes(2048))) {
      this.gameStatus = 'win';
    }

    if (this.gameStatus !== 'win' && this.checkLose()) {
      this.gameStatus = 'lose';
    }

    return { meta, prevBoard, nextBoard: structuredClone(this.board) };
  }

  checkLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }

        if (this.board[i][j] === this.board[i]?.[j + 1]) {
          return false;
        }

        if (this.board[i][j] === this.board[i + 1]?.[j]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
