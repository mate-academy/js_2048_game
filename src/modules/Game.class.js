'use strict';

export default class Game {
  // Alteração: Removendo o parâmetro 'size'
  constructor(initialState = null) {
    this._size = 4; // Agora o tamanho é fixo em 4
    this._score = 0;
    this._status = 'in progress'; // Certifique-se de que a string está correta

    if (initialState) {
      this._initialState = initialState.map((row) => [...row]);
      this._board = initialState.map((row) => [...row]);
    } else {
      this._initialState = null;
      this._board = this._createEmptyBoard();
    }
  }

  start() {
    this._board = this._createEmptyBoard();
    this._score = 0;
    this._status = 'in progress';
    this._addRandomTile();
    this._addRandomTile();
  }

  getState() {
    // Retorna uma cópia profunda do tabuleiro
    return this._board.map((row) => [...row]);
  }

  getScore() {
    return this._score;
  }

  getStatus() {
    return this._status;
  }

  // Alteração no método restart()
  restart() {
    this._score = 0;
    this._status = 'in progress';

    if (this._initialState) {
      // Restaura o tabuleiro para o estado inicial
      this._board = this._initialState.map((row) => [...row]);
    } else {
      // Se não há estado inicial, começa um novo jogo
      this._board = this._createEmptyBoard();
      this._addRandomTile();
      this._addRandomTile();
    }

    this._checkWinOrLose();
  }

  _createEmptyBoard() {
    return Array.from({ length: this._size }, () => Array(this._size).fill(0));
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        if (this._board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this._board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  _checkWinOrLose() {
    if (this._board.some((row) => row.some((cell) => cell === 2048))) {
      this._status = 'won';

      return;
    }

    if (this._isGameOver()) {
      this._status = 'game over';
    }
  }

  _isGameOver() {
    // Verifica se há células vazias
    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        if (this._board[r][c] === 0) {
          return false;
        }
      }
    }

    // Verifica se há movimentos possíveis
    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        const current = this._board[r][c];

        if (c < this._size - 1 && current === this._board[r][c + 1]) {
          return false;
        }

        if (r < this._size - 1 && current === this._board[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }

  // Métodos de movimento público
  moveLeft() {
    if (this._status !== 'in progress') {
      return;
    }

    const oldBoard = this._board.map((row) => [...row]);

    this._board.forEach((row, rowIndex) => {
      this._board[rowIndex] = this._moveAndMergeLeft(row);
    });

    if (this._didBoardChange(oldBoard)) {
      this._addRandomTile();
      this._checkWinOrLose();
    }
  }

  moveRight() {
    if (this._status !== 'in progress') {
      return;
    }

    const oldBoard = this._board.map((row) => [...row]);

    this._board.forEach((row, rowIndex) => {
      this._board[rowIndex] = this._moveAndMergeLeft(row.reverse()).reverse();
    });

    if (this._didBoardChange(oldBoard)) {
      this._addRandomTile();
      this._checkWinOrLose();
    }
  }

  // moveUp
  moveUp() {
    if (this._status !== 'in progress') {
      return;
    }

    const oldBoard = this._board.map((row) => [...row]);

    // Transpõe a matriz para que as colunas se tornem linhas
    const transposedBoard = this._createEmptyBoard();

    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        transposedBoard[r][c] = this._board[c][r];
      }
    }

    // Aplica o movimento para a esquerda nas novas "linhas"
    transposedBoard.forEach((row, rowIndex) => {
      transposedBoard[rowIndex] = this._moveAndMergeLeft(row);
    });

    // Transpõe a matriz de volta
    const newBoard = this._createEmptyBoard();

    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        newBoard[r][c] = transposedBoard[c][r];
      }
    }
    this._board = newBoard;

    if (this._didBoardChange(oldBoard)) {
      this._addRandomTile();
      this._checkWinOrLose();
    }
  }

  // moveDown
  moveDown() {
    if (this._status !== 'in progress') {
      return;
    }

    const oldBoard = this._board.map((row) => [...row]);

    // Transpõe a matriz
    const transposedBoard = this._createEmptyBoard();

    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        transposedBoard[r][c] = this._board[c][r];
      }
    }

    // Inverte as linhas para simular o movimento para baixo
    transposedBoard.forEach((row, rowIndex) => {
      transposedBoard[rowIndex] = this._moveAndMergeLeft(
        row.reverse(),
      ).reverse();
    });

    // Transpõe a matriz de volta
    const newBoard = this._createEmptyBoard();

    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        newBoard[r][c] = transposedBoard[c][r];
      }
    }
    this._board = newBoard;

    if (this._didBoardChange(oldBoard)) {
      this._addRandomTile();
      this._checkWinOrLose();
    }
  }

  // Métodos auxiliares privados
  _didBoardChange(oldBoard) {
    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        if (oldBoard[r][c] !== this._board[r][c]) {
          return true;
        }
      }
    }

    return false;
  }

  _moveAndMergeLeft(row) {
    const newRow = row.filter((cell) => cell !== 0);
    const mergedRow = [];

    for (let i = 0; i < newRow.length; i++) {
      if (newRow[i] === newRow[i + 1]) {
        const mergedValue = newRow[i] * 2;

        this._score += mergedValue;
        mergedRow.push(mergedValue);
        i++; // Pula a próxima célula, já que ela foi mesclada
      } else {
        mergedRow.push(newRow[i]);
      }
    }

    while (mergedRow.length < this._size) {
      mergedRow.push(0);
    }

    return mergedRow;
  }
}
