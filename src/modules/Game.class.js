'use strict';
export class Game {
  createBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board.length; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = newValue;

    return true;
  }

  getColumn(colIndex) {
    const column = [];

    for (let r = 0; r < this.board.length; r++) {
      column.push(this.board[r][colIndex]);
    }

    return column;
  }
  setColumn(colIndex, newColumn) {
    for (let r = 0; r < this.board.length; r++) {
      this.board[r][colIndex] = newColumn[r];
    }
  }

  constructor(initialState) {
    if (initialState) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.board = this.createBoard();
      this.addRandomTile();
      this.addRandomTile();
    }
    this.score = 0;
    this.hasWon = false;
    this.status = 'idle';
    this.isFirstMove = true;
  }

  mergeLine(lines) {
    const mergeLines = [];
    let scoreToAdd = 0;

    for (let i = 0; i < lines.length; i++) {
      const currentTile = lines[i];
      const nextTile = lines[i + 1];

      if (currentTile === nextTile) {
        const resultAddTile = currentTile * 2;

        mergeLines.push(resultAddTile);
        scoreToAdd += resultAddTile;

        if (resultAddTile === 2048) {
          this.hasWon = true;
        }
        i++;
      } else {
        mergeLines.push(currentTile);
      }
    }

    return {
      lines: mergeLines,
      score: scoreToAdd || 0,
    };
  }
  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  isBoardFull() {
    return this.board.every((row) => !row.includes(0));
  }

  hasPossibleMoves() {
    const BOARD_SIZE = this.board.length;

    if (this.board.flat().includes(0)) {
      return true;
    }

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const tile = this.board[r][c];

        if (tile === 0) {
          return true;
        }

        if (c < BOARD_SIZE - 1 && tile === this.board[r][c + 1]) {
          return true;
        }

        if (r < BOARD_SIZE - 1 && tile === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  // hasWon() {
  // return this.board.flat().includes(2048);
  // }

  getStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return 'win';
    }

    if (this.isBoardFull() && !this.hasPossibleMoves()) {
      this.status = 'lose';

      return 'lose';
    }

    return this.status;
  }

  start() {
    this.board = this.createBoard();
    this.score = 0;
    this.hasWon = false;

    this.isFirstMove = false;

    this.addRandomTile();
    this.addRandomTile();

    this.status = 'running';
  }

  restart() {
    this.start();
  }

  moveLeft() {
    let boardChanges = false;
    let totalScoreChange = 0;

    for (let r = 0; r < this.board.length; r++) {
      const originalRow = this.board[r];
      const filteredLine = originalRow.filter((tile) => tile !== 0);

      const mergeResult = this.mergeLine(filteredLine);
      const mergedLine = mergeResult.lines;

      totalScoreChange += mergeResult.score;

      const newRow = [...mergedLine];

      while (newRow.length < originalRow.length) {
        newRow.push(0);
      }

      if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
        this.board[r] = newRow;
        boardChanges = true;
      }
    }
    this.score += totalScoreChange;

    if (boardChanges) {
      this.addRandomTile();
      this.isFirstMove = false;
      this.getStatus();
    }

    return boardChanges;
  }

  moveRight() {
    let boardChanges = false;
    let totalScoreChange = 0;

    for (let r = 0; r < this.board.length; r++) {
      const originalRow = this.board[r];
      const filteredLine = originalRow.filter((tile) => tile !== 0);

      filteredLine.reverse();

      const mergeResult = this.mergeLine(filteredLine);
      const mergedLine = mergeResult.lines;

      totalScoreChange += mergeResult.score;
      mergedLine.reverse();

      const newRow = mergedLine.slice();

      while (newRow.length < originalRow.length) {
        newRow.unshift(0);
      }

      if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
        this.board[r] = newRow;
        boardChanges = true;
      }
    }
    this.score += totalScoreChange;

    if (boardChanges) {
      this.addRandomTile();
      this.isFirstMove = false;
      this.getStatus();
    }

    return boardChanges;
  }

  moveUp() {
    let boardChanges = false;
    let totalScoreChange = 0;

    for (let c = 0; c < this.board.length; c++) {
      const originalCol = this.getColumn(c);
      const filteredLine = originalCol.filter((tile) => tile !== 0);

      const mergeResult = this.mergeLine(filteredLine);
      const mergedLine = mergeResult.lines;

      totalScoreChange += mergeResult.score;

      const newColumn = mergedLine.slice();

      while (newColumn.length < originalCol.length) {
        newColumn.push(0);
      }

      if (JSON.stringify(originalCol) !== JSON.stringify(newColumn)) {
        this.setColumn(c, newColumn);
        boardChanges = true;
      }
    }
    this.score += totalScoreChange;

    if (boardChanges) {
      this.addRandomTile();
      this.isFirstMove = false;
      this.getStatus();
    }

    return boardChanges;
  }

  moveDown() {
    let boardChanges = false;
    let totalScoreChange = 0;

    for (let c = 0; c < this.board.length; c++) {
      const originalCol = this.getColumn(c);
      const filteredLine = originalCol.filter((tile) => tile !== 0);

      filteredLine.reverse();

      const mergeResult = this.mergeLine(filteredLine);
      const mergedLine = mergeResult.lines;

      totalScoreChange += mergeResult.score;
      mergedLine.reverse();

      const newColumn = mergedLine.slice();

      while (newColumn.length < originalCol.length) {
        newColumn.unshift(0);
      }

      if (JSON.stringify(originalCol) !== JSON.stringify(newColumn)) {
        this.setColumn(c, newColumn);
        boardChanges = true;
      }
    }
    this.score += totalScoreChange;

    if (boardChanges) {
      this.addRandomTile();
      this.isFirstMove = false;
      this.getStatus();
    }

    return boardChanges;
  }
}
