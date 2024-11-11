'use strict';

const IDLE = 'idle';
const PLAYING = 'playing';

export const WIN = 'win';
export const LOSE = 'lose';

export class Game {
  constructor(initialState, winCallback, loseCallback) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;

    this.status = IDLE;
    this.isStarted = false;
    this.winCallback = winCallback;
    this.loseCallback = loseCallback;
  }

  moveTile(fromCell, toCell) {
    const fromCellRect = fromCell.getBoundingClientRect();
    const toCellRect = toCell.getBoundingClientRect();

    const xOffset = toCellRect.left - fromCellRect.left;
    const yOffset = toCellRect.top - fromCellRect.top;

    fromCell.style.setProperty('--x-offset', `${xOffset}px`);
    fromCell.style.setProperty('--y-offset', `${yOffset}px`);

    fromCell.classList.add('moving');
  }

  updateBoard() {
    const cells = document.querySelectorAll('.field-cell');

    let cellIndex = 0;

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        const cell = cells[cellIndex++];
        const value = this.board[row][col];
        const previousValue = cell.textContent;

        cell.classList.remove(`field-cell--${previousValue}`);

        if (value === 0) {
          cell.textContent = '';
        } else {
          cell.classList.add(`field-cell--${value}`);
          cell.textContent = value;
        }
      }
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      if (this.score === 0) {
        this.board[row][col] = 2;
      }
      this.updateBoard();
    }
  }

  addRandomCellAfterMoving() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
      this.updateBoard();
    }
  }

  createColumn(col) {
    const newColumn = [];

    for (let row = 0; row < this.board.length; row++) {
      if (this.board[row][col] !== 0) {
        newColumn.push(this.board[row][col]);
      }
    }

    return newColumn;
  }

  updateColumn(col, newColumn) {
    let moved = false;

    for (let row = 0; row < this.board.length; row++) {
      if (this.board[row][col] !== newColumn[row]) {
        this.board[row][col] = newColumn[row];
        moved = true;
      }
    }

    return moved;
  }

  resetGameStart() {
    this.score = 0;
    this.status = PLAYING;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addRandomTile();
    this.addRandomTile();
  }

  mergeTitles(newRow, canMerge) {
    const mergedThisMove = [];

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow.splice(i + 1, 1);
        canMerge[i] = false;
        mergedThisMove.push(i);
      }
    }

    return mergedThisMove;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.board.length; row++) {
      const currentRow = this.board[row].filter((val) => val !== 0);
      const mergedRow = [];

      let skip = false;

      for (let i = 0; i < currentRow.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        if (currentRow[i] === currentRow[i + 1]) {
          mergedRow.push(currentRow[i] * 2);
          this.getScore(true, currentRow[i] * 2);
          skip = true;
          moved = true;
        } else {
          mergedRow.push(currentRow[i]);
        }
      }

      while (mergedRow.length < this.board[row].length) {
        mergedRow.push(0);
      }

      if (!moved) {
        for (let i = 0; i < this.board[row].length; i++) {
          if (this.board[row][i] !== mergedRow[i]) {
            moved = true;
            break;
          }
        }
      }

      this.board[row] = mergedRow;
    }

    if (moved) {
      this.addRandomCellAfterMoving();
      this.updateBoard();
      this.getStatus();
    }

    return moved;
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < this.board.length; row++) {
      const currentRow = this.board[row].filter((val) => val !== 0);

      const mergedRow = [];
      let skip = false;

      for (let i = 0; i < currentRow.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        if (currentRow[i] === currentRow[i + 1]) {
          mergedRow.push(currentRow[i] * 2);
          this.getScore(true, currentRow[i] * 2);
          skip = true;
          moved = true;
        } else {
          mergedRow.push(currentRow[i]);
        }
      }

      while (mergedRow.length < this.board[row].length) {
        mergedRow.unshift(0);
      }

      for (let i = 0; i < this.board[row].length; i++) {
        if (this.board[row][i] !== mergedRow[i]) {
          moved = true;
          break;
        }
      }

      this.board[row] = mergedRow;
    }

    if (moved) {
      this.addRandomCellAfterMoving();
      this.updateBoard();
      this.getStatus();
    }

    return moved;
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < this.board.length; col++) {
      const newColumn = this.createColumn(col);
      const canMerge = new Array(newColumn.length).fill(true);

      for (let i = 0; i < newColumn.length - 1; i++) {
        if (
          newColumn[i] === newColumn[i + 1] &&
          canMerge[i] &&
          canMerge[i + 1]
        ) {
          newColumn[i] *= 2;
          newColumn.splice(i + 1, 1);
          moved = true;
          canMerge[i] = false;
          this.getScore(moved, newColumn[i]);
        }
      }

      while (newColumn.length < this.board.length) {
        newColumn.push(0);
      }

      moved = this.updateColumn(col, newColumn) || moved;
    }

    if (moved) {
      this.addRandomCellAfterMoving();
      this.updateBoard();
      this.getStatus();
    }

    return moved;
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < this.board.length; col++) {
      const newColumn = this.createColumn(col);
      const canMerge = new Array(newColumn.length).fill(true);

      for (let i = newColumn.length - 1; i > 0; i--) {
        if (
          newColumn[i] === newColumn[i - 1] &&
          canMerge[i] &&
          canMerge[i - 1]
        ) {
          newColumn[i] *= 2;
          newColumn.splice(i - 1, 1);
          moved = true;
          canMerge[i] = false;
          this.getScore(moved, newColumn[i]);
        }
      }

      while (newColumn.length < this.board.length) {
        newColumn.unshift(0);
      }

      moved = this.updateColumn(col, newColumn) || moved;
    }

    if (moved) {
      this.addRandomCellAfterMoving();
      this.updateBoard();
      this.getStatus();
    }

    return moved;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  getStatus() {
    if (this.score === 0) {
      this.status = IDLE;
    } else {
      let hasEmptyCell = false;
      let has2048Cell = false;
      let canMove = false;

      for (let row = 0; row < this.board.length; row++) {
        for (let col = 0; col < this.board[row].length; col++) {
          if (this.board[row][col] === 0) {
            hasEmptyCell = true;
          }

          if (this.board[row][col] === 2048) {
            has2048Cell = true;
          }

          if (
            row < this.board.length - 1 &&
            this.board[row][col] === this.board[row + 1][col]
          ) {
            canMove = true;
          }

          if (
            col < this.board[row].length - 1 &&
            this.board[row][col] === this.board[row][col + 1]
          ) {
            canMove = true;
          }
        }
      }

      if (has2048Cell) {
        this.status = WIN;
        this.winCallback();
      } else if (hasEmptyCell || canMove) {
        this.status = PLAYING;
      } else {
        this.status = LOSE;
        this.loseCallback();
      }
    }

    return this.status;
  }

  start() {
    this.resetGameStart();
  }

  restart() {
    this.resetGameStart();
  }
}
