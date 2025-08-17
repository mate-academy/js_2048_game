'use strict';

class Game {
  constructor() {
    this.board = this.createBoard();
    this.score = 0;
    this.hasWon = false;
  }

  createBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
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

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  restart() {
    this.board = this.createBoard();
    this.score = 0;
    this.hasWon = false;
    this.addRandomTile();
    this.addRandomTile();
  }

  isGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const value = this.board[r][c];

        if (
          (r < 3 && this.board[r + 1][c] === value) ||
          (c < 3 && this.board[r][c + 1] === value)
        ) {
          return false;
        }
      }
    }

    return true;
  }

  move(direction) {
    let moved = false;
    let newScore = 0;

    const processLine = (line) => {
      const merged = Array(4).fill(false);
      const newLine = line.filter((val) => val !== 0);

      for (let i = 0; i < newLine.length - 1; i++) {
        if (newLine[i] === newLine[i + 1] && !merged[i] && !merged[i + 1]) {
          newLine[i] *= 2;
          newScore += newLine[i];

          if (newLine[i] === 2048) {
            this.hasWon = true;
          }
          newLine.splice(i + 1, 1);
          merged[i] = true;
          moved = true;
        }
      }

      while (newLine.length < 4) {
        newLine.push(0);
      }

      if (JSON.stringify(newLine) !== JSON.stringify(line)) {
        moved = true;
      }

      return newLine;
    };

    if (direction === 'ArrowUp' || direction === 'ArrowDown') {
      const newBoard = this.createBoard();

      for (let c = 0; c < 4; c++) {
        const col = [
          this.board[0][c],
          this.board[1][c],
          this.board[2][c],
          this.board[3][c],
        ];

        if (direction === 'ArrowDown') {
          col.reverse();
        }

        const newCol = processLine(col);

        if (direction === 'ArrowDown') {
          newCol.reverse();
        }

        for (let r = 0; r < 4; r++) {
          newBoard[r][c] = newCol[r];
        }
      }
      this.board = newBoard;
    } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
      const newBoard = this.createBoard();

      for (let r = 0; r < 4; r++) {
        const row = [...this.board[r]];

        if (direction === 'ArrowRight') {
          row.reverse();
        }

        const newRow = processLine(row);

        if (direction === 'ArrowRight') {
          newRow.reverse();
        }
        newBoard[r] = newRow;
      }
      this.board = newBoard;
    }

    if (moved) {
      this.addRandomTile();
      this.score += newScore;
    }

    return moved;
  }
}

export { Game };
