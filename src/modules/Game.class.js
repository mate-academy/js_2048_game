/* eslint-disable prettier/prettier */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
const INITIAL_STATE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

export default class Game {
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
  constructor(initialState = null) {
    this.size = 4;

    this.board = initialState
      ? this.copyState(initialState)
      : this.createEmptyBoard();
    this.status = "idle";
    this.score = 0;
  }

  copyState(state) {
    return state.map(row => [...row]);
  }

  arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  moveLeft(board = this.board) {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = board.map(row => {
      let newRow = row.filter(num => num !== 0); // Remove os zeros

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i]; // Atualiza a pontuação
          newRow[i + 1] = 0;
        }
      }

      newRow = newRow.filter(num => num !== 0);

      return [...newRow, ...Array(this.size - newRow.length).fill(0)];
    });

    // Verifica se o tabuleiro mudou
    if (JSON.stringify(newBoard) !== JSON.stringify(this.board)) {
      this.board = newBoard; // Atualiza o tabuleiro principal

      this.board = this.addRandomCell(this.board);
      this.checkGameState();
    }
  }

  moveRight(board = this.board) {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = board.map(row => {
      const reversedRow = [...row].reverse();
      let newRow = reversedRow.filter(num => num !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
        }
      }

      newRow = newRow.filter(num => num !== 0);

      return [...newRow, ...Array(this.size - newRow.length).fill(0)].reverse();
    });

    if (JSON.stringify(newBoard) !== JSON.stringify(this.board)) {
      this.board = newBoard;

      this.board = this.addRandomCell(this.board);
      this.checkGameState();
    }
  }

  moveUp(board = this.board) {
    if (this.status !== 'playing') {
      return;
    }

    // Cria uma nova matriz para o tabuleiro modificado
    const newBoard = this.createEmptyBoard();

    for (let col = 0; col < this.size; col++) {
      const column = this.board.map(row => row[col]); // Extrai a coluna
      let newColumn = column.filter(num => num !== 0); // Remove os zeros

      // Combina as células adjacentes com o mesmo valor
      for (let i = 0; i < newColumn.length - 1; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          newColumn[i] *= 2;
          this.score += newColumn[i]; // Atualiza a pontuação
          newColumn[i + 1] = 0;
        }
      }

      newColumn = newColumn.filter(num => num !== 0);

      // Preenche os espaços vazios e atualiza a nova matriz
      const paddedColumn =
        [...newColumn, ...Array(this.size - newColumn.length).fill(0)];

      for (let row = 0; row < this.size; row++) {
        newBoard[row][col] = paddedColumn[row];
      }
    }

    // Verifica se o tabuleiro mudou
    if (JSON.stringify(newBoard) !== JSON.stringify(this.board)) {
      this.board = newBoard; // Atualiza o tabuleiro principal

      this.board = this.addRandomCell(this.board); // Adiciona uma nova célula
      this.checkGameState(); // Verifica o estado do jogo
    }
  }

  moveDown(board = this.board) {
    if (this.status !== 'playing') {
      return;
    }

    // Cria uma nova matriz para o tabuleiro modificado
    const newBoard = this.createEmptyBoard();

    for (let col = 0; col < this.size; col++) {
      const column = this.board.map(row => row[col]); // Extrai a coluna

      // Inverte a coluna para tratar o movimento "para baixo" como "para cima"
      const reversedColumn = [...column].reverse();

      // Remove os zeros
      let newColumn = reversedColumn.filter(num => num !== 0);

      // Combina as células adjacentes com o mesmo valor
      for (let i = 0; i < newColumn.length - 1; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          newColumn[i] *= 2;
          this.score += newColumn[i]; // Atualiza a pontuação
          newColumn[i + 1] = 0;
        }
      }

      newColumn = newColumn.filter(num => num !== 0);

      /*
        Preenche os espaços vazios e inverte novamente
        para restaurar a ordem original
       */
      const paddedColumn = [
        ...newColumn,
        ...Array(this.size - newColumn.length).fill(0),
      ].reverse();

      // Atualiza a nova matriz com a coluna processada
      for (let row = 0; row < this.size; row++) {
        newBoard[row][col] = paddedColumn[row];
      }
    }

    // Verifica se o tabuleiro mudou
    if (JSON.stringify(newBoard) !== JSON.stringify(this.board)) {
      this.board = newBoard; // Atualiza o tabuleiro principal

      this.board = this.addRandomCell(this.board); // Adiciona uma nova célula
      this.checkGameState(); // Verifica o estado do jogo
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
    return this.copyState(this.board);
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
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.board = this.addRandomCell(this.board);
    this.board = this.addRandomCell(this.board);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.copyState(INITIAL_STATE);
    this.score = 0;
    this.status = "playing";
    this.board = this.addRandomCell(this.board);
    this.board = this.addRandomCell(this.board);
  }

  merge(line) {
    const newLine = line.filter((val) => val !== null);

    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        this.score += newLine[i];
        newLine[i + 1] = null;
      }
    }

    return newLine
      .filter((val) => val !== null)
      .concat(Array(this.size).fill(null))
      .slice(0, this.size);
  }

  createEmptyBoard() {
    return Array(this.size).fill(null).map(() => Array(this.size).fill(0));
  }

  addRandomCell(board = this.board) {
    const newBoard = board.map((line) => [...line]);
    const emptyCells = [];

    newBoard.forEach((line, rowIndex) => {
      line.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return newBoard;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;

    return newBoard;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  generateRandomValue() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  makeMove(transform, isColumn = false) {
    const prevBoard = JSON.stringify(this.board);
    const newBoard = this.createEmptyBoard();

    for (let i = 0; i < this.size; i++) {
      const line = isColumn ? this.getColumn(i) : [...this.board[i]];
      const newLine = transform(line);

      if (isColumn) {
        this.setColumn(i, newLine);
      } else {
        newBoard[i] = newLine;
      }
    }

    // Verifica se o tabuleiro mudou
    if (JSON.stringify(newBoard) !== prevBoard) {
      this.board = newBoard;
      this.addRandomCell(this.board);
      this.checkGameState();
    }
  }

  combine(line) {
    const newLine = line.filter((num) => num !== 0);

    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        this.score += newLine[i];
        newLine.splice(i + 1, 1);
        newLine.push(0);
      }
    }

    return [...newLine, ...Array(this.size - newLine.length).fill(0)];
  }

  getColumn(index) {
    return this.board.map((row) => row[index]);
  }

  setColumn(index, newCol) {
    for (let i = 0; i < this.size; i++) {
      this.board[i][index] = newCol[i];
    }
  }

  checkGameState() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (this.hasMoves()) {
      return;
    }
    this.status = 'lose';
  }

  hasMoves() {
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