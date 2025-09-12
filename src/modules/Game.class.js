export class Game {
  constructor(initialState = null) {
    this.initialState = initialState ? JSON.parse(JSON.stringify(initialState)) : null;
    this.board = this.initialState ? JSON.parse(JSON.stringify(this.initialState)) : this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.updateStatus();
    if (!this.initialState) this.spawnTile();
    this.spawnTile();
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  getState() {
    return JSON.parse(JSON.stringify(this.board));
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  restart() {
    this.board = this.initialState ? JSON.parse(JSON.stringify(this.initialState)) : this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.updateStatus();
    if (!this.initialState) this.spawnTile();
    this.spawnTile();
  }

  updateStatus() {
    if (this.board.flat().includes(2048)) this.status = 'won';
    else if (!this.canMove()) this.status = 'lost';
    else this.status = 'playing';
  }

  canMove() {
    // Check if any move is possible
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) return true;
        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) return true;
        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) return true;
      }
    }
    return false;
  }

  spawnTile() {
    const empty = [];
    this.board.forEach((row, i) => row.forEach((cell, j) => {
      if (cell === 0) empty.push([i, j]);
    }));
    if (!empty.length) return;

    const [i, j] = empty[Math.floor(Math.random() * empty.length)];
    this.board[i][j] = Math.random() < 0.1 ? 4 : 2;
  }

  mergeRowLeft(row) {
    const newRow = row.filter(val => val !== 0);
    let gained = 0;
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        gained += newRow[i];
        newRow[i + 1] = 0;
      }
    }
    const finalRow = newRow.filter(val => val !== 0);
    while (finalRow.length < 4) finalRow.push(0);
    return { row: finalRow, gained, produced2048: finalRow.includes(2048) };
  }

  makeMove(direction) {
    const oldBoard = this.getState();
    let moved = false;
    let totalGained = 0;
    let produced2048 = false;

    const rotateLeft = (board) => board[0].map((_, i) => board.map(row => row[i])).reverse();
    const rotateRight = (board) => board[0].map((_, i) => board.map(row => row[row.length - 1 - i]));

    let newBoard = JSON.parse(JSON.stringify(this.board));

    const applyMove = (board) => {
      const resBoard = board.map(row => {
        const { row: newRow, gained, produced2048: won } = this.mergeRowLeft(row);
        totalGained += gained;
        if (won) produced2048 = true;
        return newRow;
      });
      return resBoard;
    };

    if (direction === 'left') newBoard = applyMove(newBoard);
    else if (direction === 'right') newBoard = applyMove(newBoard.map(r => r.reverse())).map(r => r.reverse());
    else if (direction === 'up') {
      newBoard = rotateLeft(newBoard);
      newBoard = applyMove(newBoard);
      newBoard = rotateRight(newBoard);
    } else if (direction === 'down') {
      newBoard = rotateLeft(newBoard);
      newBoard = applyMove(newBoard.map(r => r.reverse())).map(r => r.reverse());
      newBoard = rotateRight(newBoard);
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(newBoard)) {
      this.board = newBoard;
      this.score += totalGained;
      if (produced2048) this.status = 'won';
      this.spawnTile();
      this.updateStatus();
      moved = true;
    }

    return moved;
  }

  moveLeft() { return this.makeMove('left'); }
  moveRight() { return this.makeMove('right'); }
  moveUp() { return this.makeMove('up'); }
  moveDown() { return this.makeMove('down'); }
}
