export class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(0));
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[i][j] = Math.random() < 0.9 ? 2 : 4;

      return [i, j];
    }

    return null;
  }

  start() {
    if (this.status === 'idle') {
      this.addRandomTile();
      this.addRandomTile();
      this.status = 'playing';
    }
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  merge(row) {
    const newRow = row.filter((val) => val !== 0);
    const mergedPositions = [];

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        mergedPositions.push(i);
        newRow.splice(i + 1, 1);
        i++;
      }
    }

    return [
      [...newRow, ...Array(this.size - newRow.length).fill(0)],
      mergedPositions,
    ];
  }

  moveLeft() {
    let moved = false;
    const mergedTiles = [];

    for (let i = 0; i < this.size; i++) {
      const [newRow, mergedPositions] = this.merge(this.board[i]);

      if (!newRow.every((val, idx) => val === this.board[i][idx])) {
        moved = true;
        mergedPositions.forEach((pos) => mergedTiles.push([i, pos]));
      }
      this.board[i] = newRow;
    }

    return this.finishMove(moved, mergedTiles);
  }

  moveRight() {
    let moved = false;
    const mergedTiles = [];

    for (let i = 0; i < this.size; i++) {
      const reversed = this.board[i].slice().reverse();
      const [newRow, mergedPositions] = this.merge(reversed);
      const finalRow = newRow.reverse();

      if (!finalRow.every((val, idx) => val === this.board[i][idx])) {
        moved = true;

        mergedPositions.forEach((pos) => {
          mergedTiles.push([i, this.size - 1 - pos]);
        });
      }
      this.board[i] = finalRow;
    }

    return this.finishMove(moved, mergedTiles);
  }

  moveUp() {
    let moved = false;
    const mergedTiles = [];

    for (let j = 0; j < this.size; j++) {
      const column = this.board.map((row) => row[j]);
      const [newColumn, mergedPositions] = this.merge(column);

      if (!newColumn.every((val, idx) => val === column[idx])) {
        moved = true;
        mergedPositions.forEach((pos) => mergedTiles.push([pos, j]));
      }

      for (let i = 0; i < this.size; i++) {
        this.board[i][j] = newColumn[i];
      }
    }

    return this.finishMove(moved, mergedTiles);
  }

  moveDown() {
    let moved = false;
    const mergedTiles = [];

    for (let j = 0; j < this.size; j++) {
      const column = this.board.map((row) => row[j]).reverse();
      const [newColumn, mergedPositions] = this.merge(column);
      const finalColumn = newColumn.reverse();

      if (!finalColumn.every((val, idx) => val === column[idx])) {
        moved = true;

        mergedPositions.forEach((pos) => {
          mergedTiles.push([this.size - 1 - pos, j]);
        });
      }

      for (let i = 0; i < this.size; i++) {
        this.board[i][j] = finalColumn[i];
      }
    }

    return this.finishMove(moved, mergedTiles);
  }

  finishMove(moved, mergedTiles) {
    let newTile = null;

    if (moved) {
      newTile = this.addRandomTile();

      if (this.board.some((row) => row.includes(2048))) {
        this.status = 'won';
      } else if (!this.canMove()) {
        this.status = 'lost';
      }

      return [true, mergedTiles, newTile];
    }

    return [false, [], null];
  }

  canMove() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
}
