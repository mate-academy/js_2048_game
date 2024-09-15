'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
    this.cells = Array.from(document.querySelectorAll('.field-cell'));
    this.scoreDisplay = document.querySelector('.game-score');
    this.startMes = document.querySelector('.message-start');
    this.winMes = document.querySelector('.message-win');
    this.losMes = document.querySelector('.message-lose');
    this.button = document.querySelector('.button');
  }

  moveLeft() {
    const previousBoard = JSON.stringify(this.board);

    const newBoard = this.board.map((row) => {
      const filteredRow = row.filter((tile) => tile !== 0);
      const mergedRow = [];
      let skip = false;

      for (let i = 0; i < filteredRow.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        const currentTile = filteredRow[i];
        const nextTile = filteredRow[i + 1];

        if (currentTile === nextTile) {
          mergedRow.push(currentTile * 2);
          this.score += currentTile * 2;
          skip = true;
        } else {
          mergedRow.push(currentTile);
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }

      return mergedRow;
    });

    this.board = newBoard;

    if (previousBoard !== JSON.stringify(this.board)) {
      this.randomTile(); // Якщо дошка змінилася, додаємо новий тайл
    }
  }

  moveRight() {
    const previousBoard = JSON.stringify(this.board);

    const newBoard = this.board.map((row) => {
      const filteredRow = row.filter((tile) => tile !== 0).reverse();
      const mergedRow = [];
      let skip = false;

      for (let i = 0; i < filteredRow.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        const currentTile = filteredRow[i];
        const nextTile = filteredRow[i + 1];

        if (currentTile === nextTile) {
          mergedRow.push(currentTile * 2);
          this.score += currentTile * 2;
          skip = true;
        } else {
          mergedRow.push(currentTile);
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }

      return mergedRow.reverse();
    });

    this.board = newBoard;

    if (previousBoard !== JSON.stringify(this.board)) {
      this.randomTile(); // Якщо дошка змінилася, додаємо новий тайл
    }
  }

  moveUp() {
    const previousBoard = JSON.stringify(this.board);
    const newBoard = this.board.map((row) => row.slice());

    for (let col = 0; col < this.board[0].length; col++) {
      const filteredColumn = this.board
        .map((row) => row[col])
        .filter((tile) => tile !== 0);
      const mergedColumn = [];
      let skip = false;

      for (let i = 0; i < filteredColumn.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        const currentTile = filteredColumn[i];
        const nextTile = filteredColumn[i + 1];

        if (currentTile === nextTile) {
          mergedColumn.push(currentTile * 2);
          this.score += currentTile * 2;
          skip = true;
        } else {
          mergedColumn.push(currentTile);
        }
      }

      while (mergedColumn.length < this.board.length) {
        mergedColumn.push(0);
      }

      for (let row = 0; row < this.board.length; row++) {
        newBoard[row][col] = mergedColumn[row];
      }
    }

    this.board = newBoard;

    if (previousBoard !== JSON.stringify(this.board)) {
      this.randomTile(); // Якщо дошка змінилася, додаємо новий тайл
    }
  }

  moveDown() {
    const previousBoard = JSON.stringify(this.board);
    const newBoard = this.board.map((row) => row.slice());

    for (let col = 0; col < this.board[0].length; col++) {
      const filteredColumn = this.board
        .map((row) => row[col])
        .reverse()
        .filter((tile) => tile !== 0);
      const mergedColumn = [];
      let skip = false;

      for (let i = 0; i < filteredColumn.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        const currentTile = filteredColumn[i];
        const nextTile = filteredColumn[i + 1];

        if (currentTile === nextTile) {
          mergedColumn.push(currentTile * 2);
          this.score += currentTile * 2;
          skip = true;
        } else {
          mergedColumn.push(currentTile);
        }
      }

      while (mergedColumn.length < this.board.length) {
        mergedColumn.push(0);
      }

      mergedColumn.reverse();

      for (let row = 0; row < this.board.length; row++) {
        newBoard[row][col] = mergedColumn[row];
      }
    }

    this.board = newBoard;

    if (previousBoard !== JSON.stringify(this.board)) {
      this.randomTile(); // Якщо дошка змінилася, додаємо новий тайл
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    let amount = 0;

    this.board.map((row) => {
      amount += row.reduce((accum, currectNum) => accum + currectNum, 0);
    });

    return amount;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      return 'win';
    }

    const canMove = (board) => {
      for (const row of board) {
        for (let i = 0; i < row.length - 1; i++) {
          const currentTile = row[i];
          const nextTile = row[i + 1];

          if (currentTile === nextTile || currentTile === 0 || nextTile === 0) {
            return true;
          }
        }
      }

      for (let col = 0; col < board[0].length; col++) {
        for (let row = 0; row < board.length - 1; row++) {
          const currentCell = board[row][col];
          const nextCell = board[row + 1][col];

          if (currentCell === nextCell || currentCell === 0 || nextCell === 0) {
            return true;
          }
        }
      }

      return false;
    };

    if (!canMove(this.board)) {
      return 'lose';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.randomTile();
    this.randomTile();
    this.updateBoard();
    this.startMes.classList.add('hidden');
    this.changeButton();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'playing';
    this.randomTile();
    this.randomTile();
    this.updateBoard();
    this.losMes.classList.add('hidden');
    this.winMes.classList.add('hidden');
  }

  updateBoard() {
    const board = this.getState();

    board.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        const cell = this.cells[rowIndex * 4 + colIndex];

        cell.textContent = tile !== 0 ? tile : '';
        cell.className = `field-cell field-cell--${tile}`;
      });
    });

    this.scoreDisplay.textContent = this.getScore();
  }

  changeButton() {
    this.button.classList.remove('start');
    this.button.classList.add('restart');
    this.button.textContent = 'Restart';
  }

  randomTile() {
    const emptyTiles = this.board.reduce((acc, row, rowIndex) => {
      row.forEach((tile, tileIndex) => {
        if (tile === 0) {
          acc.push({ rowIndex, tileIndex });
        }
      });

      return acc;
    }, []);

    if (emptyTiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyTiles.length);
      const { rowIndex, tileIndex } = emptyTiles[randomIndex];
      const value = Math.random() < 0.9 ? 2 : 4;

      this.board[rowIndex][tileIndex] = value;
    }
  }

  winMessage() {
    this.winMes.classList.remove('hidden');
  }

  loseMessage() {
    this.losMes.classList.remove('hidden');
  }
}

module.exports = Game;
