class Game {
  constructor(initialState = null) {
    this.board = initialState || this.generateEmptyBoard();
    this.score = 0;
    this.status = "idle";
  }

  generateEmptyBoard() {
    return Array(4).fill(null).map(() => Array(4).fill(0));
  }

  start() {
    this.board = this.generateEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.status = "playing";
    this.score = 0;
    this.updateUI();
  }

  restart() {
    this.start();
  }

  moveLeft() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
      let newRow = this.slideAndMerge(this.board[row]);
      if (newRow.join() !== this.board[row].join()) moved = true;
      this.board[row] = newRow;
    }
    if (moved) this.afterMove();
  }

  moveRight() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
      let newRow = this.slideAndMerge(this.board[row].slice().reverse()).reverse();
      if (newRow.join() !== this.board[row].join()) moved = true;
      this.board[row] = newRow;
    }
    if (moved) this.afterMove();
  }

  moveUp() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
      let colArray = [this.board[0][col], this.board[1][col], this.board[2][col], this.board[3][col]];
      let newCol = this.slideAndMerge(colArray);
      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) moved = true;
        this.board[row][col] = newCol[row];
      }
    }
    if (moved) this.afterMove();
  }

  moveDown() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
      let colArray = [this.board[0][col], this.board[1][col], this.board[2][col], this.board[3][col]];
      let newCol = this.slideAndMerge(colArray.reverse()).reverse();
      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) moved = true;
        this.board[row][col] = newCol[row];
      }
    }
    if (moved) this.afterMove();
  }

  slideAndMerge(row) {
    let nonZeroTiles = row.filter(tile => tile !== 0);
    for (let i = 0; i < nonZeroTiles.length - 1; i++) {
      if (nonZeroTiles[i] === nonZeroTiles[i + 1]) {
        nonZeroTiles[i] *= 2;
        this.score += nonZeroTiles[i];
        nonZeroTiles[i + 1] = 0;
      }
    }
    return nonZeroTiles.filter(tile => tile !== 0).concat(Array(4 - nonZeroTiles.length).fill(0));
  }

  addRandomTile() {
    let emptyCells = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    if (emptyCells.length === 0) return;
    let { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  isGameWon() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) return true;
      }
    }
    return false;
  }

  isGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) return false;
        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) return false;
        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) return false;
      }
    }
    return true;
  }

  afterMove() {
    this.addRandomTile();
    if (this.isGameWon()) {
      this.status = "win";
    } else if (this.isGameOver()) {
      this.status = "lose";
    }
    this.updateUI();
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

  updateUI() {
    console.log(this.board);
    console.log(`Score: ${this.score}`);
    console.log(`Status: ${this.status}`);
  }
}

module.exports = Game;