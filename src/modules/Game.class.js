'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.isGameStarted = false;
  }

  move(direction) {
    const isHorizontal = direction === 'left' || direction === 'right';
    const isReverse = direction === 'right' || direction === 'down';

    let boardToProcess = isHorizontal ? this.board : this.transpose(this.board);

    boardToProcess = boardToProcess.map((row) => {
      const processedRow = isReverse ? row.slice().reverse() : row;
      const nonZeroElements = processedRow.filter((value) => value !== 0);
      const combinedRow = this.joinValues(nonZeroElements, row.length);

      return isReverse ? combinedRow.reverse() : combinedRow;
    });

    this.board = isHorizontal ? boardToProcess : this.transpose(boardToProcess);
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

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    if (!this.isGameStarted) {
      return 'idle';
    }

    const hasWinningCell = this.board.some((row) => {
      return row.some((cell) => cell === 2048);
    });

    if (hasWinningCell) {
      return 'win';
    }

    const hasMoves = this.checkAvailableMoves();

    if (!hasMoves) {
      return 'lose';
    }

    return 'playing';
  }

  start() {
    const randomCell = this.getRandomCell(2);

    const newCells = this.addNewCell(randomCell);

    this.isGameStarted = true;

    return newCells;
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.isGameStarted = false;
  }

  getRandomCell(count) {
    const currentBoard = this.getState();

    const emptyCells = [];

    for (let row = 0; row < currentBoard.length; row++) {
      for (let col = 0; col < currentBoard[row].length; col++) {
        if (currentBoard[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    const cellsToAdd = Math.min(count, emptyCells.length);

    const randomCells = [];

    while (randomCells.length < cellsToAdd) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);

      randomCells.push(emptyCells[randomIndex]);
      emptyCells.splice(randomIndex, 1);
    }

    return randomCells;
  }

  addNewCell(newIndex) {
    const newCells = [];

    for (const cell of newIndex) {
      const row = cell.row;
      const col = cell.col;

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
      newCells.push({ row, col, value: this.board[row][col] });
    }

    return newCells;
  }

  checkAvailableMoves() {
    const hasOs = this.board.some((row) => row.some((cell) => cell === 0));

    const movesHorisontsl = this.board.some((row) => {
      return row.some((cell, index) => cell === row[index + 1]);
    });
    const transposedBoard = this.transpose(this.board);
    const movesVertical = transposedBoard.some((row) => {
      return row.some((cell, index) => cell === row[index + 1]);
    });

    return hasOs || movesHorisontsl || movesVertical;
  }

  joinValues(arr, targetLength) {
    const result = [];
    let scoreIncrease = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === arr[i + 1]) {
        const mergedValue = arr[i] * 2;

        result.push(mergedValue);
        scoreIncrease += mergedValue;
        i++;
      } else {
        result.push(arr[i]);
      }
    }

    while (result.length < targetLength) {
      result.push(0);
    }
    this.score += scoreIncrease;

    return result;
  }

  isBoardChanged(prevBoard, currentBoard) {
    for (let i = 0; i < prevBoard.length; i++) {
      for (let j = 0; j < prevBoard[i].length; j++) {
        if (prevBoard[i][j] !== currentBoard[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }
}

module.exports = Game;
