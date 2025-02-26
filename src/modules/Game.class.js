'use strict';

class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.board = initialState ? initialState.board : this.createEmptyBoard();
    this.score = initialState ? initialState.score : 0;
    this.status = 'playing';

    if (!initialState) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
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

  move(direction) {
    let moved = false;
    const newBoard = this.createEmptyBoard();
    const merged = this.createEmptyBoard().map((row) => row.map(() => false));

    const getCells = () => {
      const cells = [];

      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          cells.push({ r, c });
        }
      }

      if (direction === 'right' || direction === 'down') {
        cells.reverse();
      }

      return cells;
    };

    // eslint-disable-next-line no-shadow
    const moveCells = (r, c, dr, dc) => {
      let nr = r;
      let nc = c;
      const value = this.board[r][c];

      if (value === 0) {
        return;
      }

      while (true) {
        const nextR = nr + dr;
        const nextC = nc + dc;

        if (
          nextR < 0 ||
          nextR >= this.size ||
          nextC < 0 ||
          nextC >= this.size
        ) {
          break;
        }

        if (newBoard[nextR][nextC] === 0) {
          nr = nextR;
          nc = nextC;
        } else if (newBoard[nextR][nextC] === value && !merged[nextR][nextC]) {
          newBoard[nextR][nextC] *= 2;
          this.score += newBoard[nextR][nextC];
          merged[nextR][nextC] = true;
          moved = true;

          return;
        } else {
          break;
        }
      }

      if (nr !== r || nc !== c) {
        moved = true;
      }
      newBoard[nr][nc] = value;
    };

    const directions = {
      left: [0, -1],
      right: [0, 1],
      up: [-1, 0],
      down: [1, 0],
    };
    const [dr, dc] = directions[direction];

    getCells().forEach(({ r, c }) => moveCells(r, c, dr, dc));

    if (moved) {
      this.board = newBoard;
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveLeft() {
    this.move('left');
  }
  moveRight() {
    this.move('right');
  }
  moveUp() {
    this.move('up');
  }
  moveDown() {
    this.move('down');
  }

  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'won';
    } else if (!this.board.flat().includes(0) && !this.canMove()) {
      this.status = 'lost';
    }
  }

  canMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (
          (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) ||
          (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  getScore() {
    return this.score;
  }
  getState() {
    return { board: this.board, score: this.score, status: this.status };
  }
  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }
  restart() {
    this.start();
    this.score = 0;
  }
}

export default Game;
module.exports = Game;
