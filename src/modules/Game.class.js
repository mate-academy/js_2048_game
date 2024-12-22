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

  moveLeft() {
    const previousBoard = this.getState();

    this.board.forEach((row, index) => {
      const nonZeroElements = row.filter((value) => value !== 0);
      const combinedRow = this.joinValues(nonZeroElements, row.length);

      this.board[index] = combinedRow;
    });

    if (this.isBoardChanged(previousBoard, this.board)) {
      const randomCell = this.getRandomCell(1);

      this.addNewCell(randomCell);
    }
  }

  moveRight() {
    const previousBoard = this.getState();

    this.board.forEach((row, index) => {
      const reversedRow = row.slice().reverse();

      const nonZeroElements = reversedRow.filter((value) => value !== 0);
      const combinedRow = this.joinValues(nonZeroElements, row.length);

      this.board[index] = combinedRow.reverse();
    });

    if (this.isBoardChanged(previousBoard, this.board)) {
      const randomCell = this.getRandomCell(1);

      this.addNewCell(randomCell);
    }
  }

  moveUp() {
    const previousBoard = this.getState();

    const transposedBoard = this.transpose(this.board);

    transposedBoard.forEach((row, index) => {
      const nonZeroElements = row.filter((value) => value !== 0);
      const combinedRow = this.joinValues(nonZeroElements, row.length);

      transposedBoard[index] = combinedRow;
    });

    this.board = this.transpose(transposedBoard);

    if (this.isBoardChanged(previousBoard, this.board)) {
      const randomCell = this.getRandomCell(1);

      this.addNewCell(randomCell);
    }
  }

  moveDown() {
    const previousBoard = this.getState();

    const transposedBoard = this.transpose(this.board);

    transposedBoard.forEach((row, index) => {
      const reversedRow = row.slice().reverse();

      const nonZeroElements = reversedRow.filter((value) => value !== 0);
      const combinedRow = this.joinValues(nonZeroElements, row.length);

      transposedBoard[index] = combinedRow.reverse();
    });

    this.board = this.transpose(transposedBoard);

    if (this.isBoardChanged(previousBoard, this.board)) {
      const randomCell = this.getRandomCell(1);

      this.addNewCell(randomCell);
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => [...row]);
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
    if (!this.isGameStarted) {
      return 'idle';
    }

    const hasWinningCell = this.board.some((row) => {
      row.some((cell) => cell === 2048);
    });

    if (hasWinningCell) {
      return 'win'; // Игрок выиграл
    }

    const hasMoves = this.checkAvailableMoves();

    if (!hasMoves) {
      return 'lose';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    const randomCell = this.getRandomCell(2);

    this.addNewCell(randomCell);
    this.isGameStarted = true;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.isGameStarted = false;
  }

  // Add your own methods here
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
    for (const cell of newIndex) {
      const row = cell.row;
      const col = cell.col;

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
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

        result.push(mergedValue); // Удваиваем значение
        // Добавляем удвоенное значение к увеличению очков
        scoreIncrease += mergedValue;
        i++; // Пропускаем следующий элемент, так как он уже объединен
      } else {
        result.push(arr[i]); // Добавляем значение без изменений
      }
    }

    // Добавляем оставшиеся пустые слоты в массив
    while (result.length < targetLength) {
      result.push(0); // Заполняем нулями (или другими значениями, если нужно)
    }
    this.score += scoreIncrease;

    return result;
  }

  isBoardChanged(prevBoard, currentBoard) {
    for (let i = 0; i < prevBoard.length; i++) {
      for (let j = 0; j < prevBoard[i].length; j++) {
        if (prevBoard[i][j] !== currentBoard[i][j]) {
          return true; // Нашли изменения
        }
      }
    }

    return false; // Изменений нет
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }
}

module.exports = Game;
