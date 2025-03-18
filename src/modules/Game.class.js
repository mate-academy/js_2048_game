class Game {
  constructor() {
    this.board = this.createEmptyBoard();
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
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addNewTile();
    this.addNewTile();

  }

  restart() {
    this.start();
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  addNewTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  getEmptyCells() {
    return this.board
      .flatMap((row, r) => row.map((cell, c) => (cell === 0 ? { r, c } : null)))
      .filter(Boolean);
  }

  moveLeft() {
    return this.shiftTiles((row) => this.mergeRow(row));
  }

  moveRight() {
    return this.shiftTiles((row) => {
      let mergedRow = this.mergeRow(row.slice().reverse());
      return mergedRow.reverse();
    });
  }

  moveUp() {
    this.transposeBoard();

    const moved = this.moveLeft();

    this.transposeBoard();

    return moved;
  }

  moveDown() {
    this.transposeBoard();

    const moved = this.moveRight();

    this.transposeBoard();

    return moved;
  }

  shiftTiles(transform) {
    let moved = false;
    let newBoard = this.board.map((row) => {
      const newRow = transform(row);
      if (JSON.stringify(row) !== JSON.stringify(newRow)) {
        moved = true;
      }
      return newRow;
    });

    if (moved) {
      this.board = newBoard;
      this.addNewTile();
      this.checkGameOver();
    }

    return moved;
  }


  mergeRow(row) {
    const filtered = row.filter((val) => val !== 0);
    const merged = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        this.score += filtered[i] * 2;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  /* eslint-disable function-paren-newline */
  transposeBoard() {
    this.board = this.board[0].map((_, colIndex) =>
      this.board.map((row) => row[colIndex]),
    );
  }
  /* eslint-enable function-paren-newline */

  checkGameOver() {
    if (this.board.some(row => row.includes(2048))) {
      this.status = 'win';
    } else if (this.getEmptyCells().length === 0 && !this.canMerge()) {
      this.status = 'lose';
    }
  }

  /* eslint-disable function-paren-newline */
  canMerge() {
    return this.board.some((row, r) =>
      row.some(
        (val, c) =>
          val !== 0 &&
          ((c < 3 && val === row[c + 1]) ||
            (r < 3 && val === this.board[r + 1][c])),
      ),
    );
  }
}
/* eslint-enable function-paren-newline */

export default Game;
