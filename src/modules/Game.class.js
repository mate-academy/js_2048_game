'use strict';

class Game {
  constructor(initialState) {
    this.initialState =
      initialState || Array.from({ length: 4 }, () => Array(4).fill(0));
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  // Método genérico de movimento que centraliza a lógica comum
  move(transformBoardFn) {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = JSON.stringify(this.board);

    transformBoardFn();

    if (previousBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose';
      } else {
        this.checkWinCondition();
      }
    }
  }

  moveLeft() {
    this.move(() => {
      for (let r = 0; r < 4; r++) {
        this.board[r] = this.moveAndMerge(this.board[r]);
      }
    });
  }

  moveRight() {
    this.move(() => {
      for (let r = 0; r < 4; r++) {
        this.board[r] = this.moveAndMerge(
          [...this.board[r]].reverse(),
        ).reverse();
      }
    });
  }

  moveUp() {
    this.move(() => {
      const transposed = this.transposeBoard();

      for (let c = 0; c < 4; c++) {
        transposed[c] = this.moveAndMerge(transposed[c]);
      }
      this.board = this.transposeBoard(transposed);
    });
  }

  moveDown() {
    this.move(() => {
      const transposed = this.transposeBoard();

      for (let c = 0; c < 4; c++) {
        transposed[c] = this.moveAndMerge(
          [...transposed[c]].reverse(),
        ).reverse();
      }
      this.board = this.transposeBoard(transposed);
    });
  }

  // Simplificado para não usar loops extras
  moveAndMerge(row) {
    const filtered = row.filter((val) => val !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        const mergedValue = filtered[i] * 2;

        result.push(mergedValue);
        this.score += mergedValue;
        i++; // Pula o próximo elemento, pois já foi combinado
      } else {
        result.push(filtered[i]);
      }
    }

    // Preenche com zeros até completar 4 elementos
    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  transposeBoard(board = this.board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  addRandomTile() {
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

      this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  isGameOver() {
    // Verifica se há células vazias
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }
      }
    }

    // Verifica se há células adjacentes com o mesmo valor
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (
          (c < 3 && this.board[r][c] === this.board[r][c + 1]) ||
          (r < 3 && this.board[r][c] === this.board[r + 1][c])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  checkWinCondition() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.status = 'idle';
    this.score = 0;
  }
}

module.exports = Game;
