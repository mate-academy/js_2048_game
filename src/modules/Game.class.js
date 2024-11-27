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
    this.winCallback = winCallback;
    this.loseCallback = loseCallback;
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

  findEmptyCell() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board.length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  addRandomTile() {
    const emptyCell = this.findEmptyCell();

    if (!emptyCell) {
      return;
    }

    if (this.score === 0) {
      this.board[emptyCell.row][emptyCell.col] = 2;
    }
    this.updateBoard();
  }

  addRandomCellAfterMoving() {
    const emptyCell = this.findEmptyCell();

    if (!emptyCell) {
      return;
    }

    this.board[emptyCell.row][emptyCell.col] = Math.random() < 0.9 ? 2 : 4;
    this.updateBoard();
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

  updateBoardAfterMoving() {
    this.addRandomCellAfterMoving();
    this.updateBoard();
    this.getStatus();
  }

  moveHorizontal(fillWithZeros) {
    for (let row = 0; row < this.board.length; row++) {
      const currentRow = this.board[row].filter((val) => val !== 0);

      const mergedRow = [];

      for (let i = 0; i < currentRow.length; i++) {
        const currentValue = currentRow[i];

        if (currentValue === currentRow[i + 1]) {
          const doubled = currentValue * 2;

          mergedRow.push(doubled);
          this.getScore(true, doubled);
          i++;
        } else {
          mergedRow.push(currentValue);
        }
      }

      while (mergedRow.length < this.board[row].length) {
        fillWithZeros(mergedRow);
      }

      this.board[row] = mergedRow;
    }
  }

  moveLeft() {
    this.moveHorizontal((array) => array.push(0));
    this.updateBoardAfterMoving();
  }

  moveRight() {
    this.moveHorizontal((array) => array.unshift(0));
    this.updateBoardAfterMoving();
  }

  moveUp() {
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
          canMerge[i] = false;
          this.getScore(true, newColumn[i]);
        }
      }

      while (newColumn.length < this.board.length) {
        newColumn.push(0);
      }

      this.updateColumn(col, newColumn);
    }

    this.updateBoardAfterMoving();
  }

  moveDown() {
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
          canMerge[i] = false;
          this.getScore(true, newColumn[i]);
        }
      }

      while (newColumn.length < this.board.length) {
        newColumn.unshift(0);
      }

      this.updateColumn(col, newColumn);
    }

    this.updateBoardAfterMoving();
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

      return this.status;
    }

    let has2048Cell = false;
    let canMove = false;

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        const currentCell = this.board[row][col];

        if (currentCell === 2048) {
          has2048Cell = true;
        }

        if (canMove) {
          continue;
        }

        if (currentCell === 0) {
          canMove = true;
          continue;
        }

        const canMoveVertically =
          row < this.board.length - 1 &&
          currentCell === this.board[row + 1][col];

        const canMoveHorrizontally =
          col < this.board[row].length - 1 &&
          currentCell === this.board[row][col + 1];

        if (canMoveVertically || canMoveHorrizontally) {
          canMove = true;
        }
      }

      if (has2048Cell) {
        this.status = WIN;
        this.winCallback();
        break;
      }

      if (canMove) {
        this.status = PLAYING;
        break;
      }

      this.status = LOSE;
      this.loseCallback();
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
